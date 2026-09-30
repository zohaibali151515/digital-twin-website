"""Rebuild Maikada Streamed SOG from the immutable local PLY master.

Run from the repository root: python scripts/build_maikada_streamed.py
Requires: npm install. Generated working files are ignored by Git.
"""

import hashlib
import json
import os
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
META = json.loads((ROOT / "assets/maikada/metadata.json").read_text(encoding="utf-8"))
SOURCE = (ROOT / "assets/maikada" / META["source"]["path"]).resolve()
WORK = ROOT / "assets/maikada/web"
STREAMED = WORK / "streamed-sh0"
PUBLIC = ROOT / "public/assets/maikada/web"
CLI = ROOT / "node_modules/.bin" / ("splat-transform.cmd" if os.name == "nt" else "splat-transform")


def run(*args):
    command = [str(CLI), *map(str, args)]
    print("Running:", " ".join(command), flush=True)
    subprocess.run(command, cwd=ROOT, check=True)


def verify_source():
    if not SOURCE.exists():
        raise FileNotFoundError(f"Master PLY missing: {SOURCE}")
    if SOURCE.stat().st_size != META["source"]["bytes"]:
        raise ValueError("Master PLY size changed")
    digest = hashlib.sha256()
    with SOURCE.open("rb") as file:
        for chunk in iter(lambda: file.read(8 * 1024 * 1024), b""):
            digest.update(chunk)
    if digest.hexdigest() != META["source"]["sha256"]:
        raise ValueError("Master PLY checksum changed")
    print("Master PLY verified:", SOURCE.name, flush=True)


def main():
    verify_source()
    if not CLI.exists():
        raise FileNotFoundError("Run npm install before generating assets")
    WORK.mkdir(parents=True, exist_ok=True)
    for level, percent in ((1, "50%"), (2, "20%")):
        output = WORK / f"maikada-lod{level}.ply"
        if not output.exists():
            run(SOURCE, "--decimate-adaptive", percent, output)
    index = STREAMED / "lod-meta.json"
    if not index.exists():
        STREAMED.mkdir(parents=True, exist_ok=True)
        run("-g", "cpu", "--lod-chunk-count", "256", "--lod-chunk-extent", "8",
            SOURCE, "-l", "0", "-r", "-90,0,0",
            WORK / "maikada-lod1.ply", "-l", "1", "-r", "-90,0,0",
            WORK / "maikada-lod2.ply", "-l", "2", "-r", "-90,0,0",
            index, "--filter-nan", "--filter-harmonics", "0")
    run(index, "--info", "null")
    print(f"Validated web output: {index}")
    print("To stage it for the website, copy the entire streamed directory to", PUBLIC)


if __name__ == "__main__":
    main()
