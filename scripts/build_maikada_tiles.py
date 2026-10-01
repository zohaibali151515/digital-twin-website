"""Build Maikada's progressive SPZ assets from the immutable PLY master.

Run from the repository root after ``npm ci`` and ``pip install numpy``.
Outputs stay in ignored local working storage until visual checks pass.
"""

import subprocess

from build_maikada_streamed import CLI, META, ROOT, SOURCE, WORK, verify_source

PREVIEW = WORK / "maikada-preview.ply"
REMAINDER = WORK / "maikada-remainder.ply"
COUNT = META["source"]["gaussians"]
SOURCE_RECORD_BYTES = 236  # 59 little-endian float32 values per Gaussian.
CHUNK_SIZE = 100_000


def split_first_room():
    try:
        import numpy as np
    except ImportError as error:
        raise RuntimeError("Install numpy before building Maikada assets: pip install numpy") from error

    with SOURCE.open("rb") as source_file:
        header = bytearray()
        while True:
            line = source_file.readline()
            if not line:
                raise ValueError("PLY header is incomplete")
            header.extend(line)
            if line.strip() == b"end_header":
                break
        offset = source_file.tell()
    if SOURCE.stat().st_size - offset != COUNT * SOURCE_RECORD_BYTES:
        raise ValueError("Unexpected Maikada PLY record layout")
    old_count = f"element vertex {COUNT}".encode("ascii")
    if header.count(old_count) != 1:
        raise ValueError("Unexpected Maikada PLY vertex header")

    data = np.memmap(SOURCE, dtype="<f4", mode="r", offset=offset, shape=(COUNT, 59))
    totals = [0, 0]
    paths = (PREVIEW, REMAINDER)
    handles = [path.open("wb") for path in paths]
    try:
        for handle in handles:
            handle.write(header)
        for start in range(0, COUNT, CHUNK_SIZE):
            rows = data[start:start + CHUNK_SIZE]
            x, y, z = rows[:, 0], rows[:, 1], rows[:, 2]
            first_room = (x >= -10) & (x <= 20) & (y >= -25) & (y <= 20) & (z >= -10) & (z <= -0.5)
            # splat-transform's 90-degree X rotation maps source (x,y,z)
            # to browser (x,z,-y). The first camera is (0,-3.5,2), facing +X.
            forward = np.maximum(x, 0.5)
            initial_view = (
                (x > -0.5)
                & (np.abs(-y - 2) < forward * np.tan(np.deg2rad(70)))
                & (np.abs(z + 3.5) < forward * np.tan(np.deg2rad(55)))
            )
            for index, mask in enumerate((first_room & initial_view, first_room & ~initial_view)):
                selected = rows[mask]
                handles[index].write(selected.tobytes())
                totals[index] += len(selected)
    finally:
        for handle in handles:
            handle.close()

    for path, total in zip(paths, totals):
        new_count = f"element vertex {total}".encode("ascii")
        if len(new_count) > len(old_count):
            raise ValueError("New PLY count does not fit header")
        with path.open("r+b") as output:
            output.write(header.replace(old_count, new_count.ljust(len(old_count), b" "), 1))
        print(f"Split first room: {path.name}: {total:,} source Gaussians", flush=True)


def convert(*args):
    subprocess.run([str(CLI), *map(str, args)], cwd=ROOT, check=True)


def main():
    verify_source()
    if not CLI.exists():
        raise FileNotFoundError("Run npm ci before generating web assets")
    WORK.mkdir(parents=True, exist_ok=True)
    split_first_room()
    for source, output in ((PREVIEW, WORK / "maikada-preview.spz"),
                           (REMAINDER, WORK / "maikada-remainder.spz")):
        convert("-w", source, "-r", "90,0,0", output, "--spz-version", "3")
        convert(output, "--info", "null")
        print(f"Review this asset before publishing: {output}", flush=True)
    upper = WORK / "maikada-upper.spz"
    convert("-w", SOURCE, "--filter-box=-10,-25,-0.5,20,20,15",
            "-r", "90,0,0", upper, "--spz-version", "3")
    print(f"Review this asset before publishing: {upper}", flush=True)


if __name__ == "__main__":
    main()
