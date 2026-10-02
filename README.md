# Digital Twin website

Digital Twin is a Lahore reality capture and interactive 3D service. The [production website](https://zohaibali151515.github.io/digital-twin-website/) deploys from `main` through `.github/workflows/deploy.yml`.

## Run locally

```bash
npm ci
npm run dev
npm run build
npm run preview
```

Vite builds the home page, Maikada case study and community demo detail page. The Maikada viewer opens a scan-rendered panorama while Spark 2.2 loads four progressive SPZ assets: an opening core, the rest of the café room for navigation, fine café detail, and the upper room. All four retain the source's three spherical-harmonic bands. The viewer has Orbit, room-limited Explore and free Fly modes. Seven independent demos are embedded from SuperSplat with creator and license credit; see [community demo rights](docs/community-demos.md).

## Maikada master and web asset

The immutable master is `Maikada Cafe/AmarTest09-Cafe_2026-09-26-15-21-40.fjdslamp2_2.ply`. It is excluded from Git. `assets/maikada/metadata.json` records its byte count and SHA-256. Keep another backup outside this computer, ideally in private versioned storage. GitHub Pages serves the derived web asset, not the master.

To recreate the progressive assets after `npm ci` and `pip install numpy`:

```bash
python scripts/build_maikada_tiles.py
python scripts/split_maikada_preview.py
```

The first script verifies the master, splits the first room by initial-camera visibility, rotates the splats upright, and writes `maikada-preview.spz`, `maikada-remainder.spz` and `maikada-upper.spz` under ignored `assets/maikada/web/`. The second script verifies the master again and splits the preview PLY into `maikada-preview-core.spz` and `maikada-preview-tail.spz`. The published viewer uses the core, remainder, tail and upper SPZ files in that order. Inspect opening and completed views before copying those four files to `public/`, and update their checksums in `assets/maikada/metadata.json`. Do not overwrite the PLY. `python scripts/build_maikada_spz.py` also builds a single full-scene reference for local comparison; it is not served by the website.

The old 28.8 MB preview can be rebuilt with `python scripts/convert_ply.py`, but it randomly samples 900,000 Gaussians and drops view-dependent color. It is kept outside the public build as a failed quality experiment. The current four published layers contain 2,769,449 Gaussians in total and preserve three spherical-harmonic bands. A six-face, 804 KB panorama allows immediate look-around from the entry position. The 7.1 MB opening core then permits restricted 3D rotation; the 13.5 MB room complement unlocks Orbit, Explore and Fly. The 17.0 MB tail refines café detail, and the 19.1 MB upper band enables the lounge. The four SPZ files total 56.8 MB. The conversion omits 141 Gaussians compared with the 2,769,590-splat full reference, a 0.005% difference; matched screenshots showed the completed room equal to the previous full-room asset in tested views. See [architecture and test evidence](docs/architecture.md).

To regenerate the panorama faces from the current full-detail web assets, start `npm run dev -- --port 5173` and, in another terminal, run `node scripts/capture_maikada_panorama.cjs` for the café entry. For the lounge, set `PANORAMA_ORIGIN=1,0,2` and `PANORAMA_PREFIX=lounge` before running the same script. Chrome must be installed; set `CHROME_PATH` if its executable is elsewhere. The script waits for all four SPZ assets, renders six 90-degree directions, writes JPEGs under `public/maikada/panorama/`, and updates their checksums in `assets/maikada/metadata.json`. `capture-panorama.html` is a local capture page and is excluded from the production build. Inspect all faces after a new conversion.

To rebuild the home page's real Maikada hero image from the same full-detail scene, run `node scripts/capture_maikada_hero.cjs` while the dev server is running. It writes an 800 × 1000 WebP image and updates its checksum in the metadata record. The image is generated from the scanned scene; it is not a stock or AI-generated depiction. The local `MaikadaCafe.mp4` is a SuperSplat screen recording of this scan, not original X5 footage, so it is not used as a higher-quality image source.

Both café and lounge have fast, fixed-position 360 previews while their detailed 3D assets load. The lounge preview is fetched only when the visitor selects it. The 360 views allow rotation but no translation; Orbit, Explore and Fly become available for full 3D after the required scan data is ready.

In the live viewer, Orbit uses drag, right drag and wheel or pinch. Explore uses drag to look and WASD or arrow keys to move within the selected room. Fly uses the same look controls but moves freely in the viewed direction; Q/E move down/up and Shift increases speed. On phones, Fly has movement arrows and Up/Down buttons. Reset returns to the café entrance if a camera moves outside the captured area.

For a physical-phone performance check, open `https://zohaibali151515.github.io/digital-twin-website/?tour=maikada&diagnostics=1`. This opt-in panel shows elapsed time to both 360 views, the first SPZ asset, first visible 3D, café navigation, full café detail and lounge data. It also estimates scene bytes loaded from Spark's download progress, recent browser frame cadence and Chromium's JavaScript heap when available. Tap **Copy results** and paste the readings into a message, then add whether the phone used Wi-Fi or mobile data. It does not send telemetry to a server. Scene bytes include cached files and are not network-usage measurement; frame cadence is not GPU render time, and JavaScript heap excludes GPU textures and other tab memory. Use a fresh browser tab for first-visit timing. The ordinary tour URL omits the panel.

`public/maikada-poster.jpg` is a clean frame captured from the current full-detail browser viewer. Replace it after a new scan or a major viewer change so the preview reflects the real interactive result. Portrait screens use a wider camera field of view to show more of each room.

## Add a project

1. Record permission to publish, the public project name and location. For a third-party demo, record the exact model license, commercial and redistribution terms, modification rights, hosting rights and attribution.
2. Keep the original scan outside Git and public hosting. Add a metadata record with source size, checksum and capture details.
3. Generate a browser asset and compare it with the source from matched camera views. For another Gaussian PLY, adapt the checksum and path handling in `scripts/build_maikada_spz.py`; use its 90-degree rotation only if that scan needs it.
4. Add a card in `src/main.js`, a project detail page in the Vite build inputs, and a sitemap entry. Use verified project facts and outcomes only.
5. Test desktop and mobile layouts, scene quality, controls, console, broken requests and loading time before publishing.

## Deploy

Merge to `main` and push. GitHub Actions builds and publishes `dist/` to GitHub Pages. The site uses Vite's relative base path for `/digital-twin-website/`. Check the workflow result, the published asset URL and the viewer after deployment. Do not commit the master PLY, capture MP4 or temporary benchmark files.
