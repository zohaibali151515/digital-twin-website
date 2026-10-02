"""Build the production SPZ from the checksum-verified Maikada PLY master.

Run from the repository root after ``npm ci``. The output goes to ignored local
working storage first; review it in a browser before copying it to ``public/``.
"""

import hashlib
import json
import subprocess

from build_maikada_streamed import CLI, ROOT, WORK, SOURCE, verify_source

OUTPUT = WORK / "maikada-full-upright-rebuilt.spz"


def main():
    verify_source()
    if not CLI.exists():
        raise FileNotFoundError("Run npm ci before generating web assets")
    WORK.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        [str(CLI), "-w", str(SOURCE), "-r", "90,0,0", str(OUTPUT), "--spz-version", "3"],
        cwd=ROOT,
        check=True,
    )
    subprocess.run([str(CLI), str(OUTPUT), "--info", "null"], cwd=ROOT, check=True)
    metadata = json.loads((ROOT / "assets" / "maikada" / "metadata.json").read_text(encoding="utf-8"))
    reference = metadata["web"]["fullReference"]
    checksum = hashlib.sha256()
    with OUTPUT.open("rb") as rebuilt:
        for chunk in iter(lambda: rebuilt.read(4 * 1024 * 1024), b""):
            checksum.update(chunk)
    digest = checksum.hexdigest()
    if OUTPUT.stat().st_size != reference["bytes"] or digest != reference["sha256"]:
        raise RuntimeError(
            "Rebuilt SPZ differs from the reviewed full-scene reference. "
            f"bytes={OUTPUT.stat().st_size}, sha256={digest}; "
            "inspect the scene before changing published assets or reference metadata."
        )
    print(f"Full-scene reference reproduced exactly: {digest}")
    print(f"Review this asset before publishing: {OUTPUT}")


if __name__ == "__main__":
    main()
