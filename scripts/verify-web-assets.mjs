import { createReadStream, readFileSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const metadataDir = resolve(root, 'assets/maikada');
const metadata = JSON.parse(readFileSync(resolve(metadataDir, 'metadata.json'), 'utf8'));
const publicDir = resolve(root, 'public') + sep;

for (const tile of metadata.web.tiles) {
  const file = resolve(metadataDir, tile.path);
  if (!file.startsWith(publicDir)) throw new Error(`Web asset outside public/: ${tile.path}`);
  const bytes = statSync(file).size;
  if (bytes !== tile.bytes) throw new Error(`${tile.path}: expected ${tile.bytes} bytes, found ${bytes}`);
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(file)) hash.update(chunk);
  const actual = hash.digest('hex');
  if (actual !== tile.sha256) throw new Error(`${tile.path}: SHA-256 mismatch`);
  console.log(`Verified ${tile.path}: ${tile.gaussians.toLocaleString()} Gaussians`);
}
