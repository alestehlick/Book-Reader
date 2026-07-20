#!/usr/bin/env python3
"""Build the small raster sprite used by the Chapter 1 narrative atlas."""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import tempfile
from pathlib import Path


PALETTES = {
    "paleolithic": "#566675",
    "jomon": "#9A6044",
    "yayoi": "#B8893F",
    "record": "#53648A",
    "traditional": "#76566E",
    "neutral": "#70685D",
}

CATEGORIES = ("settlement", "burial", "production", "political", "gateway")
CELL = 32


def shape(category: str, color: str) -> str:
    common = f'fill="{color}" stroke="#F4EDDD" stroke-width="3"'
    if category == "settlement":
        return f'<circle cx="16" cy="16" r="8" {common}/>'
    if category == "burial":
        return f'<path d="M16 6 L26 16 L16 26 L6 16 Z" {common}/>'
    if category == "production":
        return f'<path d="M9 7 L23 7 L29 16 L23 25 L9 25 L3 16 Z" {common}/>'
    if category == "political":
        return f'<rect x="7" y="7" width="18" height="18" rx="2" {common}/>'
    return (
        f'<circle cx="16" cy="16" r="10" fill="#F4EDDD" stroke="{color}" stroke-width="4"/>'
        f'<circle cx="16" cy="16" r="3.5" fill="{color}"/>'
    )


def sprite_svg(scale: int) -> tuple[str, dict[str, dict[str, int | bool]]]:
    width = len(PALETTES) * CELL * scale
    height = len(CATEGORIES) * CELL * scale
    groups: list[str] = []
    index: dict[str, dict[str, int | bool]] = {}
    for column, (family, color) in enumerate(PALETTES.items()):
        for row, category in enumerate(CATEGORIES):
            x = column * CELL * scale
            y = row * CELL * scale
            name = f"{family}-{category}"
            groups.append(
                f'<g transform="translate({x} {y}) scale({scale})">{shape(category, color)}</g>'
            )
            index[name] = {
                "width": CELL * scale,
                "height": CELL * scale,
                "x": x,
                "y": y,
                "pixelRatio": scale,
                "visible": True,
            }
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" '
        f'viewBox="0 0 {width} {height}">' + "".join(groups) + "</svg>"
    )
    return svg, index


def build(output: Path) -> None:
    magick = shutil.which("magick")
    if not magick:
        raise SystemExit("ImageMagick is required to build the atlas sprite.")
    output.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="ch01-sprite-") as raw_temp:
        temporary = Path(raw_temp)
        for scale, suffix in ((1, ""), (2, "@2x")):
            svg, index = sprite_svg(scale)
            svg_path = temporary / f"ch01-symbols{suffix}.svg"
            png_path = output / f"ch01-symbols{suffix}.png"
            json_path = output / f"ch01-symbols{suffix}.json"
            svg_path.write_text(svg, encoding="utf-8")
            subprocess.run([magick, str(svg_path), str(png_path)], check=True)
            json_path.write_text(json.dumps(index, indent=2) + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    build(args.output.resolve())
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
