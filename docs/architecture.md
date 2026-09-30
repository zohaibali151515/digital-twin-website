# Maikada rendering decision

## Observed assets and current implementation

- Master file: `Maikada Cafe/AmarTest09-Cafe_2026-09-26-15-21-40.fjdslamp2_2.ply`, 653,624,780 bytes, 2,769,590 Gaussians, three spherical-harmonic bands. SHA-256: `8489c771cddc73332f3b7d3f44c6160f9505002d5b0c4ce69fa658f876534823`.
- Existing site: Vite, Three.js, `@mkkellogg/gaussian-splats-3d`, hosted by GitHub Pages. The viewer downloads one 28.8 MB `.splat` on demand.
- Existing converter randomly selects 900,000 splats and exports only base colour. It drops two thirds of the Gaussians and all view-dependent colour terms. `progressiveLoad: true` cannot recover detail absent from that asset.
- The PLY is a Gaussian-splat representation. It has positions, opacity, scales, rotations and spherical-harmonic colour coefficients. It does **not** contain mesh triangles, UV textures, surface normals or PBR materials. Requirements to preserve those mesh attributes therefore do not apply to this source.

## Technology comparison for this file

| Technology | 2.77M-splat PLY fit | Visual quality | Delivery/performance | Mobile | Effort | Decision |
| --- | --- | --- | --- | --- | --- | --- |
| Current Three.js GaussianSplats3D + `.splat` | Loads a converted scene | Weak with current random subset and SH0-only export | One 28.8 MB asset; no spatial LOD | One fixed budget | Low | Keep only as fallback until replacement is verified |
| PlayCanvas SuperSplat Viewer + Streamed SOG | Native Gaussian-splat path | Keeps all source Gaussians at top LOD and can retain SH bands, subject to SOG quantization | Spatial chunks, progressive LOD, device-aware Gaussian budget | Built-in touch/navigation and lower splat budget | Medium | Candidate; three-band output must pass visual and device testing |
| Potree + octree point cloud | Requires converting Gaussians to points | Loses anisotropic shape, alpha compositing and view-dependent colour | Excellent for survey point-cloud inspection | Variable | Medium | Use for future LiDAR point-cloud products, not this photoreal tour |
| GLB/glTF mesh + Draco/Meshopt | Source has no triangle mesh | Requires reconstruction; a naïve conversion loses the splat appearance | Excellent for meshes after proper meshing | Strong | High | Use only when a mesh is a separate deliverable |
| `<model-viewer>` | Primarily glTF/USDZ viewer | Same meshing limitation | Strong for conventional models | Strong | Low after meshing | Not selected |
| Babylon.js/WebGL custom splat pipeline | Possible | Depends on implementation | Would require our own streaming/LOD stack | Possible | High | No reason to build this before validating the supported stack |
| WebGPU alone | Browser graphics API, not an asset pipeline | Renderer dependent | Can improve sorting/rasterization; fallback required | Uneven support | High | Let the selected viewer choose WebGPU/WebGL |

The Streamed SOG format is documented as a spatial tree of chunks and LODs. The [official format specification](https://developer.playcanvas.com/user-manual/gaussian-splatting/formats/streamed-sog/) and [generation guide](https://developer.playcanvas.com/user-manual/splat-transform/streamed-sog/) describe the file layout and conversion. The [SuperSplat performance guide](https://developer.playcanvas.com/user-manual/supersplat/streaming/) describes device-aware Gaussian budgets. Format support alone does not prove acceptable quality for this scan.

## Current visual and performance evidence (2026-09-30)

- A 2.77M-splat, three-band rotated compressed PLY renders the Maikada interior clearly in SuperSplat Viewer at camera position `[0.8,-2.2,0.8]`, looking toward `[0.8,-2.2,3]`. This is a local quality reference, not a mobile delivery asset: it is 161.9 MB.
- A three-LOD Streamed SOG made with `--filter-harmonics 0` occupies about 61 MB and retains all source positions at its top LOD. It **fails the visual gate** at the same camera: almost the entire interior is black. Re-exported LOD0 has matching position, scale, opacity, color DC and rotation statistics. Full-count compressed PLYs with zero, one or two SH bands also fail at this view; the three-band compressed PLY succeeds. Preserve all three bands for Maikada.
- 20% adaptive, uniform and random subsets also fail at this interior view even when retaining all three SH bands. The visual reference requires the full Gaussian count. Lower-density LODs cannot be assumed to give a usable interior preview for this particular scan.
- A 54.7 MB, three-band SPZ v3 was generated, but SuperSplat Viewer v1.36.2 reports `No parser found for resource` and the existing Three.js viewer rejects SPZ v3. It is not a working browser delivery format in this app.
- A 126.5 MB, spatially chunked Streamed SOG containing all 2.77M Gaussians and all three SH bands also fails the same-camera visual comparison: almost the entire frame is black. It is kept as a local experiment and is not published. Full count and SH3 alone do not make this conversion visually equivalent to the reference PLY.
- A production-build mobile emulation with Fast 4G and 4x CPU slowdown reached the first loaded frame of the SH0 SOG in 8.3 seconds after forcing `renderer: 'webgl'`. This is a loading measurement only; visual quality failed. Before that fix, the default WebGPU startup took over a minute in the same emulation.
- The user can test on a Google Pixel 7 after a working candidate is published. Physical device, FPS, memory and interaction measurements remain outstanding. No claim of mobile readiness is supported yet.

## Asset architecture

```text
Maikada Cafe/*.ply                 Local immutable master; excluded from Git
assets/maikada/metadata.json       Master fingerprint and pipeline parameters
assets/maikada/web/               Local generated working files; excluded from Git
public/assets/maikada/            Published web assets during the GitHub Pages pilot
GitHub Pages                       Frontend and pilot asset delivery
R2 or another object store         Later, when many projects or traffic justify it
```

The master stays outside the public repository. Back it up in a second physical location and a private cloud bucket with versioning. A local file alone is not a durable archive.

GitHub Pages is acceptable for a single pilot scene; it has a [soft 100 GB/month bandwidth limit](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits). More scenes and repeated downloads should move generated assets to object storage while the app stays on Pages. [Cloudflare R2](https://developers.cloudflare.com/r2/pricing/) is a practical first candidate because it has a 10 GB-month standard-storage free tier, request allowances and no egress charge, but it needs account setup, public access configuration and CORS. [Supabase Storage](https://supabase.com/docs/guides/storage/pricing) has a smaller free storage quota and [egress quota](https://supabase.com/docs/guides/platform/manage-your-usage/egress). [S3 + CloudFront](https://aws.amazon.com/s3/pricing/) offers mature infrastructure but more configuration and usage-based delivery costs. GitHub Releases is not a CDN strategy for hot-linked scene chunks.

| Delivery option | Cost/bandwidth fit for many scene chunks | Setup and CORS | Recommendation |
| --- | --- | --- | --- |
| GitHub Pages | Free pilot, but [100 GB/month soft bandwidth limit](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) | Already configured; same-origin assets | Keep for the frontend and first production scene only |
| Cloudflare R2 | [10 GB-month storage, 1M writes and 10M reads free each month; no egress charge](https://developers.cloudflare.com/r2/pricing/) | Create bucket/public domain, set CORS for Pages origin and immutable cache headers | Best early-stage object-storage candidate |
| Supabase Storage | [Free plan has 5 GB uncached and 5 GB cached egress quotas](https://supabase.com/docs/guides/platform/manage-your-usage/egress) | Easy dashboard, public bucket and CORS | Fine for small previews, less room for large tours |
| Backblaze B2 | [Free egress up to 3x average stored volume, then usage charges](https://www.backblaze.com/cloud-storage/transaction-pricing) | Bucket and CDN/CORS setup | Good alternative when storage economics matter |
| S3 + CloudFront | [Usage-based storage and delivery pricing](https://aws.amazon.com/s3/pricing/) | More IAM, CDN and CORS configuration | Revisit when enterprise controls justify it |

Network speed still depends on chunk sizes, CDN cache hits and the visitor's location. Benchmark a deployed asset from Pakistan before assuming one provider is faster. Use versioned asset paths so browsers never mix metadata and chunks from different conversions.

## Quality gates before production switch

1. Generate a full-detail SOG or Streamed SOG from the original PLY without overwriting it. Preserve all three SH bands unless a measured comparison supports a lower setting.
2. Compare the original scan and web output at the same camera views: architectural edges, fine objects, colour, transparency and floaters.
3. Measure first usable frame, transferred bytes, memory where available, frame rate and responsiveness on desktop and physical low/mid/high Android and iPhone devices. Browser emulation is a development check, not a substitute for those devices.
4. Keep the current live viewer unchanged until the new viewer and asset paths pass desktop/mobile checks.

## Public demo licensing gate

No third-party scan is added to the portfolio without source-specific evidence for commercial use, redistribution, derivative conversion, website hosting and attribution. A repository's code license does not automatically license its sample scans. Where a dataset page and license page conflict, seek written clarification before publishing.
