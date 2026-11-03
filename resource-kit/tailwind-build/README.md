# Tailwind build for the resource kit

Precompiled Tailwind stylesheet for the tools.amditis.tech resource kit
(`resource-kit/docs`). It replaces the Tailwind Play CDN
(`cdn.tailwindcss.com`), which compiles in the browser at runtime, blocks first
paint, and logs a production warning on every page load.

## Build

This public repository uses GitHub-hosted CI; do not run this build on fleet
machines. These commands describe the build process for an approved hosted job.
The Content checks workflow does not rebuild CSS or run this suite.

```
npm install
npm run build
```

That scans `../docs/**/*.html` and `../docs/**/*.js` and writes the minified
stylesheet to `../docs/assets/tailwind.css`, which the pages load with
`<link rel="stylesheet" href="/assets/tailwind.css">`. The output is committed
because the primary Pages workflow uploads `resource-kit/docs` with no build
step. The fallback `deploy.sh` also ships committed files without a build. Rebuild and commit the output whenever a
migrated page's classes change, or the live page silently loses styles.

## Theme

`tailwind.config.js` retains the base V2 utility palette and namespaced
tokens for pages with distinct palettes or typography. The namespaced font
families keep the vibe-coding guide's Space Grotesk, Merriweather, and JetBrains
Mono stack from changing the rest of the site.

The current V3 day and night theme is applied by
`../docs/assets/amditis-v3.css`, loaded after `tailwind.css`. Use its tokens for
new theme styles; see the [root theme guide](../../CLAUDE.md#amditis-v3-theme-system).

This build intentionally remains on the latest Tailwind 3 release. Tailwind 4
changes configuration and migration behavior; upgrading it should be a separate
tested change rather than an automatic dependency bump against the current
JavaScript config and legacy HTML surfaces.

## Migration status

Every active resource-kit page now uses the precompiled stylesheet. The
AI-showcase card variants built through string interpolation are listed in the
config safelist, and `npm test` checks those selectors in the generated CSS.
The no-index historical snapshot under `llm-advisor/archive/` retains its frozen
runtime build as an archival record.
