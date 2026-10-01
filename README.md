# Digital Twin website

Digital Twin is a Lahore reality capture and interactive 3D service. The [production website](https://zohaibali151515.github.io/digital-twin-website/) deploys from `main` through `.github/workflows/deploy.yml`.

## Run locally

```bash
npm ci
npm run dev
npm run build
npm run preview
```

Vite builds the home page, Maikada case study and community demo detail page. The Maikada viewer uses Spark 2.2. It opens the lower SPZ band first, then loads the upper band and enables the lounge shortcut. Both retain all three spherical-harmonic bands. Independent demos are embedded from SuperSplat with creator and license credit; see [community demo rights](docs/community-demos.md).

## Maikada master and web asset

The immutable master is `Maikada Cafe/AmarTest09-Cafe_2026-09-26-15-21-40.fjdslamp2_2.ply`. It is excluded from Git. `assets/maikada/metadata.json` records its byte count and SHA-256. Keep another backup outside this computer, ideally in private versioned storage. GitHub Pages serves the derived web asset, not the master.

To recreate the progressive assets after `npm ci`:

```bash
python scripts/build_maikada_tiles.py
```

The script verifies the master, rotates the scene upright, and writes `maikada-lower.spz` and `maikada-upper.spz` under ignored `assets/maikada/web/`. Inspect each stage in a browser and compare important views with the master before copying both files to `public/`. Update the web fingerprints in the metadata record. Do not overwrite the PLY. `python scripts/build_maikada_spz.py` also builds a single full-scene reference for local comparison; it is not served by the website.

The old 28.8 MB preview can be rebuilt with `python scripts/convert_ply.py`, but it randomly samples 900,000 Gaussians and drops view-dependent color. It is kept outside the public build as a failed quality experiment. The progressive bands contain 2,768,886 Gaussians in total and preserve three spherical-harmonic bands. The lower 37.9 MB file becomes interactive first; the upper 19.1 MB file completes the lounge. The two band files total 57.0 MB. The conversion omits 704 Gaussians compared with the full 2,769,590-splat reference, a 0.025% difference; visual comparison showed no meaningful difference in tested views. See [architecture and test evidence](docs/architecture.md).

## Add a project

1. Record permission to publish, the public project name and location. For a third-party demo, record the exact model license, commercial and redistribution terms, modification rights, hosting rights and attribution.
2. Keep the original scan outside Git and public hosting. Add a metadata record with source size, checksum and capture details.
3. Generate a browser asset and compare it with the source from matched camera views. For another Gaussian PLY, adapt the checksum and path handling in `scripts/build_maikada_spz.py`; use its 90-degree rotation only if that scan needs it.
4. Add a card in `src/main.js`, a project detail page in the Vite build inputs, and a sitemap entry. Use verified project facts and outcomes only.
5. Test desktop and mobile layouts, scene quality, controls, console, broken requests and loading time before publishing.

## Deploy

Merge to `main` and push. GitHub Actions builds and publishes `dist/` to GitHub Pages. The site uses Vite's relative base path for `/digital-twin-website/`. Check the workflow result, the published asset URL and the viewer after deployment. Do not commit the master PLY, capture MP4 or temporary benchmark files.
