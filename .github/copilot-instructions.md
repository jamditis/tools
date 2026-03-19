# Copilot review instructions

## Project

Amditis Resource Kit — static site at tools.amditis.tech. Zero-build HTML/JS/CSS using Tailwind CDN, Lucide icons, Google Fonts. Deployed via GitHub Pages from `resource-kit/docs/`.

## Style rules

- Always use sentence case. Never Title Case.
- No emojis in source code, log messages, or UI text.
- Flag these banned words: "comprehensive", "robust", "leveraging", "seamlessly", "innovative", "cutting-edge", "holistic", "synergy", "ecosystem", "paradigm", "empower", "transformative", "sophisticated", "state-of-the-art".
- Flag filler phrases: "it's worth noting", "in order to" (use "to"), "at the end of the day", "moving forward".
- Never include AI attribution ("Generated with Claude Code", etc.) in PRs, commits, code, or docs.

## Theme system (Amditis V2)

The site uses a light editorial theme. Flag if a PR introduces:
- Dark theme patterns (crt-overlay, glitch-text, clip-notch)
- Colors outside the V2 palette (canvas #ede6d4, ink #121212, accent #3d4b40, clay #d6cdb7)
- Missing `font-display` (Fraunces) for headings or `font-sans` (Plus Jakarta Sans) for body

## Security

- Every HTML page must have `<link rel="icon" type="image/svg+xml" href="...">`.
- Every HTML page must have full OG/Twitter meta tags.
- External links should use `rel="noopener noreferrer"` with `target="_blank"`.
- No inline event handlers (onclick, onload) — use addEventListener.

## Patterns

- No build step. No npm/bundler additions.
- All JS should be vanilla ES5-compatible (the site uses no transpiler).
- Event listeners for sidebar/modal elements must be attached outside the main container (they live outside `#llm-tool-advisor-container`).
- Shared assets go in `resource-kit/docs/assets/`.

## Model names

Flag outdated AI model names. Current names: Claude Opus 4.6, Claude Sonnet 4.6, Gemini 3.1 Pro, Gemini 3.1 Flash, Codex (GPT 5.2), GPT 5.2.
