# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Bug-fixing workflow

When a bug is reported, don't immediately attempt to fix it. Instead:

1. **Write a failing test first** that reproduces the bug
2. **Launch subagents** to work on fixing the bug
3. **Verify the fix** by running the test — a passing test proves the bug is fixed

---

## Repository overview

This repository (`tools`) contains the **Amditis Resource Kit** - a collection of AI tools and templates for journalists. Deployed via GitHub Pages at https://tools.amditis.tech/

### Main components

1. **Resource kit website** (`resource-kit/docs/`) - Interactive tools with Amditis V2 light editorial theme
   - LLM Advisor - decision tree tool for selecting AI tools
   - Vibe coding guide - interactive glossary and tutorials
   - Quick reference cards and downloadable templates

2. **LESSONS templates** - Templates for documenting project learnings
3. **CLAUDE-RULES templates** - Templates for Claude Code project memory files
4. **Skills** (`skills/`) - Claude Code skills for development workflows
   - `test-first-bugs` - Test-driven bug fixing workflow
   - `pdf-design` - PDF reports/proposals with interactive editing, brand system
5. **Hooks** (`hooks/`) - Automated workflow checks
   - `bug-report-detector` - Detects bug reports
   - `enforce-test-first` - Enforces test-first workflow

## Project structure

```
tools/                        # Git root
├── .github/workflows/        # GitHub Pages deploy
│   └── static.yml
├── deploy.sh                 # Cloudflare Pages deploy script
├── resource-kit/
│   └── docs/                 # ← GitHub Pages serves from here
│       ├── index.html        # Main landing page
│       ├── assets/           # Shared CSS, JS, images
│       ├── llm-advisor/      # LLM tool selector app
│       ├── vibe-coding/      # Vibe coding guide
│       └── downloads/        # Downloadable templates
├── skills/                   # Claude Code skills
│   ├── test-first-bugs/      # Test-driven bug fixing
│   └── pdf-design/           # PDF reports/proposals design system
├── hooks/                    # Automated workflow checks
│   ├── bug-report-detector.md
│   └── enforce-test-first.md
├── LESSONS-*.md              # Project retrospective templates
└── CLAUDE-RULES-*.md         # Claude Code memory templates
```

## Amditis V2 theme system

The site uses a light editorial/archival theme called "Amditis V2" with these key classes:

**Backgrounds:**
- `bg-canvas` - cream page background (#ede6d4)
- `deckle-card` - frosted glass card (rgba(255,255,255,0.3))
- `deckle-card-solid` - solid white card (rgba(255,255,255,0.6))

**Text:**
- `text-ink` - primary dark text (#121212)
- `text-mist` - secondary/tertiary text (#6b6b6b)

**Accents:**
- `text-accent` / `bg-accent` - muted green accent (#3d4b40)
- `text-clay` / `bg-clay` - neutral warm accent (#d6cdb7)

**Borders:** Always use `border-ink/10` or `border-ink/5`

**Effects:**
- `paper-overlay` - subtle paper texture overlay
- `reveal-section` - scroll-triggered fade-in animation
- `animate-drift` - slow ambient light movement

**Typography:**
- `font-display` - Fraunces serif for headings
- `font-sans` - Plus Jakarta Sans for body text

**Legacy compatibility:** Old V1 classes (bg-void, text-chrome, text-acid, etc.) are automatically mapped to V2 equivalents in amditis-main.css.

## Development workflow

**Local development:**
```bash
cd resource-kit/docs
python -m http.server 8000
# Open http://localhost:8000
```

**After changes:** Push to `master` — GitHub Actions workflow (`.github/workflows/static.yml`) deploys `resource-kit/docs/` automatically.

**Live URL:** https://tools.amditis.tech
**DNS:** Cloudflare CNAME `tools.amditis.tech` → `jamditis.github.io` (proxied, orange cloud)
**Deploy:** GitHub Actions (`static.yml`) uploads `resource-kit/docs/` as a Pages artifact on push to master
**Fallback:** `bash deploy.sh` deploys to Cloudflare Pages (`tools-pages.pages.dev`) — only use if GitHub Pages is down

## Custom-domain HTTPS (Cloudflare-fronted)

`tools.amditis.tech` is a GitHub Pages site fronted by Cloudflare's proxy (orange cloud). HTTPS is served by Cloudflare's edge cert, not by GitHub's own Let's Encrypt cert: `dig tools.amditis.tech` returns Cloudflare IPs (`104.21.x` / `172.67.x`), not Pages' `185.199.108.x`, and responses carry `server: cloudflare`.

Because of that, `gh api repos/jamditis/tools/pages` shows GitHub's own cert as un-provisioned. It read `bad_authz` historically and reads `null` now (GitHub stopped retrying and dropped the tracking record). GitHub's HTTP-01 ACME challenge expects `http://tools.amditis.tech/.well-known/acme-challenge/<token>` to reach Pages directly, but it lands on Cloudflare's edge, so issuance can never complete. This is cosmetic: HTTPS, the HTTP→HTTPS redirect, and Cloudflare's caching and DDoS protection all work. The old `expires_at: 2026-04-15` passed with no user-visible breakage, confirming GitHub's cert was never serving traffic.

Leave it as-is for a docs site. To restore a GitHub-issued cert if a clean GitHub status is ever wanted:

1. Gray-cloud the DNS record in Cloudflare (DNS only, no proxy) so GitHub's HTTP-01 ACME challenge reaches Pages directly instead of Cloudflare's edge.
2. In repo Settings > Pages, remove the custom domain, save, then re-enter `tools.amditis.tech` and save. This step is required, not optional: GitHub only starts cert provisioning when the custom domain is set or changed, and it already dropped the tracking record (`https_certificate: null`), so gray-clouding alone never restarts a job. Re-adding the domain is what re-fires ACME.
3. Wait about 10 minutes, then confirm issuance with `gh api repos/jamditis/tools/pages --jq .https_certificate.state` (it should move off `null` to `approved`).
4. Re-enable the Cloudflare proxy (orange cloud) to get the edge caching and DDoS protection back. Leave the zone's SSL mode on "Full" — do not set "Full (strict)". See below.

### Do not switch the zone to Full (strict)

The `amditis.tech` zone runs SSL mode `Full`, which encrypts the Cloudflare-to-origin leg without checking that the origin cert matches the hostname. That last part is what makes it work here, so `Full (strict)` is not a drop-in upgrade:

- Connecting to a Pages IP with SNI `tools.amditis.tech` returns a cert for `CN=*.github.io`, carrying SANs for `*.github.com`, `*.github.io`, `*.githubusercontent.com` and those three apexes. None of them cover `tools.amditis.tech`, so strict rejects the name and every visitor gets HTTP 526 instead of the site. Let openssl make that call rather than eyeballing the subject — a SAN can cover a hostname the CN does not, and `s_client` skips hostname verification unless asked for it:

  ```bash
  openssl s_client -connect 185.199.108.153:443 -servername tools.amditis.tech \
    -verify_hostname tools.amditis.tech </dev/null 2>/dev/null | grep "Verify return code"
  ```

  Today that prints `62 (hostname mismatch)`, which is the 526 in advance. `0 (ok)` means strict would pass for this hostname. To confirm the command itself discriminates, run it with `jamditis.github.io` in both places — that prints `0 (ok)`.

- The mode is a zone setting rather than a per-hostname one, so it is not tools' alone to change. Of the zone's 33 proxied records, 26 are cloudflared tunnel CNAMEs that pull no third-party origin. Of the remaining 7: `tools`, `system`, and `mooc` all CNAME to `jamditis.github.io` and share the mismatch above, so they break together; `ccm` (Firebase) and `codiac` (Cloudflare Pages) point at third-party origins and each need the same check; `codex` and `upload.social` are `AAAA` records on the `100::` discard prefix, so they have no origin to validate and strict does not affect them.

Because the switch is zone-wide, strict only becomes safe once *every* proxied hostname with a third-party origin passes that check — not just this one. `tools`, `system`, and `mooc` fail it identically today, so each needs a real GitHub cert per step 3 above; `ccm` and `codiac` need the same verification against their own origins. Provisioning `tools` alone and flipping the switch would leave `system` and `mooc` serving 526. Until all five pass, `Full` is the correct setting.

Background: issue #61.

## LLM Advisor architecture

The LLM Advisor (`resource-kit/docs/llm-advisor/`) uses:
- Vanilla JS with JSON data files (no build step)
- Event delegation pattern for click handling
- Modal system for comparisons, case studies, model info

**Key gotcha:** The sidebar and modal are OUTSIDE the main container (`#llm-tool-advisor-container`). Event listeners for elements in those areas must be attached separately, not via the container's delegated listener.

## Model naming conventions

Use these current names in all content:
- **Claude Opus 4.8** - best for coding and writing
- **Claude Sonnet 4.6** - fast chat model
- **Gemini 3.1 Pro** - best for front-end design and large documents
- **Gemini 3.1 Flash** - fast Gemini chat model
- **Codex (GPT 5.5)** - OpenAI's coding model
- **GPT 5.5** - OpenAI's reasoning model

Never use outdated names like "Claude 4 Opus", "GPT-4o", or "Gemini 2.x"

## Template categories

Both LESSONS and CLAUDE-RULES templates are available for:

**Software development:** general, desktop-app, browser-extension, web-app, data-pipeline, mobile-app

**Journalism/publishing:** digital-archive, event-website, content-pipeline, editorial-tool, research-project, publication

## Glossary pages

Two interactive glossaries under `resource-kit/docs/vibe-coding/`:

| Glossary | Index | Term page | Data |
|----------|-------|-----------|------|
| Frontend | `glossary-frontend/index.html` | `glossary-frontend/term.html` | `glossary-frontend/data.js` (~300KB) |
| Database | `glossary-database/index.html` | `glossary-database/term.html` | `glossary-database/data.js` |

**Architecture:** Zero-build, Tailwind CDN + Lucide icons. `data.js` exports `TERMS` array and `GLOSSARY_META` object. Index pages build card grids dynamically; term pages render a single term from the `?t=` query param.

**Init pattern:** All glossary inline scripts are wrapped in `DOMContentLoaded` so they work regardless of whether the Lucide script tag has `defer`. A `body.loading` class suppresses CSS transitions during init to prevent layout shift, removed via `requestAnimationFrame` after `lucide.createIcons()`.

**Beginner mode (term pages only):** Toggle in the header. Persists via localStorage key `glossary-beginner-mode`. When active:
- Analogy section moves to top (most beginner-friendly content)
- Examples and trade-offs sections are hidden (too technical)
- Banner appears: "Simplified view — technical details hidden"
- Analogy card gets larger padding and font size

**SVG thumbnails in data.js:** Some terms have inline SVG illustrations with `<style>` tags. SVG styles are NOT scoped — they leak into the entire document. Never use generic class names (like `block`, `container`, `item`) in SVG styles. Use prefixed names like `svg-block`, `svg-shift`.

**Filtering:** Category tabs toggle `.term-hidden` class on cards. The `.term-hidden` rule uses `!important` because Tailwind CDN injects `.block { display: block }` later in the cascade and would otherwise override `display: none`.

## Copilot review instructions (`.github/copilot-instructions.md`)

GitHub Copilot's PR review bot reads two files per repo — `.github/copilot-instructions.md` and the repo's `CLAUDE.md` — each with a roughly 4,000-character cap. Content past the cap is silently truncated, so an oversized file loses its tail with no warning.

The bot is a bug finder, not a style linter. It flags code defects, not English-prose conventions, so a copilot-instructions file should carry only rules the bot can act on and nothing it will ignore.

Keep (bot-enforceable):

- AI-authorship attribution bans in commits, PR bodies, and committed docs.
- favicon `<link>` plus full OG/Twitter meta tags on new public-facing HTML pages.
- code-pattern bug classes specific to the repo (no `innerHTML`, version-string-on-import, build-step bans, and the like).

Drop (not bot-enforceable — enforce elsewhere):

- sentence case, banned words, and other prose-style globals. These belong to `~/.claude/CLAUDE.md` (Claude's own behavior), to CI or pre-commit hooks for the hard cases (banned words, emoji-in-code), and to `stop-and-check.py` for editorial copy — not to the review bot.

Restating roughly 1,700 characters of prose-style globals in every repo was the original cause of three files reaching the 4k cap (`rosen-frontend`, `class`, `houseofjawn-bot`); all three are migrated and well under cap.

Template (two sections):

1. `## Global rules to flag` — the narrow, bot-enforceable user-level rules above, with a one-line note that they are restated from `~/.claude/CLAUDE.md` because the bot does not read user-level files.
2. `## Project-specific bug classes to flag` — a numbered list of this repo's own defect patterns, where the file earns its keep.

See `rosen-frontend/.github/copilot-instructions.md` for the reference layout. Keep each file well under 4,000 characters; if a repo's project bug classes grow, that budget is for them, not for re-restated globals.

`scripts/check-copilot-instructions.sh` enforces the cap so the sweep is not manual: it prints each repo's `.github/copilot-instructions.md` size, warns near the cap, exits non-zero on any file over it, and advises where a file still restates prose-style globals the bot ignores. Run it with no arguments to scan every repo under `~/projects`, or pass repo roots for a specific set (passing explicit roots also avoids counting incidental worktree clones, which carry their own copy of the file). `scripts/check-copilot-instructions.test.sh` covers it.

Background: `tools` issue #59, and `MEMORY.md` → `reference_copilot_pr_review_reading_scope.md` for the underlying constraint.

## Things to avoid

- Using dark theme patterns (crt-overlay, glitch-text, clip-notch) - use V2 light patterns instead
- Attaching event listeners only to the main container (check if elements are outside it)
- Deploying without pushing to master (GitHub Actions handles it)
- Using Jekyll features (site uses static deployment, not Jekyll)
- **`transition: all`** on any element — scope to specific properties (`transform`, `box-shadow`, `border-color`, etc.). `all` catches layout changes from DOM mutations (Lucide icon injection, Tailwind CDN processing) and animates them visibly
- **Generic class names in SVG `<style>` tags** — SVG styles leak into the document. A `.block` rule inside an SVG will apply to every Tailwind `block` element on the page
- **Inline scripts that depend on `defer`'d libraries** — wrap in `DOMContentLoaded` instead of assuming load order. Guard `lucide.createIcons()` with try/catch
