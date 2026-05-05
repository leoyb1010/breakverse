import http.server
import os

PORT = 4173
os.chdir('/Users/leoyuan/Documents/Codex/2026-05-05')

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        super().end_headers()

httpd = http.server.HTTPServer(("", PORT), NoCacheHandler)
print(f"Breakverse @ http://localhost:{PORT}")
httpd.serve_forever()
