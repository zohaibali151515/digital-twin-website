"""Build Maikada's two progressive SPZ bands from the verified PLY master.

Run from the repository root after ``npm ci``. Outputs stay in ignored local
working storage until visual checks pass and they are copied to ``public/``.
"""

import subprocess

from build_maikada_streamed import CLI, ROOT, SOURCE, WORK, verify_source

BANDS = (
    ("maikada-lower.spz", "-10,-25,-10,20,20,-0.5"),
    ("maikada-upper.spz", "-10,-25,-0.5,20,20,15"),
)


def main():
    verify_source()
    if not CLI.exists():
        raise FileNotFoundError("Run npm ci before generating web assets")
    WORK.mkdir(parents=True, exist_ok=True)
    for filename, bounds in BANDS:
        output = WORK / filename
        subprocess.run(
            [str(CLI), "-w", str(SOURCE), f"--filter-box={bounds}",
             "-r", "90,0,0", str(output), "--spz-version", "3"],
            cwd=ROOT,
            check=True,
        )
        subprocess.run([str(CLI), str(output), "--info", "null"], cwd=ROOT, check=True)
        print(f"Review this band before publishing: {output}")


if __name__ == "__main__":
    main()
