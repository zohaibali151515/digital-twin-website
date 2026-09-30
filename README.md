# Digital Twin website

A one-page business website with a real Maikada Cafe 3D preview and WhatsApp inquiry links.

## Run locally

```bash
npm install
python scripts/convert_ply.py
npm run dev
```

The original PLY stays in `Maikada Cafe/`. The converter creates a 28.8 MB browser preview in `public/`. The original 654 MB file is ignored by Git. To build: `npm run build`.

## Publish on GitHub Pages

1. Create a public GitHub repository, such as `digital-twin-website`.
2. Push this folder to its `main` branch. The workflow in `.github/workflows/deploy.yml` builds and deploys the site.
3. In repository **Settings → Pages**, select **GitHub Actions** as the source.
4. The public address will be `https://YOUR-USERNAME.github.io/digital-twin-website/`.

GitHub Pages is free for a public repository. The PLY source is not included; the 28.8 MB preview is. A custom domain can be added later.

## Before public promotion

Get written approval from Maikada to publish its name and scene. Check the tour on the phones and connections used by your prospects. The current preview is a sampled version of the source and may need further optimization or camera tuning for a polished commercial delivery.
