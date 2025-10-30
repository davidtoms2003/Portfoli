# Portfolio (Astro)

Minimal, cinematic portfolio built with Astro. It includes Home, My Videos, and a Gallery with a lightbox and subtle spotlight hover effect. Optimized images (WebP + responsive srcset) are served from `public/gallery`.

Deployed to GitHub Pages. The `astro.config.mjs` file sets the `site` and `base` to match the repository path.

## Features

- Pages: Home (`/`), My Videos (`/my-videos`), About (`/about`), Gallery (`/gallery`)
- Gallery: masonry-style layout, keyboard-accessible lightbox (ESC/←/→)
- Cinematic hover: inline SVG spotlight with animated film grain (disabled on touch devices)
- Image optimization: `.webp` responsive variants with `<picture>`, `srcset`, and `sizes`
- Scripted conversion of gallery assets to WebP (Sharp)

## Scripts

- `npm run dev` – Start local dev server
- `npm run build` – Build static site to `dist/`
- `npm run preview` – Preview the built site locally
- `npm run images:webp` – Convert images in `public/gallery` and `public/thumbnails` to WebP and generate responsive variants
- `npm run images:clean` – Remove original JPG/JPEG/PNG from those folders

## How to run

1) Install dependencies: `npm install`
2) During development: `npm run dev`
3) Before pushing/deploying: `npm run images:webp` (create/update `.webp` variants), optionally `npm run images:clean` to keep only WebP, then `npm run build`
4) Optional local check: `npm run preview`

## Deployment

- Configured for GitHub Pages via `.github/workflows/deploy.yml`
- `astro.config.mjs` sets `site` and `base` to the repository URL and subpath
- Pushing to `main` triggers a build and deploy

## Structure (high level)

```
public/
	gallery/         # Full-size images and generated WebP variants
	thumbnails/      # Thumbnails (used by cards/lists)
src/
	layouts/BaseLayout.astro  # Shared navigation + layout
	pages/                    # index, my-videos, about, gallery
	data/                     # videos and gallery sources
scripts/
	convert-gallery-to-webp.mjs  # Sharp-based conversion script
```

## Notes

- Replace placeholder images/text with your own content.
- For best results, place original source images in `public/gallery`; the script generates `.webp` and responsive widths alongside them.
- On mobile (no hover), the spotlight effect is disabled for performance.
