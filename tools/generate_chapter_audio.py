#!/usr/bin/env python3
"""Generate one loudness-controlled Kokoro MP3 for every chapter paragraph."""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path


def spoken_text(text: str) -> str:
    replacements = {
        "BC": "B C",
        "AD": "A D",
        "ca.": "circa",
        "Jomon": "Joe-moan",
        "Yayoi": "Yah-yoh-ee",
        "Kojiki": "Ko-jee-kee",
        "Nihon Shoki": "Nee-hone Show-key",
        "Kyushu": "Cue-shoo",
        "Honshu": "Hone-shoo",
        "Shikoku": "Shee-koh-koo",
        "Hokkaido": "Hoke-eye-doh",
        "Himiko": "Hee-mee-koh",
        "Yamatai": "Yah-mah-tie",
        "Yamato": "Yah-mah-toh",
        "dotaku": "doh-tah-koo",
        "dogu": "doh-goo",
    }
    value = text.replace("\n", " ")
    for source, destination in replacements.items():
        value = value.replace(source, destination)
    return re.sub(r"\s+", " ", value).strip()


def synthesize(pipeline, text: str, voice: str, speed: float):
    import numpy as np

    parts = []
    for _, _, audio in pipeline(text, voice=voice, speed=speed, split_pattern=r"(?<=[.!?])\s+"):
        samples = np.asarray(audio, dtype=np.float32).flatten()
        if samples.size:
            parts.append(samples)
    if not parts:
        raise RuntimeError("Kokoro returned no samples")
    gap = np.zeros(int(0.16 * 24000), dtype=np.float32)
    joined = []
    for index, part in enumerate(parts):
        joined.append(part)
        if index + 1 < len(parts):
            joined.append(gap)
    return np.concatenate(joined)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--book", required=True)
    parser.add_argument("--output-dir", required=True)
    parser.add_argument("--packages-dir")
    parser.add_argument("--voice", default="bm_lewis")
    parser.add_argument("--speed", type=float, default=0.88)
    args = parser.parse_args()

    if args.packages_dir:
        sys.path.insert(0, str(Path(args.packages_dir).resolve()))
    os.environ.setdefault("HF_HOME", str(Path(args.output_dir).resolve().parents[2] / ".model-cache"))

    import numpy as np
    import soundfile as sf
    from kokoro import KPipeline

    book = json.loads(Path(args.book).read_text(encoding="utf-8"))
    paragraphs = [p for section in book["sections"] for p in section["paragraphs"]]
    output_dir = Path(args.output_dir).resolve()
    output_dir.mkdir(parents=True, exist_ok=True)
    pipeline = KPipeline(lang_code="a")

    with tempfile.TemporaryDirectory(prefix="history-audio-") as temp_name:
        temp_dir = Path(temp_name)
        for number, paragraph in enumerate(paragraphs, 1):
            destination = output_dir / f"{paragraph['id']}.mp3"
            if destination.is_file():
                print(f"[{number}/{len(paragraphs)}] existing {destination.name}", flush=True)
                continue
            samples = synthesize(pipeline, spoken_text(paragraph["text"]), args.voice, args.speed)
            wav = temp_dir / f"{paragraph['id']}.wav"
            sf.write(wav, samples, 24000)
            subprocess.run([
                "ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(wav),
                "-af", "loudnorm=I=-19:TP=-1.5:LRA=7", "-ar", "24000", "-ac", "1",
                "-c:a", "libmp3lame", "-b:a", "64k", str(destination),
            ], check=True)
            print(f"[{number}/{len(paragraphs)}] wrote {destination.name}", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
