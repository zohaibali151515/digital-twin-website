import { createReadStream, readFileSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const metadataDir = resolve(root, 'assets/maikada');
const metadata = JSON.parse(readFileSync(resolve(metadataDir, 'metadata.json'), 'utf8'));
const publicDir = resolve(root, 'public') + sep;

for (const asset of [...metadata.web.tiles, ...metadata.web.panorama, ...(metadata.web.loungePanorama || []), ...(metadata.web.heroImage ? [metadata.web.heroImage] : [])]) {
  const file = resolve(metadataDir, asset.path);
  if (!file.startsWith(publicDir)) throw new Error(`Web asset outside public/: ${asset.path}`);
  const bytes = statSync(file).size;
  if (bytes !== asset.bytes) throw new Error(`${asset.path}: expected ${asset.bytes} bytes, found ${bytes}`);
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(file)) hash.update(chunk);
  const actual = hash.digest('hex');
  if (actual !== asset.sha256) throw new Error(`${asset.path}: SHA-256 mismatch`);
  console.log(`Verified ${asset.path}${asset.gaussians ? `: ${asset.gaussians.toLocaleString()} Gaussians` : ''}`);
}
