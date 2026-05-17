import http.cookies
import json
import tempfile
import threading
import unittest
import urllib.error
import urllib.request
from pathlib import Path

import server


class QuietBreakverseHandler(server.BreakverseHandler):
    def log_message(self, format, *args):
        pass


class BreakverseServerSecurityTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        server.DATA_DIR = Path(self.tmp.name)
        server.DATA_FILE = server.DATA_DIR / "accounts.json"
        server.LOGIN_ATTEMPTS.clear()
        self.httpd = server.http.server.ThreadingHTTPServer(("127.0.0.1", 0), QuietBreakverseHandler)
        self.thread = threading.Thread(target=self.httpd.serve_forever, daemon=True)
        self.thread.start()
        self.base_url = f"http://127.0.0.1:{self.httpd.server_address[1]}"

    def tearDown(self):
        self.httpd.shutdown()
        self.httpd.server_close()
        self.tmp.cleanup()

    def request(self, method, path, body=None, cookies=None, headers=None):
        headers = dict(headers or {})
        if cookies:
            headers["Cookie"] = "; ".join(f"{key}={value}" for key, value in cookies.items())
        data = None
        if body is not None:
            data = json.dumps(body).encode("utf-8")
            headers.setdefault("Content-Type", "application/json")
        req = urllib.request.Request(self.base_url + path, data=data, headers=headers, method=method)
        try:
            with urllib.request.urlopen(req, timeout=5) as res:
                payload = json.loads(res.read().decode("utf-8") or "{}")
                return res.status, payload, self.cookies_from(res.headers)
        except urllib.error.HTTPError as err:
            payload = json.loads(err.read().decode("utf-8") or "{}")
            return err.code, payload, self.cookies_from(err.headers)

    @staticmethod
    def cookies_from(headers):
        jar = http.cookies.SimpleCookie()
        for header in headers.get_all("Set-Cookie") or []:
            jar.load(header)
        return {key: morsel.value for key, morsel in jar.items()}

    def csrf_cookie(self):
        status, _, cookies = self.request("GET", "/api/auth/me")
        self.assertIn(status, (200, 503))
        self.assertIn("bv_csrf", cookies)
        return cookies["bv_csrf"]

    def register(self, username="tester", password="password123"):
        csrf = self.csrf_cookie()
        status, payload, cookies = self.request(
            "POST",
            "/api/auth/register",
            {"username": username, "password": password},
            cookies={"bv_csrf": csrf},
            headers={"X-CSRF-Token": csrf},
        )
        self.assertEqual(status, 201, payload)
        cookies["bv_csrf"] = csrf
        return payload, cookies

    def test_mutating_api_requires_csrf(self):
        status, payload, cookies = self.request(
            "POST",
            "/api/auth/register",
            {"username": "tester", "password": "password123"},
        )
        self.assertEqual(status, 403)
        self.assertIn("安全校验", payload["error"])
        self.assertIn("bv_csrf", cookies)

    def test_corrupt_store_fails_closed(self):
        server.DATA_DIR.mkdir(parents=True, exist_ok=True)
        server.DATA_FILE.write_text("{ broken json", encoding="utf-8")
        csrf = self.csrf_cookie()
        status, payload, _ = self.request(
            "POST",
            "/api/auth/register",
            {"username": "newadmin", "password": "password123"},
            cookies={"bv_csrf": csrf},
            headers={"X-CSRF-Token": csrf},
        )
        self.assertEqual(status, 503)
        self.assertIn("账号数据暂时不可用", payload["error"])

    def test_cloud_save_is_sanitized_before_storage(self):
        _, cookies = self.register()
        csrf = cookies["bv_csrf"]
        hostile_save = {
            "unlocked": ["keyboard"],
            "codex": {
                "ppt-v8": {
                    "name": "<img src=x onerror=alert(1)>",
                    "world": "office",
                    "wins": 2,
                    "at": 123,
                }
            },
            "history": [{"boss": "<script>alert(1)</script>", "rewards": [{"text": "<b>boom</b>"}]}],
        }
        status, payload, _ = self.request(
            "PUT",
            "/api/save",
            {"save": hostile_save},
            cookies=cookies,
            headers={"X-CSRF-Token": csrf},
        )
        self.assertEqual(status, 200, payload)
        status, payload, _ = self.request("GET", "/api/save", cookies=cookies)
        self.assertEqual(status, 200, payload)
        saved = payload["save"]
        self.assertNotIn("<", saved["codex"]["ppt-v8"]["name"])
        self.assertNotIn(">", saved["history"][0]["boss"])
        self.assertLessEqual(len(saved["history"]), 10)

    def test_password_change_revokes_older_sessions(self):
        _, first_cookies = self.register(password="oldpassword")
        csrf = first_cookies["bv_csrf"]
        first_session = first_cookies["bv_session"]
        status, _, second_cookies = self.request(
            "POST",
            "/api/auth/login",
            {"username": "tester", "password": "oldpassword"},
            cookies={"bv_csrf": csrf},
            headers={"X-CSRF-Token": csrf},
        )
        self.assertEqual(status, 200)
        second_cookies["bv_csrf"] = csrf
        status, payload, _ = self.request(
            "PUT",
            "/api/account/password",
            {"currentPassword": "oldpassword", "newPassword": "newpassword123"},
            cookies=second_cookies,
            headers={"X-CSRF-Token": csrf},
        )
        self.assertEqual(status, 200, payload)
        status, payload, _ = self.request(
            "GET",
            "/api/auth/me",
            cookies={"bv_session": first_session, "bv_csrf": csrf},
        )
        self.assertEqual(status, 200)
        self.assertIsNone(payload["user"])


if __name__ == "__main__":
    unittest.main()
