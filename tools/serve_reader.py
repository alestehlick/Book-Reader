#!/usr/bin/env python3
"""Serve the static reader locally with PMTiles byte-range support."""

from __future__ import annotations

import argparse
import os
import re
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


RANGE_PATTERN = re.compile(r"^bytes=(\d*)-(\d*)$")


class RangeRequestHandler(SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def __init__(self, *args, directory: str | None = None, **kwargs):
        self._byte_range: tuple[int, int] | None = None
        super().__init__(*args, directory=directory, **kwargs)

    def end_headers(self) -> None:
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def send_head(self):
        self._byte_range = None
        header = self.headers.get("Range")
        if not header:
            return super().send_head()

        match = RANGE_PATTERN.fullmatch(header.strip())
        path = Path(self.translate_path(self.path))
        if not match:
            self.send_error(416, "Requested range is not satisfiable")
            return None
        if not path.is_file():
            return super().send_head()

        size = path.stat().st_size
        first, last = match.groups()
        if first:
            start = int(first)
            end = int(last) if last else size - 1
        elif last:
            length = min(int(last), size)
            start = size - length
            end = size - 1
        else:
            self.send_error(416, "Requested range is not satisfiable")
            return None

        if start < 0 or start >= size or end < start:
            self.send_response(416)
            self.send_header("Content-Range", f"bytes */{size}")
            self.send_header("Content-Length", "0")
            self.end_headers()
            return None

        end = min(end, size - 1)
        source = path.open("rb")
        self._byte_range = (start, end)
        self.send_response(206)
        self.send_header("Content-Type", self.guess_type(str(path)))
        self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
        self.send_header("Content-Length", str(end - start + 1))
        self.send_header("Last-Modified", self.date_time_string(path.stat().st_mtime))
        self.end_headers()
        return source

    def copyfile(self, source, outputfile) -> None:
        if self._byte_range is None:
            super().copyfile(source, outputfile)
            return
        start, end = self._byte_range
        source.seek(start)
        remaining = end - start + 1
        while remaining:
            chunk = source.read(min(128 * 1024, remaining))
            if not chunk:
                break
            outputfile.write(chunk)
            remaining -= len(chunk)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Preview the History Reader with HTTP byte ranges for PMTiles."
    )
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1] / "docs")
    parser.add_argument("--bind", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8765)
    args = parser.parse_args()

    root = args.root.resolve()
    if not root.is_dir():
        raise SystemExit(f"Reader directory not found: {root}")

    def handler(*handler_args, **handler_kwargs):
        return RangeRequestHandler(*handler_args, directory=os.fspath(root), **handler_kwargs)

    server = ThreadingHTTPServer((args.bind, args.port), handler)
    print(f"History Reader: http://{args.bind}:{args.port}/")
    print(f"Serving: {root}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
