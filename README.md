# Digital Twin website

Vite website for Digital Twin, a Lahore reality-capture and interactive 3D service. The [production site](https://zohaibali151515.github.io/digital-twin-website/) is deployed from `main` through `.github/workflows/deploy.yml`. Viewer replacements stay on a feature branch until their visual and mobile checks pass.

## Run and build

```bash
npm ci
npm run dev
npm run build
npm run preview
```

Vite builds the home page, Maikada case study and community-demo detail page. The home page currently opens the existing `.splat` preview. The streamed viewer remains a local test page outside the public build. The gallery's third-party scenes are embedded from SuperSplat with explicit creator and license credit; see [community demo rights](docs/community-demos.md).

## Source asset and pipeline

The immutable master is `Maikada Cafe/AmarTest09-Cafe_2026-09-26-15-21-40.fjdslamp2_2.ply`. It is excluded from Git. `assets/maikada/metadata.json` records its size and SHA-256. The build script verifies both before reading it:

```bash
python scripts/build_maikada_streamed.py
```

Generated working files go in `assets/maikada/web/`, which is ignored by Git. The current experiment builds a spatially chunked, three-band Streamed SOG from every source Gaussian. It uses GPU adapter 0 on the development machine; on another machine, inspect `splat-transform --list-gpus` and adjust `-g` in the script. Conversion can take tens of minutes. The master is never overwritten. The full-count output still fails the same-camera visual comparison, so it is excluded from the public build. See the observed results in `docs/architecture.md` before attempting another conversion.

The old 28.8 MB preview can be rebuilt with `python scripts/convert_ply.py`, but it randomly samples 900,000 Gaussians and drops view-dependent color. It is a fallback, not the quality reference. See [architecture and test evidence](docs/architecture.md) before choosing a delivery format.

Keep a second backup of the master outside this computer. Generated browser assets may be stored on GitHub Pages for the pilot; use object storage with versioning and CORS for a larger catalog.

## Add a project

1. Record the client's permission to publish and the public name/location to use. For a third-party demo, record the exact model license, commercial and redistribution terms, modification rights, hosting rights and attribution.
2. Keep the original scan outside Git and public hosting. Add a metadata record with source checksum and capture details.
3. Create a web asset and compare at matching camera views against the source. Test the target phone classes before adding it to the public portfolio.
4. Add a card in `src/main.js`, a project detail HTML page in the Vite build inputs, and a sitemap entry. Use real project facts and verified outcomes only.
5. Build locally, check the desktop and mobile layouts, viewer controls, console, requests and loading time, then merge to `main` for deployment.

## Deployment

The workflow builds on `main` and publishes `dist/` to GitHub Pages. The site uses Vite's relative base path so it works under `/digital-twin-website/`. Do not commit the master PLY, MP4 or temporary benchmark assets. Keep experimental viewer pages out of the sitemap until ready for customers.
