# Maikada rendering decision

## Observed assets and current implementation

- Master file: `Maikada Cafe/AmarTest09-Cafe_2026-09-26-15-21-40.fjdslamp2_2.ply`, 653,624,780 bytes, 2,769,590 Gaussians, three spherical-harmonic bands. SHA-256: `8489c771cddc73332f3b7d3f44c6160f9505002d5b0c4ce69fa658f876534823`.
- Current site: Vite, Three.js and Spark 2.2, hosted by GitHub Pages. The Maikada viewer downloads a 24.2 MB camera-first preview, adds a 13.5 MB complement to complete café navigation, then downloads the 19.1 MB upper band and enables the lounge shortcut. All three are SH3 SPZ v3. A 57.3 MB full-scene SPZ is retained locally as a comparison asset, outside the public build.
- Existing converter randomly selects 900,000 splats and exports only base colour. It drops two thirds of the Gaussians and all view-dependent colour terms. `progressiveLoad: true` cannot recover detail absent from that asset.
- The PLY is a Gaussian-splat representation. It has positions, opacity, scales, rotations and spherical-harmonic colour coefficients. It does **not** contain mesh triangles, UV textures, surface normals or PBR materials. Requirements to preserve those mesh attributes therefore do not apply to this source.

## Technology comparison for this file

| Technology | 2.77M-splat PLY fit | Visual quality | Delivery/performance | Mobile | Effort | Decision |
| --- | --- | --- | --- | --- | --- | --- |
| Old Three.js GaussianSplats3D + `.splat` | Loads a converted scene | Weak with random subset and SH0-only export | One 28.8 MB asset; no spatial LOD | One fixed budget | Low | Replaced in production |
| Three.js + Spark 2.2 + SPZ v3 | Loads 2,769,449 Gaussians across three bands with SH3 after conversion | Detailed interior in desktop and mobile-sized browser tests | 24.2 MB opening view, 13.5 MB complement, then 19.1 MB upper room | Browser emulation works; physical phones pending | Medium | Current production renderer |
| PlayCanvas SuperSplat Viewer + Streamed SOG | Native Gaussian-splat path | Keeps all source Gaussians at top LOD and can retain SH bands, subject to SOG quantization | Spatial chunks, progressive LOD, device-aware Gaussian budget | Built-in touch/navigation and lower splat budget | Medium | Candidate; three-band output must pass visual and device testing |
| Potree + octree point cloud | Requires converting Gaussians to points | Loses anisotropic shape, alpha compositing and view-dependent colour | Excellent for survey point-cloud inspection | Variable | Medium | Use for future LiDAR point-cloud products, not this photoreal tour |
| GLB/glTF mesh + Draco/Meshopt | Source has no triangle mesh | Requires reconstruction; a naïve conversion loses the splat appearance | Excellent for meshes after proper meshing | Strong | High | Use only when a mesh is a separate deliverable |
| `<model-viewer>` | Primarily glTF/USDZ viewer | Same meshing limitation | Strong for conventional models | Strong | Low after meshing | Not selected |
| Babylon.js/WebGL custom splat pipeline | Possible | Depends on implementation | Would require our own streaming/LOD stack | Possible | High | No reason to build this before validating the supported stack |
| WebGPU alone | Browser graphics API, not an asset pipeline | Renderer dependent | Can improve sorting/rasterization; fallback required | Uneven support | High | Let the selected viewer choose WebGPU/WebGL |

The Streamed SOG format is documented as a spatial tree of chunks and LODs. The [official format specification](https://developer.playcanvas.com/user-manual/gaussian-splatting/formats/streamed-sog/) and [generation guide](https://developer.playcanvas.com/user-manual/splat-transform/streamed-sog/) describe the file layout and conversion. The [SuperSplat performance guide](https://developer.playcanvas.com/user-manual/supersplat/streaming/) describes device-aware Gaussian budgets. Format support alone does not prove acceptable quality for this scan.

## Visual and performance evidence (2026-09-30 to 2026-10-01)

- A 2.77M-splat, three-band rotated compressed PLY renders the Maikada interior clearly in SuperSplat Viewer at camera position `[0.8,-2.2,0.8]`, looking toward `[0.8,-2.2,3]`. This is a local quality reference, not a mobile delivery asset: it is 161.9 MB.
- A three-LOD Streamed SOG made with `--filter-harmonics 0` occupies about 61 MB and retains all source positions at its top LOD. An earlier interior test showed a largely black view. Later camera tests found that the full-SH SOG can render matching exterior detail, so that black frame alone does not prove a conversion defect. Full-count compressed PLYs with zero, one or two SH bands failed at the earlier interior view; the three-band compressed PLY succeeded. Preserve all three bands for Maikada.
- 20% adaptive, uniform and random subsets also fail at this interior view even when retaining all three SH bands. The visual reference requires the full Gaussian count. Lower-density LODs cannot be assumed to give a usable interior preview for this particular scan.
- A 54.7 MiB, three-band SPZ v3 was rejected by SuperSplat Viewer v1.36.2 and the previous Three.js viewer. Spark 2.2 loaded and rendered that SPZ successfully, so the renderer was changed rather than degrading the scan.
- A 126.5 MB, spatially chunked Streamed SOG containing all 2.77M Gaussians and all three SH bands eventually rendered a matched exterior view, but its local viewer took roughly 215 seconds to become ready. The earlier black interior comparison used a camera position outside the intended room, so it is not reliable evidence of visual failure. This variant is kept as a local experiment because its measured loading time is unsuitable for the website.
- A production-build mobile emulation with Fast 4G and 4x CPU slowdown reached the first loaded frame of the SH0 SOG in 8.3 seconds after forcing `renderer: 'webgl'`. This is a loading measurement only; visual quality failed. Before that fix, the default WebGPU startup took over a minute in the same emulation.
- On 2026-10-01, the production Spark build rendered the complete SPZ in local desktop and Pixel 7-sized Chrome emulation in approximately 4–5 seconds. After publishing, the same tests reached a visible scene in about 13.4 seconds desktop and 10.7 seconds mobile-sized Chrome. Those measurements reflect those specific network conditions, not all mobile networks. The GitHub Pages asset returned HTTP 200 and `Content-Length: 57306183`. The user was asked to check the physical Pixel 7; FPS, RAM, GPU use, interaction smoothness and low/high-end Android and iPhone checks remain open.
- On 2026-10-01, the progressive build in local production preview made the café room interactive in approximately 2.5–2.8 seconds on desktop and Pixel 7-sized Chrome emulation. Both bands were ready in approximately 4.5–4.9 seconds. Matched screenshots showed the first room complete with only the lower band and the lounge complete after both loaded. Loading the upper band alone removed lounge seating and floor details, so the viewer keeps the lower band resident. These times are local measurements; public and physical-phone checks remain necessary before claiming mobile performance.
- A controlled Pixel 7-sized Chrome emulation with an 8 Mbps download cap, 150 ms latency and 4× CPU slowdown took 41.7 seconds to expose the first room and 61.2 seconds for both bands. Browser-frame sampling after loading measured about 57 frames/s idle and 53 frames/s during a drag; this is desktop-host emulation, not physical Pixel 7 GPU evidence. The first download remains too large for a few-second mobile-data target.
- Spark 2.2's [RAD paged streaming](https://sparkjs.dev/docs/lod-getting-started/) was tested from the full-count SH3 SPZ using its quality LoD builder. The full RAD tree produced 58 chunk files plus an index, 87.8 MB total. In a local browser it fetched about 54–56 of those chunks within five seconds at the initial café camera. Under the same 8 Mbps/4× CPU throttle, the first view was black at 3 seconds, coarse at 8 seconds, visibly improving at 15 seconds, and close to the full-detail reference by 30–45 seconds. Lowering `lodSplatScale` from 1.0 to 0.5 still fetched about 54 chunks in five seconds. This particular scene did not show a useful total-bandwidth reduction, so RAD was not published in place of the staged SPZ viewer. The test artifacts remain local and ignored by Git.
- A hosted mobile-sized Chrome run on 2026-10-01 took 40.9 seconds for the first room and 75.6 seconds for both; other hosted runs were much faster. The CDN/network path is variable, and the current design cannot guarantee a quick first interaction on mobile data.
- A Pixel 7-sized Chrome viewport at device pixel ratio 2 was compared with a renderer cap of 1.25 and 1.75. The 1.75 cap produced a slightly sharper lounge image and sampled at 60 requestAnimationFrame callbacks per second on the desktop host. The viewer now starts at 1.75 and drops to 1.25 after a sustained five-second interval below 35 rendered frames per second. This is a development safeguard, not evidence of physical Pixel 7 frame rate or GPU use; actual phone testing is still needed.
- Smaller spatial crops of 16.8 MB (884K splats) and 25.3 MB (1.29M splats), both retaining SH3, failed a four-direction camera gate: the forward view had a large black hole while side and rear views looked more complete. They were rejected. An initial all-black comparison was caused by capturing before Spark's first visible frame; the reference full-band asset also appeared black under that timing. More spatial cuts should use matched multi-direction visual checks after the first visible frame before publication.
- A camera-based split keeps the source splats relevant to the opening view plus a 70° horizontal and 55° vertical selection margin. Its 24.2 MB SH3 preview matched the 37.9 MB full-room reference in the opening desktop and mobile-sized views and at ±15° in the mobile comparison. A large leftward turn still has missing geometry; the viewer therefore limits turning to about ±10° and disables pan/zoom until the 13.5 MB complement loads. The completed two-part room matched the reference across eight tested camera directions. The full three-part delivery is 56.9 MB and retains 2,769,449 of 2,769,590 source Gaussians.
- In a local Pixel 7-sized Chrome run with an 8 Mbps download cap, 150 ms latency and 4× CPU slowdown, the new opening view appeared at 29.9 seconds, full café navigation at 45.9 seconds and the lounge at 66.4 seconds, with no reported browser errors. The comparable previous two-band run reached the first room at 41.7 seconds and both rooms at 61.2 seconds. First visibility improves, but the entire tour finishes later; neither result proves physical-phone performance or a few-second mobile preview.

## Asset architecture

```text
Maikada Cafe/*.ply                 Local immutable master; excluded from Git
assets/maikada/metadata.json       Master fingerprint and pipeline parameters
assets/maikada/web/               Local generated working files; excluded from Git
public/maikada-preview.spz         First restricted interactive view
public/maikada-remainder.spz       Completes unrestricted café navigation
public/maikada-upper.spz           Completes the lounge
assets/maikada/web/*.rad[c]        Local RAD streaming experiment; excluded from Git
assets/maikada/web/maikada-full-upright.spz  Local full-scene comparison asset
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

## Remaining quality gates

1. Repeat the SPZ conversion using `scripts/build_maikada_spz.py` and compare important interior views with the original scan. The original PLY checksum is verified before conversion.
2. Improve the 24.2 MB first-view download toward a few-second mobile preview while preserving source detail. Simple box crops failed matched-view checks. The camera-first split makes the opening view available sooner, but the full café room and lounge still take roughly the same total transfer and need faster delivery or better streaming.
3. Measure first usable frame, transferred bytes, memory where available, frame rate and responsiveness on desktop and physical low/mid/high Android and iPhone devices. Browser emulation is a development check, not a substitute for those devices.
4. Validate tour navigation across the rooms and a stable Pixel 7 experience before calling the digital twin complete.

## Public demo licensing gate

No third-party scan is added to the portfolio without source-specific evidence for commercial use, redistribution, derivative conversion, website hosting and attribution. A repository's code license does not automatically license its sample scans. Where a dataset page and license page conflict, seek written clarification before publishing.
