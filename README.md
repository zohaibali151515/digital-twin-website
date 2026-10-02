# Digital Twin website

Digital Twin is a Lahore reality capture and interactive 3D service. The [production website](https://zohaibali151515.github.io/digital-twin-website/) deploys from `main` through `.github/workflows/deploy.yml`.

## Run locally

```bash
npm ci
npm run dev
npm run build
npm run preview
```

Vite builds the home page, Maikada case study and community demo detail page. The Maikada viewer opens a scan-rendered panorama while Spark 2.2 loads the camera-first SPZ preview, adds the complementary splats to complete the café room, then loads the upper band and enables the lounge shortcut. All three SPZ assets retain the source's three spherical-harmonic bands. The viewer has Orbit, room-limited Explore and free Fly modes. Independent demos are embedded from SuperSplat with creator and license credit; see [community demo rights](docs/community-demos.md).

## Maikada master and web asset

The immutable master is `Maikada Cafe/AmarTest09-Cafe_2026-09-26-15-21-40.fjdslamp2_2.ply`. It is excluded from Git. `assets/maikada/metadata.json` records its byte count and SHA-256. Keep another backup outside this computer, ideally in private versioned storage. GitHub Pages serves the derived web asset, not the master.

To recreate the progressive assets after `npm ci` and `pip install numpy`:

```bash
python scripts/build_maikada_tiles.py
```

The script verifies the master, splits the first room by initial-camera visibility, rotates the splats upright, and writes `maikada-preview.spz`, `maikada-remainder.spz` and `maikada-upper.spz` under ignored `assets/maikada/web/`. Inspect the opening view and the completed scene in a browser before copying all three to `public/`. Update the web fingerprints in the metadata record. Do not overwrite the PLY. `python scripts/build_maikada_spz.py` also builds a single full-scene reference for local comparison; it is not served by the website.

The old 28.8 MB preview can be rebuilt with `python scripts/convert_ply.py`, but it randomly samples 900,000 Gaussians and drops view-dependent color. It is kept outside the public build as a failed quality experiment. The current three bands contain 2,769,449 Gaussians in total and preserve three spherical-harmonic bands. A six-face, 804 KB panorama allows immediate look-around from the entry position. The 24.2 MB first 3D view then becomes interactive within a restricted camera range while the 13.5 MB complement loads; the 19.1 MB upper band enables the lounge. The three SPZ files total 56.9 MB. The conversion omits 141 Gaussians compared with the 2,769,590-splat full reference, a 0.005% difference; matched screenshots showed the completed room equal to the previous full-room asset in tested views. See [architecture and test evidence](docs/architecture.md).

To regenerate the six panorama faces from the current full-detail web assets, start `npm run dev -- --port 5173` and, in another terminal, run `node scripts/capture_maikada_panorama.cjs`. Chrome must be installed; set `CHROME_PATH` if its executable is elsewhere. The capture script waits for all three SPZ assets, renders six 90-degree directions at the entry camera, writes JPEGs under `public/maikada/panorama/`, and updates their checksums in `assets/maikada/metadata.json`. `capture-panorama.html` is a local capture page and is excluded from the production build. Inspect all faces after a new conversion.

In the live viewer, Orbit uses drag, right drag and wheel or pinch. Explore uses drag to look and WASD or arrow keys to move within the selected room. Fly uses the same look controls but moves freely in the viewed direction; Q/E move down/up and Shift increases speed. On phones, Fly has movement arrows and Up/Down buttons. Reset returns to the café entrance if a camera moves outside the captured area.

For a physical-phone performance check, open `https://zohaibali151515.github.io/digital-twin-website/?tour=maikada&diagnostics=1`. This opt-in panel shows elapsed time to the 360 preview, first 3D view, full café room and lounge, plus recent browser frame cadence and Chromium's JavaScript heap estimate when available. It does not send telemetry to a server. Frame cadence is not GPU render time, and JavaScript heap does not include GPU textures or all tab memory. Use a fresh browser tab and note whether the phone is on mobile data or Wi-Fi; cached repeat visits are not comparable to first visits. The ordinary tour URL omits the panel.

`public/maikada-poster.jpg` is a clean frame captured from the current full-detail browser viewer. Replace it after a new scan or a major viewer change so the preview reflects the real interactive result. Portrait screens use a wider camera field of view to show more of each room.

## Add a project

1. Record permission to publish, the public project name and location. For a third-party demo, record the exact model license, commercial and redistribution terms, modification rights, hosting rights and attribution.
2. Keep the original scan outside Git and public hosting. Add a metadata record with source size, checksum and capture details.
3. Generate a browser asset and compare it with the source from matched camera views. For another Gaussian PLY, adapt the checksum and path handling in `scripts/build_maikada_spz.py`; use its 90-degree rotation only if that scan needs it.
4. Add a card in `src/main.js`, a project detail page in the Vite build inputs, and a sitemap entry. Use verified project facts and outcomes only.
5. Test desktop and mobile layouts, scene quality, controls, console, broken requests and loading time before publishing.

## Deploy

Merge to `main` and push. GitHub Actions builds and publishes `dist/` to GitHub Pages. The site uses Vite's relative base path for `/digital-twin-website/`. Check the workflow result, the published asset URL and the viewer after deployment. Do not commit the master PLY, capture MP4 or temporary benchmark files.
