# Tailwind build for the resource kit

Precompiled Tailwind stylesheet for the tools.amditis.tech resource kit
(`resource-kit/docs`). It replaces the Tailwind Play CDN
(`cdn.tailwindcss.com`), which compiles in the browser at runtime, blocks first
paint, and logs a production warning on every page load.

## Build

```
npm install
npm run build
```

That scans `../docs/**/*.html` and `../docs/**/*.js` and writes the minified
stylesheet to `../docs/assets/tailwind.css`, which the pages load with
`<link rel="stylesheet" href="/assets/tailwind.css">`. The output is committed
because `deploy.sh` runs `wrangler pages deploy resource-kit/docs` with no build
step: it ships whatever is committed. Rebuild and commit the output whenever a
migrated page's classes change, or the live page silently loses styles.

## Theme

`tailwind.config.js` mirrors the Amditis V2 design system that the pages loaded at
runtime from `docs/assets/amditis-config.js` (the `canvas`/`ink`/`accent` palette,
the Fraunces and Plus Jakarta Sans fonts, and the drift and page-in animations).
Keep the two in sync until every page is migrated, then retire the runtime config.

## Migration status

Migrated to the precompiled stylesheet: every static content page whose Tailwind
classes all resolve as literals from the HTML and JS the build scans.

Still on the Play CDN, deliberately, are the pages a static build cannot cover
without extra work, because it only ships the classes it sees at build time:

- Class names built at runtime by string interpolation (`bg-${color}`), which the
  glob scan cannot see: `llm-advisor/ai-showcase/index.html`, whose cards build
  their hover and accent classes from a data array. Migrating it needs a `safelist`
  (or a per-page class inventory) that captures the interpolated classes, verified
  page by page.
- Pages carrying their own inline `tailwind.config`: `html-editor/index.html` and
  `llm-advisor/vibe-coding/index.html`. Migrating these needs their `theme.extend`
  merged into `tailwind.config.js` (watch for palette-name collisions between pages).

The remaining pages are tracked in jamditis/tools#78, so the split stays on the
record and the production warning gets fully retired.
