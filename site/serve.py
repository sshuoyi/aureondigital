#!/usr/bin/env python3
"""Static server with HTTP Range support (needed to seek the intro video)."""
import http.server
import mimetypes
import os
import re
import socketserver
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))


class RangeHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def send_head(self):
        path = self.translate_path(self.path)
        range_header = self.headers.get("Range")
        if range_header and os.path.isfile(path):
            return self._send_range(path, range_header)
        return super().send_head()

    def _send_range(self, path, range_header):
        size = os.path.getsize(path)
        match = re.match(r"bytes=(\d*)-(\d*)", range_header or "")
        if not match:
            return super().send_head()
        start = int(match.group(1)) if match.group(1) else 0
        end = int(match.group(2)) if match.group(2) else size - 1
        if start >= size or start > end:
            self.send_response(416)
            self.send_header("Content-Range", "bytes */%d" % size)
            self.end_headers()
            return None
        end = min(end, size - 1)
        length = end - start + 1
        ctype = mimetypes.guess_type(path)[0] or "application/octet-stream"
        self.send_response(206)
        self.send_header("Content-Type", ctype)
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Content-Range", "bytes %d-%d/%d" % (start, end, size))
        self.send_header("Content-Length", str(length))
        self.send_header("Last-Modified", self.date_time_string(os.path.getmtime(path)))
        self.end_headers()
        with open(path, "rb") as f:
            f.seek(start)
            remaining = length
            while remaining > 0:
                chunk = f.read(min(64 * 1024, remaining))
                if not chunk:
                    break
                self.wfile.write(chunk)
                remaining -= len(chunk)
        return None


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 4173
    with Server(("127.0.0.1", port), RangeHandler) as httpd:
        print("Serving %s at http://127.0.0.1:%d" % (ROOT, port), flush=True)
        httpd.serve_forever()
