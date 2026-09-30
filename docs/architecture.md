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
| PlayCanvas SuperSplat Viewer + Streamed SOG | Native Gaussian-splat path | Keeps all source Gaussians at top LOD and can retain SH bands, subject to SOG quantization | Spatial chunks, progressive LOD, device-aware Gaussian budget | Built-in touch/navigation and lower splat budget | Medium | **Recommended for Maikada**, pending visual and device testing |
| Potree + octree point cloud | Requires converting Gaussians to points | Loses anisotropic shape, alpha compositing and view-dependent colour | Excellent for survey point-cloud inspection | Variable | Medium | Use for future LiDAR point-cloud products, not this photoreal tour |
| GLB/glTF mesh + Draco/Meshopt | Source has no triangle mesh | Requires reconstruction; a naïve conversion loses the splat appearance | Excellent for meshes after proper meshing | Strong | High | Use only when a mesh is a separate deliverable |
| `<model-viewer>` | Primarily glTF/USDZ viewer | Same meshing limitation | Strong for conventional models | Strong | Low after meshing | Not selected |
| Babylon.js/WebGL custom splat pipeline | Possible | Depends on implementation | Would require our own streaming/LOD stack | Possible | High | No reason to build this before validating the supported stack |
| WebGPU alone | Browser graphics API, not an asset pipeline | Renderer dependent | Can improve sorting/rasterization; fallback required | Uneven support | High | Let the selected viewer choose WebGPU/WebGL |

The Streamed SOG format is documented as a spatial tree of chunks and LODs. The [official format specification](https://developer.playcanvas.com/user-manual/gaussian-splatting/formats/streamed-sog/) and [generation guide](https://developer.playcanvas.com/user-manual/splat-transform/streamed-sog/) describe the file layout and conversion. The [SuperSplat performance guide](https://developer.playcanvas.com/user-manual/supersplat/streaming/) describes device-aware Gaussian budgets. This recommendation is based on source-file inspection and supported runtime behaviour; quality and performance claims for Maikada require measurement on the generated scene.

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

## Quality gates before production switch

1. Generate a full-detail SOG or Streamed SOG from the original PLY without overwriting it. Preserve all three SH bands unless a measured comparison supports a lower setting.
2. Compare the original scan and web output at the same camera views: architectural edges, fine objects, colour, transparency and floaters.
3. Measure first usable frame, transferred bytes, memory where available, frame rate and responsiveness on desktop and physical low/mid/high Android and iPhone devices. Browser emulation is a development check, not a substitute for those devices.
4. Keep the current live viewer unchanged until the new viewer and asset paths pass desktop/mobile checks.

## Public demo licensing gate

No third-party scan is added to the portfolio without source-specific evidence for commercial use, redistribution, derivative conversion, website hosting and attribution. A repository's code license does not automatically license its sample scans. Where a dataset page and license page conflict, seek written clarification before publishing.
