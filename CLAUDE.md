# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Bug-fixing workflow

When a bug is reported, don't immediately attempt to fix it. Instead:

1. **Write a failing test first** that reproduces the bug
2. **Launch subagents** to work on fixing the bug
3. **Verify the fix** by running the test — a passing test proves the bug is fixed

---

## Repository overview

This repository (`tools`) contains the **Amditis Resource Kit** - a collection of AI tools and templates for journalists. Deployed via Cloudflare Pages at https://tools-pages.pages.dev/resource-kit/docs/

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

**After changes:** Run `bash deploy.sh` to deploy via Cloudflare Pages (direct upload, personal account). Handles files >25MB by staging with rsync.

**Pages URL:** https://tools-pages.pages.dev

## LLM Advisor architecture

The LLM Advisor (`resource-kit/docs/llm-advisor/`) uses:
- Vanilla JS with JSON data files (no build step)
- Event delegation pattern for click handling
- Modal system for comparisons, case studies, model info

**Key gotcha:** The sidebar and modal are OUTSIDE the main container (`#llm-tool-advisor-container`). Event listeners for elements in those areas must be attached separately, not via the container's delegated listener.

## Model naming conventions

Use these current names in all content:
- **Claude Opus 4.6** - best for coding and writing
- **Claude Sonnet 4.6** - fast chat model
- **Gemini 3.1 Pro** - best for front-end design and large documents
- **Gemini 3.1 Flash** - fast Gemini chat model
- **Codex (GPT 5.2)** - OpenAI's coding model
- **GPT 5.2** - OpenAI's reasoning model

Never use outdated names like "Claude 4 Opus", "GPT-4o", or "Gemini 2.x"

## Template categories

Both LESSONS and CLAUDE-RULES templates are available for:

**Software development:** general, desktop-app, browser-extension, web-app, data-pipeline, mobile-app

**Journalism/publishing:** digital-archive, event-website, content-pipeline, editorial-tool, research-project, publication

## Things to avoid

- Using dark theme patterns (crt-overlay, glitch-text, clip-notch) - use V2 light patterns instead
- Attaching event listeners only to the main container (check if elements are outside it)
- Deploying without running `bash deploy.sh`
- Using Jekyll features (site uses static deployment, not Jekyll)
