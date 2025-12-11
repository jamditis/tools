# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository overview

This repository (`tools`) contains the **Amditis Resource Kit** - a collection of AI tools and templates for journalists. It's hosted on GitHub Pages at https://jamditis.github.io/tools/

### Main components

1. **Resource kit website** (`resource-kit/docs/`) - Interactive tools with Amditis dark theme
   - LLM Advisor - decision tree tool for selecting AI tools
   - Vibe coding guide - interactive glossary and tutorials
   - Quick reference cards and downloadable templates

2. **LESSONS templates** - Templates for documenting project learnings
3. **CLAUDE-RULES templates** - Templates for Claude Code project memory files

## Project structure

```
templates/                    # Git root
├── .github/workflows/        # GitHub Actions (deploys to Pages)
│   └── static.yml
├── resource-kit/
│   └── docs/                 # ← GitHub Pages serves from here
│       ├── index.html        # Main landing page
│       ├── assets/           # Shared CSS, JS, images
│       │   ├── amditis-main.css
│       │   ├── amditis-config.js
│       │   └── favicon.svg
│       ├── llm-advisor/      # LLM tool selector app
│       │   ├── index.html
│       │   ├── app.js
│       │   └── data/         # JSON data files
│       ├── vibe-coding/      # Vibe coding guide
│       └── downloads/        # Downloadable templates
├── LESSONS-*.md              # Project retrospective templates
└── CLAUDE-RULES-*.md         # Claude Code memory templates
```

## Amditis theme system

The site uses a custom dark theme called "Amditis" with these key classes:

**Backgrounds:**
- `bg-void` - deepest black (#050505)
- `bg-panel` - card/panel background (#0a0a0a)
- `bg-surface` - interactive surface (#111111)

**Text:**
- `text-chrome` - primary text (#e8e8e8)
- `text-gray-400/500/600` - secondary text levels

**Accents:**
- `text-acid` / `bg-acid` - primary green accent (#c8ff00)
- `text-ice` / `bg-ice` - blue accent (#00f0ff)
- `text-signal` / `bg-signal` - red/warning (#ff3366)

**Borders:** Always use `border-white/10` or `border-white/5`

**Important:** Never use light theme classes like `bg-light-*` or `dark:bg-dark-*` - this is a single dark theme.

## Development workflow

**Local development:**
```bash
cd resource-kit/docs
python -m http.server 8000
# Open http://localhost:8000
```

**After changes:** Commit and push to master - GitHub Actions auto-deploys to Pages.

**Check deployment status:**
```bash
gh run list --limit 3
```

## LLM Advisor architecture

The LLM Advisor (`resource-kit/docs/llm-advisor/`) uses:
- Vanilla JS with JSON data files (no build step)
- Event delegation pattern for click handling
- Modal system for comparisons, case studies, model info

**Key gotcha:** The sidebar and modal are OUTSIDE the main container (`#llm-tool-advisor-container`). Event listeners for elements in those areas must be attached separately, not via the container's delegated listener.

## Model naming conventions

Use these current names in all content:
- **Claude 4.5 Opus** - best for coding and writing
- **Claude 4.5 Sonnet** - fast chat model
- **Gemini 3.0 Pro** - best for front-end design and large documents
- **Gemini 3.0 Flash** - fast Gemini chat model
- **Codex (GPT 5.1)** - OpenAI's coding model
- **GPT 5.1** - OpenAI's reasoning model

Never use outdated names like "Claude 4 Opus", "GPT-4o", or "Gemini 2.x"

## Template categories

Both LESSONS and CLAUDE-RULES templates are available for:

**Software development:** general, desktop-app, browser-extension, web-app, data-pipeline, mobile-app

**Journalism/publishing:** digital-archive, event-website, content-pipeline, editorial-tool, research-project, publication

## Things to avoid

- Using old theme class names (`bg-light-*`, `dark:bg-dark-*`, `bg-accent-*`)
- Attaching event listeners only to the main container (check if elements are outside it)
- Deploying without checking GitHub Actions build status
- Using Jekyll features (site uses static deployment, not Jekyll)
