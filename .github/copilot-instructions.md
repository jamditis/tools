# Copilot review instructions — tools

Project context, architecture, and conventions live in [CLAUDE.md](../CLAUDE.md). Both this file and CLAUDE.md are read by Copilot code review (cap ~4,000 chars each). This file lists the rules worth named attention on every PR.

User-level globals (sentence case, no emojis, banned words, no AI-authorship attribution, code-quality basics) live in [`.github/instructions/globals.instructions.md`](instructions/globals.instructions.md), generated from `~/.claude/copilot-globals.md` by `scripts/sync-copilot-globals.py`. Don't restate them here.

## Project-specific bug classes to flag

- **Every deployed HTML page** under `resource-kit/docs/**/*.html` (the GitHub Pages source) must include the favicon link tag `<link rel="icon" type="image/svg+xml" href="...">` (relative path from each subdirectory) and full OG/Twitter meta tags: `og:title`, `og:description`, `og:type`, `og:url`, `og:image` (1200x630), `og:image:width=1200`, `og:image:height=630`, `twitter:card=summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`. Files outside `resource-kit/docs/` (including `_archive/**`) are not deployed and exempt.

- **No hardcoded API keys or secrets.** Static-site repo, no server. Any inline key in HTML/JS is a leak.
- **Event listeners attached to the wrong scope.** The sidebar and modal in the LLM Advisor live OUTSIDE `#llm-tool-advisor-container`. Listeners attached only to the main container miss those elements.
- **Generic class names inside SVG `<style>` tags.** SVG styles are not scoped and leak into the whole document. A `.block` rule inside an inline SVG applies to every Tailwind `block` element on the page. Require prefixed names (`svg-block`, `svg-shift`).
- **`transition: all`** on any element. Scope to specific properties (`transform`, `box-shadow`, `border-color`). `all` animates layout changes triggered by Lucide icon injection and Tailwind CDN processing.
- **Inline scripts that assume `defer`'d library load order.** Wrap in `DOMContentLoaded` and guard `lucide.createIcons()` with try/catch.
- **No build step.** Flag any PR that adds npm, a bundler, Jekyll features, or a transpiler. JS must stay vanilla ES5-compatible.
- **Outdated AI model names.** Current names: Claude Opus 4.6, Claude Sonnet 4.6, Gemini 3.1 Pro, Gemini 3.1 Flash, Codex (GPT 5.2), GPT 5.2. Flag "Claude 4 Opus", "GPT-4o", "Gemini 2.x", and similar.
- **Theme drift.** The site uses the Amditis V2 light editorial theme. Flag dark-theme patterns (`crt-overlay`, `glitch-text`, `clip-notch`) and colors outside the V2 palette (canvas `#ede6d4`, ink `#121212`, accent `#3d4b40`, clay `#d6cdb7`).
- **External links missing `rel="noopener noreferrer"`** when paired with `target="_blank"`.
- **Inline event handlers** (`onclick`, `onload`). Use `addEventListener` instead.
