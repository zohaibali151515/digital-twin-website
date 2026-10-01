"""Build the production SPZ from the checksum-verified Maikada PLY master.

Run from the repository root after ``npm ci``. The output goes to ignored local
working storage first; review it in a browser before copying it to ``public/``.
"""

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
    print(f"Review this asset before publishing: {OUTPUT}")


if __name__ == "__main__":
    main()
