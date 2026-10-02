from pathlib import Path
import subprocess
import numpy as np
from build_maikada_streamed import verify_source

root = Path(__file__).resolve().parents[1]
verify_source()
source = root / 'assets/maikada/web/maikada-preview.ply'
count = 1160652
with source.open('rb') as file:
    header = bytearray()
    while True:
        line = file.readline()
        if not line:
            raise ValueError('Incomplete PLY header')
        header.extend(line)
        if line.strip() == b'end_header':
            break
    offset = file.tell()
if source.stat().st_size - offset != count * 236:
    raise ValueError('Unexpected PLY record size')
rows = np.memmap(source, dtype='<f4', mode='r', offset=offset, shape=(count, 59))
alpha = 1 / (1 + np.exp(-rows[:, 51]))
scale = np.exp(np.max(rows[:, 52:55], axis=1))
distance = np.maximum(np.linalg.norm(rows[:, :3] - np.array([0, -2, -3.5]), axis=1), 0.2)
screen_radius = scale / distance
score = alpha * np.minimum(screen_radius, 0.035)
# Keep the strongest visible contributors in the first layer; every other
# Gaussian stays in the complement, so the combined model is lossless.
target = 350000
chosen = np.argpartition(score, -target)[-target:]
mask = np.zeros(count, dtype=bool)
mask[chosen] = True
for name, selected in [('core', mask), ('tail', ~mask)]:
    output = source.with_name(f'maikada-preview-{name}.ply')
    new_count = int(selected.sum())
    old_token = f'element vertex {count}'.encode()
    new_token = f'element vertex {new_count}'.encode().ljust(len(old_token), b' ')
    with output.open('wb') as file:
        file.write(header.replace(old_token, new_token, 1))
        for start in range(0, count, 100000):
            part = rows[start:start + 100000]
            file.write(part[selected[start:start + 100000]].tobytes())
    print(output, new_count, output.stat().st_size, flush=True)
    cli = root / 'node_modules/.bin/splat-transform.cmd'
    subprocess.run([str(cli), '-w', str(output), '-r', '90,0,0',
                    str(output.with_suffix('.spz')), '--spz-version', '3'],
                   cwd=root, check=True)
