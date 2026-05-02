# Copilot review instructions — tools

Project context, architecture, and conventions live in [CLAUDE.md](../CLAUDE.md). Both this file and CLAUDE.md are read by Copilot code review (cap ~4,000 chars each). This file lists the rules worth named attention on every PR.

## Global rules to flag

These are Joe's user-level conventions. They live in `~/.claude/CLAUDE.md`, which Copilot's PR review bot does *not* read — so they're restated here so the bot enforces them on this repo's PRs.

- **Sentence case** in headings, UI text, and identifiers. Title Case is a regression.
- **No emojis** in source code, log messages, comments, commits, PR bodies, or any output. Plain text only.
- **No AI attribution.** Never include "Generated with Claude Code", `Co-Authored-By: Claude` trailers, or any AI/model/company attribution in PRs, commits, code, or any committed file.
- **Banned words** (delete or replace): *comprehensive, sophisticated, robust, transformative, leveraging, seamlessly, innovative, cutting-edge, state-of-the-art, holistic, synergy, ecosystem, paradigm, empower*.
- **Filler phrases** (delete or rewrite): *it's worth noting, in order to (use "to"), at the end of the day, moving forward*.
- **Every HTML page must have an SVG favicon and full OG/Twitter meta tags.** Required tags: `og:title`, `og:description`, `og:type`, `og:url`, `og:image` (1200x630), `og:image:width`, `og:image:height`, `twitter:card` (`summary_large_image`), `twitter:title`, `twitter:description`, `twitter:image`.

## Project-specific bug classes to flag

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
