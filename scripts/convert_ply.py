"""Convert a Gaussian PLY to a smaller 32-byte .splat browser preview."""
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
SOURCE = next((ROOT / "Maikada Cafe").glob("*.ply"))
DEST = ROOT / "public" / "maikada-preview.splat"
TARGET = 900_000

types = {"float": "<f4", "double": "<f8", "uchar": "u1", "char": "i1", "int": "<i4", "uint": "<u4"}
with SOURCE.open("rb") as file:
    lines = []
    while True:
        line = file.readline().decode("ascii").strip()
        lines.append(line)
        if line == "end_header":
            break
    count = int(next(x.split()[2] for x in lines if x.startswith("element vertex ")))
    fields = [x.split() for x in lines if x.startswith("property ")]
    dtype = np.dtype([(name, types[kind]) for _, kind, name in fields])
    data = np.fromfile(file, dtype=dtype, count=count)

rng = np.random.default_rng(2026)
if count > TARGET:
    # Random sampling avoids the ordering bias in exported PLYs.
    indices = np.sort(rng.choice(count, TARGET, replace=False))
    data = data[indices]

out = np.empty(len(data), dtype=np.dtype([
    ("position", "<f4", (3,)), ("scale", "<f4", (3,)),
    ("color", "u1", (4,)), ("rotation", "u1", (4,))
]))
out["position"] = np.column_stack([data[n] for n in ("x", "y", "z")])
out["scale"] = np.exp(np.clip(np.column_stack([data[f"scale_{i}"] for i in range(3)]), -12, 8))
dc = np.column_stack([data[f"f_dc_{i}"] for i in range(3)])
out["color"][:, :3] = np.clip((0.5 + 0.2820947918 * dc) * 255, 0, 255).astype("u1")
opacity = np.clip(data["opacity"], -20, 20)
out["color"][:, 3] = np.clip(255 / (1 + np.exp(-opacity)), 0, 255).astype("u1")
quat = np.column_stack([data[f"rot_{i}"] for i in range(4)])
quat /= np.maximum(np.linalg.norm(quat, axis=1, keepdims=True), 1e-8)
out["rotation"] = np.clip(128 + 128 * quat, 0, 255).astype("u1")
DEST.parent.mkdir(exist_ok=True)
out.tofile(DEST)
print(f"{SOURCE.name}: {count:,} splats to {len(out):,} splats, {DEST.stat().st_size / 1e6:.1f} MB")
