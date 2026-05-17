import hashlib
import http.cookies
import http.server
import json
import os
import re
import secrets
import threading
import time
import uuid
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parent
HOST = os.environ.get("HOST", "127.0.0.1")
PORT = int(os.environ.get("PORT", "4173"))
DATA_DIR = Path(os.environ.get("BREAKVERSE_DATA_DIR", ROOT / "data"))
DATA_FILE = DATA_DIR / "accounts.json"
SESSION_TTL = int(os.environ.get("BREAKVERSE_SESSION_TTL", str(60 * 60 * 24 * 7)))
PBKDF2_ITERATIONS = int(os.environ.get("BREAKVERSE_PBKDF2_ITERATIONS", "210000"))
COOKIE_NAME = "bv_session"
CSRF_COOKIE_NAME = "bv_csrf"
USERNAME_RE = re.compile(r"^[A-Za-z0-9_-]{3,24}$")
TOKEN_RE = re.compile(r"^[A-Za-z0-9_-]{24,160}$")
STORE_LOCK = threading.RLock()
LOGIN_LOCK = threading.RLock()
LOGIN_ATTEMPTS = {}
LOGIN_LIMIT = int(os.environ.get("BREAKVERSE_LOGIN_LIMIT", "8"))
LOGIN_WINDOW = int(os.environ.get("BREAKVERSE_LOGIN_WINDOW", "300"))

os.chdir(ROOT)


def utc_now():
    return datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")


def empty_store():
    return {"version": 1, "users": {}, "sessions": {}}


class StoreUnavailable(RuntimeError):
    pass


def normalize_store(data):
    if not isinstance(data, dict):
        raise StoreUnavailable("账号数据格式错误")
    data.setdefault("version", 1)
    users = data.setdefault("users", {})
    sessions = data.setdefault("sessions", {})
    if not isinstance(users, dict) or not isinstance(sessions, dict):
        raise StoreUnavailable("账号数据结构错误")
    for user in users.values():
        if isinstance(user, dict) and user.get("username"):
            user["username_key"] = username_key(user["username"])
    return data


def load_store():
    with STORE_LOCK:
        if not DATA_FILE.exists():
            return empty_store()
        try:
            with DATA_FILE.open("r", encoding="utf-8") as f:
                data = json.load(f)
        except (OSError, json.JSONDecodeError) as exc:
            raise StoreUnavailable("账号数据暂时不可用，请检查 data/accounts.json") from exc
        return normalize_store(data)


def save_store(data):
    with STORE_LOCK:
        DATA_DIR.mkdir(parents=True, exist_ok=True)
        tmp = DATA_FILE.with_suffix(".tmp")
        with tmp.open("w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2, sort_keys=True)
        os.replace(tmp, DATA_FILE)


def hash_password(password, salt=None):
    salt = salt or secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        PBKDF2_ITERATIONS,
    ).hex()
    return salt, digest


def password_matches(password, user):
    salt = user.get("salt", "")
    expected = user.get("password_hash", "")
    if not salt or not expected:
        return False
    _, digest = hash_password(password, salt)
    return secrets.compare_digest(digest, expected)


def normalize_username(username):
    return str(username or "").strip()


def username_key(username):
    return normalize_username(username).lower()


def public_user(user):
    if not user:
        return None
    save_updated = user.get("save_updated_at")
    return {
        "id": user["id"],
        "username": user["username"],
        "displayName": user.get("display_name") or user["username"],
        "role": user.get("role", "player"),
        "status": user.get("status", "active"),
        "createdAt": user.get("created_at"),
        "lastLoginAt": user.get("last_login_at"),
        "saveUpdatedAt": save_updated,
        "hasCloudSave": bool(user.get("save")),
    }


def admin_user(user):
    data = public_user(user)
    if data:
        save_blob = user.get("save")
        data["saveBytes"] = len(json.dumps(save_blob, ensure_ascii=False)) if save_blob else 0
    return data


def find_user_by_username(store, username):
    key = username_key(username)
    for user in store["users"].values():
        if user.get("username_key") == key:
            return user
    return None


def trim_text(value, max_len=80):
    text = str(value or "").strip()
    text = re.sub(r"[\x00-\x1f\x7f]", "", text)
    return text.replace("<", "‹").replace(">", "›")[:max_len]


def safe_number(value, default=0, minimum=0, maximum=10_000_000):
    try:
        number = float(value)
    except (TypeError, ValueError):
        return default
    if number != number:
        return default
    return max(minimum, min(maximum, int(number)))


def safe_string_list(value, max_items=80, max_len=64):
    if not isinstance(value, list):
        return []
    result = []
    for item in value[:max_items]:
        text = trim_text(item, max_len)
        if text and text not in result:
            result.append(text)
    return result


def safe_number_map(value, allowed_keys=None, max_items=80):
    if not isinstance(value, dict):
        return {}
    result = {}
    for key, item in list(value.items())[:max_items]:
        key = trim_text(key, 64)
        if not key or (allowed_keys and key not in allowed_keys):
            continue
        result[key] = safe_number(item)
    return result


def sanitize_save_blob(blob):
    if not isinstance(blob, dict):
        raise ValueError("存档格式错误")
    safe = {}
    safe["unlocked"] = safe_string_list(blob.get("unlocked"), 120, 64)
    equipped = blob.get("equipped") if isinstance(blob.get("equipped"), dict) else {}
    safe["equipped"] = {
        trim_text(slot, 24): trim_text(item, 64)
        for slot, item in equipped.items()
        if trim_text(slot, 24)
    }
    safe["fragments"] = safe_number_map(blob.get("fragments"), {"unread", "joke", "sticker", "idea", "ticket"})
    safe["stats"] = safe_number_map(
        blob.get("stats"),
        {"battles", "wins", "bosses", "damage", "bestCombo", "perfect", "supers", "eggs", "shares"},
    )
    codex = {}
    if isinstance(blob.get("codex"), dict):
        for boss_id, item in list(blob["codex"].items())[:120]:
            if not isinstance(item, dict):
                continue
            key = trim_text(boss_id, 64)
            if not key:
                continue
            codex[key] = {
                "name": trim_text(item.get("name"), 80),
                "world": trim_text(item.get("world"), 40),
                "wins": safe_number(item.get("wins"), 0, 0, 9999),
                "at": safe_number(item.get("at"), 0, 0, 9_999_999_999_999),
            }
    safe["codex"] = codex
    safe["achievements"] = safe_string_list(blob.get("achievements"), 120, 64)
    safe["chapterWins"] = safe_number_map(blob.get("chapterWins"), max_items=40)
    history = []
    if isinstance(blob.get("history"), list):
        for item in blob["history"][:10]:
            if not isinstance(item, dict):
                continue
            history.append({
                "boss": trim_text(item.get("boss"), 80),
                "won": bool(item.get("won")),
                "drop": trim_text(item.get("drop"), 64),
                "damage": safe_number(item.get("damage")),
                "combo": safe_number(item.get("combo")),
                "time": safe_number(item.get("time"), 0, 0, 60 * 60),
                "chapter": trim_text(item.get("chapter"), 40),
                "difficulty": trim_text(item.get("difficulty"), 40),
                "rewards": [
                    {"text": trim_text(reward.get("text"), 80)}
                    for reward in (item.get("rewards") if isinstance(item.get("rewards"), list) else [])[:8]
                    if isinstance(reward, dict)
                ],
                "achievements": safe_string_list(item.get("achievements"), 20, 64),
                "at": safe_number(item.get("at"), 0, 0, 9_999_999_999_999),
            })
    safe["history"] = history
    safe["updatedAt"] = safe_number(blob.get("updatedAt"), 0, 0, 9_999_999_999_999)
    return safe


def login_key(handler, username):
    ip = handler.client_address[0] if handler.client_address else "unknown"
    return f"{ip}:{username_key(username)}"


def too_many_login_attempts(key):
    now = time.time()
    with LOGIN_LOCK:
        hits = [stamp for stamp in LOGIN_ATTEMPTS.get(key, []) if now - stamp < LOGIN_WINDOW]
        LOGIN_ATTEMPTS[key] = hits
        return len(hits) >= LOGIN_LIMIT


def record_login_failure(key):
    now = time.time()
    with LOGIN_LOCK:
        hits = [stamp for stamp in LOGIN_ATTEMPTS.get(key, []) if now - stamp < LOGIN_WINDOW]
        hits.append(now)
        LOGIN_ATTEMPTS[key] = hits


def clear_login_failures(key):
    with LOGIN_LOCK:
        LOGIN_ATTEMPTS.pop(key, None)


class BreakverseHandler(http.server.SimpleHTTPRequestHandler):
    server_version = "BreakverseHTTP/1.0"
    max_json_bytes = 2 * 1024 * 1024

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "same-origin")
        super().end_headers()

    def do_GET(self):
        if self.is_api():
            self.route_api("GET")
            return
        super().do_GET()

    def do_POST(self):
        self.route_api("POST") if self.is_api() else self.send_error(404)

    def do_PUT(self):
        self.route_api("PUT") if self.is_api() else self.send_error(404)

    def do_PATCH(self):
        self.route_api("PATCH") if self.is_api() else self.send_error(404)

    def is_api(self):
        return urlparse(self.path).path.startswith("/api/")

    def route_api(self, method):
        path = urlparse(self.path).path.rstrip("/")
        routes = {
            ("GET", "/api/auth/me"): self.handle_me,
            ("POST", "/api/auth/register"): self.handle_register,
            ("POST", "/api/auth/login"): self.handle_login,
            ("POST", "/api/auth/logout"): self.handle_logout,
            ("PUT", "/api/account/profile"): self.handle_profile,
            ("PUT", "/api/account/password"): self.handle_password,
            ("GET", "/api/save"): self.handle_get_save,
            ("PUT", "/api/save"): self.handle_put_save,
            ("GET", "/api/admin/accounts"): self.handle_admin_accounts,
        }
        if method not in ("GET", "HEAD", "OPTIONS") and not self.valid_csrf():
            self.json_response(403, {"error": "安全校验已过期，请刷新页面后重试"})
            return
        handler = routes.get((method, path))
        if handler:
            try:
                handler()
            except StoreUnavailable as exc:
                self.json_response(503, {"error": str(exc)})
            return
        if method == "PATCH" and path.startswith("/api/admin/accounts/"):
            try:
                self.handle_admin_account(path.rsplit("/", 1)[-1])
            except StoreUnavailable as exc:
                self.json_response(503, {"error": str(exc)})
            return
        self.json_response(404, {"error": "接口不存在"})

    def read_json(self):
        try:
            length = int(self.headers.get("Content-Length", "0") or 0)
        except ValueError as exc:
            raise ValueError("Content-Length 无效") from exc
        if length < 0:
            raise ValueError("Content-Length 不能为负数")
        if length > self.max_json_bytes:
            raise ValueError("请求体太大")
        content_type = self.headers.get("Content-Type", "").split(";")[0].strip().lower()
        if length and content_type != "application/json":
            raise ValueError("仅支持 JSON 请求")
        raw = self.rfile.read(length) if length else b"{}"
        if not raw:
            return {}
        try:
            return json.loads(raw.decode("utf-8"))
        except json.JSONDecodeError as exc:
            raise ValueError("JSON 格式错误") from exc

    def json_response(self, status, payload, extra_headers=None):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        headers = dict(extra_headers or {})
        csrf_header = self.csrf_cookie_header()
        if csrf_header:
            existing = headers.get("Set-Cookie")
            if existing:
                headers["Set-Cookie"] = [existing, csrf_header]
            else:
                headers["Set-Cookie"] = csrf_header
        for key, value in headers.items():
            values = value if isinstance(value, (list, tuple)) else [value]
            for item in values:
                self.send_header(key, item)
        self.end_headers()
        self.wfile.write(body)

    def cookie_header(self, token):
        parts = [
            f"{COOKIE_NAME}={token}",
            "Path=/",
            "HttpOnly",
            "SameSite=Lax",
            f"Max-Age={SESSION_TTL}",
        ]
        if os.environ.get("BREAKVERSE_COOKIE_SECURE") == "1":
            parts.append("Secure")
        return "; ".join(parts)

    def clear_cookie_header(self):
        parts = [f"{COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0"]
        if os.environ.get("BREAKVERSE_COOKIE_SECURE") == "1":
            parts.append("Secure")
        return "; ".join(parts)

    def csrf_cookie_header(self):
        cookie = self.request_cookies()
        morsel = cookie.get(CSRF_COOKIE_NAME)
        if morsel and TOKEN_RE.match(morsel.value):
            return None
        token = secrets.token_urlsafe(32)
        parts = [
            f"{CSRF_COOKIE_NAME}={token}",
            "Path=/",
            "SameSite=Lax",
            f"Max-Age={SESSION_TTL}",
        ]
        if os.environ.get("BREAKVERSE_COOKIE_SECURE") == "1":
            parts.append("Secure")
        return "; ".join(parts)

    def valid_csrf(self):
        cookie = self.request_cookies().get(CSRF_COOKIE_NAME)
        header = self.headers.get("X-CSRF-Token", "")
        if not cookie or not TOKEN_RE.match(cookie.value) or not TOKEN_RE.match(header):
            return False
        return secrets.compare_digest(cookie.value, header)

    def request_cookies(self):
        raw = self.headers.get("Cookie", "")
        cookie = http.cookies.SimpleCookie()
        cookie.load(raw)
        return cookie

    def current_user(self, store=None):
        store = store or load_store()
        cookie = self.request_cookies()
        morsel = cookie.get(COOKIE_NAME)
        if not morsel:
            return None, store, None
        token = morsel.value
        session = store["sessions"].get(token)
        if not session:
            return None, store, token
        if session.get("expires_at", 0) < time.time():
            store["sessions"].pop(token, None)
            save_store(store)
            return None, store, token
        user = store["users"].get(session.get("user_id"))
        if not user or user.get("status") != "active":
            store["sessions"].pop(token, None)
            save_store(store)
            return None, store, token
        return user, store, token

    def require_user(self):
        user, store, token = self.current_user()
        if not user:
            self.json_response(401, {"error": "请先登录"})
            return None, None, None
        return user, store, token

    def require_admin(self):
        user, store, token = self.require_user()
        if not user:
            return None, None, None
        if user.get("role") != "admin":
            self.json_response(403, {"error": "需要管理员权限"})
            return None, None, None
        return user, store, token

    def create_session(self, store, user):
        token = secrets.token_urlsafe(32)
        store["sessions"][token] = {
            "user_id": user["id"],
            "created_at": utc_now(),
            "expires_at": time.time() + SESSION_TTL,
        }
        return token

    def validate_password(self, password):
        return isinstance(password, str) and len(password) >= 8 and len(password) <= 128

    def handle_register(self):
        try:
            body = self.read_json()
        except ValueError as exc:
            self.json_response(400, {"error": str(exc)})
            return
        username = normalize_username(body.get("username"))
        password = body.get("password", "")
        display_name = str(body.get("displayName") or username).strip()[:32]
        if not USERNAME_RE.match(username):
            self.json_response(400, {"error": "账号名需为 3-24 位字母、数字、下划线或短横线"})
            return
        if not self.validate_password(password):
            self.json_response(400, {"error": "密码至少 8 位，且不能超过 128 位"})
            return

        with STORE_LOCK:
            store = load_store()
            if find_user_by_username(store, username):
                self.json_response(409, {"error": "账号名已存在"})
                return

            first_user = len(store["users"]) == 0
            salt, digest = hash_password(password)
            user_id = uuid.uuid4().hex
            user = {
                "id": user_id,
                "username": username,
                "username_key": username_key(username),
                "display_name": display_name or username,
                "password_hash": digest,
                "salt": salt,
                "role": "admin" if first_user else "player",
                "status": "active",
                "created_at": utc_now(),
                "last_login_at": utc_now(),
                "save": None,
                "save_updated_at": None,
            }
            store["users"][user_id] = user
            token = self.create_session(store, user)
            save_store(store)
        self.json_response(
            201,
            {"user": public_user(user), "cloudSave": None, "firstAdmin": first_user},
            {"Set-Cookie": self.cookie_header(token)},
        )

    def handle_login(self):
        try:
            body = self.read_json()
        except ValueError as exc:
            self.json_response(400, {"error": str(exc)})
            return
        username = body.get("username")
        attempt_key = login_key(self, username)
        if too_many_login_attempts(attempt_key):
            self.json_response(429, {"error": "尝试太频繁，请稍后再试"})
            return
        with STORE_LOCK:
            store = load_store()
            user = find_user_by_username(store, username)
            if not user or not password_matches(body.get("password", ""), user):
                record_login_failure(attempt_key)
                self.json_response(401, {"error": "账号或密码错误"})
                return
            if user.get("status") != "active":
                self.json_response(403, {"error": "账号已被停用"})
                return
            clear_login_failures(attempt_key)
            user["last_login_at"] = utc_now()
            token = self.create_session(store, user)
            save_store(store)
        self.json_response(
            200,
            {"user": public_user(user), "cloudSave": user.get("save")},
            {"Set-Cookie": self.cookie_header(token)},
        )

    def handle_logout(self):
        with STORE_LOCK:
            store = load_store()
            _, store, token = self.current_user(store)
            if token:
                store["sessions"].pop(token, None)
                save_store(store)
        self.json_response(200, {"ok": True}, {"Set-Cookie": self.clear_cookie_header()})

    def handle_me(self):
        user, _, _ = self.current_user()
        self.json_response(200, {"user": public_user(user)})

    def handle_profile(self):
        try:
            body = self.read_json()
        except ValueError as exc:
            self.json_response(400, {"error": str(exc)})
            return
        display_name = str(body.get("displayName") or "").strip()[:32]
        if not display_name:
            self.json_response(400, {"error": "昵称不能为空"})
            return
        with STORE_LOCK:
            user, store, _ = self.require_user()
            if not user:
                return
            user["display_name"] = display_name
            user["updated_at"] = utc_now()
            save_store(store)
            payload = {"user": public_user(user)}
        self.json_response(200, payload)

    def handle_password(self):
        try:
            body = self.read_json()
        except ValueError as exc:
            self.json_response(400, {"error": str(exc)})
            return
        new_password = body.get("newPassword", "")
        if not self.validate_password(new_password):
            self.json_response(400, {"error": "新密码至少 8 位，且不能超过 128 位"})
            return
        with STORE_LOCK:
            user, store, token = self.require_user()
            if not user:
                return
            if not password_matches(body.get("currentPassword", ""), user):
                self.json_response(400, {"error": "当前密码不正确"})
                return
            salt, digest = hash_password(new_password)
            user["salt"] = salt
            user["password_hash"] = digest
            user["updated_at"] = utc_now()
            store["sessions"] = {
                session_id: session
                for session_id, session in store["sessions"].items()
                if not (session.get("user_id") == user["id"] and session_id != token)
            }
            save_store(store)
        self.json_response(200, {"ok": True})

    def handle_get_save(self):
        with STORE_LOCK:
            user, _, _ = self.require_user()
            if not user:
                return
            payload = {"save": user.get("save"), "saveUpdatedAt": user.get("save_updated_at")}
        self.json_response(200, payload)

    def handle_put_save(self):
        try:
            body = self.read_json()
        except ValueError as exc:
            self.json_response(400, {"error": str(exc)})
            return
        save_blob = body.get("save")
        try:
            save_blob = sanitize_save_blob(save_blob)
        except ValueError as exc:
            self.json_response(400, {"error": "存档格式错误"})
            return
        with STORE_LOCK:
            user, store, _ = self.require_user()
            if not user:
                return
            user["save"] = save_blob
            user["save_updated_at"] = utc_now()
            save_store(store)
            payload = {"ok": True, "saveUpdatedAt": user["save_updated_at"]}
        self.json_response(200, payload)

    def handle_admin_accounts(self):
        with STORE_LOCK:
            _, store, _ = self.require_admin()
            if not store:
                return
            users = sorted(store["users"].values(), key=lambda item: item.get("created_at") or "")
            payload = {"accounts": [admin_user(user) for user in users]}
        self.json_response(200, payload)

    def handle_admin_account(self, account_id):
        try:
            body = self.read_json()
        except ValueError as exc:
            self.json_response(400, {"error": str(exc)})
            return
        with STORE_LOCK:
            admin, store, _ = self.require_admin()
            if not admin:
                return
            target = store["users"].get(account_id)
            if not target:
                self.json_response(404, {"error": "账号不存在"})
                return

            role = body.get("role")
            status = body.get("status")
            display_name = body.get("displayName")
            if role is not None:
                if role not in ("admin", "player"):
                    self.json_response(400, {"error": "角色无效"})
                    return
                if target["id"] == admin["id"] and role != "admin":
                    self.json_response(400, {"error": "不能取消自己的管理员权限"})
                    return
                target["role"] = role
            if status is not None:
                if status not in ("active", "disabled"):
                    self.json_response(400, {"error": "状态无效"})
                    return
                if target["id"] == admin["id"] and status != "active":
                    self.json_response(400, {"error": "不能停用当前登录账号"})
                    return
                target["status"] = status
            if display_name is not None:
                name = str(display_name or "").strip()[:32]
                if not name:
                    self.json_response(400, {"error": "昵称不能为空"})
                    return
                target["display_name"] = name
            target["updated_at"] = utc_now()
            save_store(store)
            payload = {"account": admin_user(target)}
        self.json_response(200, payload)


if __name__ == "__main__":
    httpd = http.server.ThreadingHTTPServer((HOST, PORT), BreakverseHandler)
    print(f"Breakverse @ http://{HOST}:{PORT}")
    print(f"Account data @ {DATA_FILE}")
    httpd.serve_forever()
