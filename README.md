# Amditis Resource Kit

A collection of AI tools, templates, and guides for journalists and developers. Hosted on GitHub Pages at **https://jamditis.github.io/tools/**

## Resource Kit Website

Interactive tools and guides built with the Amditis dark theme.

### Tools & Guides

| Page | Description |
|------|-------------|
| [LLM Advisor](https://jamditis.github.io/tools/llm-advisor/) | Decision tree tool for selecting the right AI model for your task |
| [Vibe Coding Guide](https://jamditis.github.io/tools/vibe-coding/) | Multi-page tutorial on AI-assisted development |
| [Terminal Setup Guide](https://jamditis.github.io/tools/terminal-setup/) | Step-by-step instructions for configuring AI CLI tools |
| [Low-Cost Tool Stacks](https://jamditis.github.io/tools/tool-stacks/) | Development resources and affordable tool recommendations |
| [Quick Reference Card](https://jamditis.github.io/tools/quick-reference-card.html) | Printable cheat sheet for common AI prompts |
| [Glossary](https://jamditis.github.io/tools/glossary.html) | AI and development terminology |
| [Language Guide](https://jamditis.github.io/tools/language-guide.html) | How to write effective prompts |

### Vibe Coding Guide Sections

The Vibe Coding Guide is a comprehensive multi-page resource:

- **Essentials** - Core concepts for AI-assisted development
- **Level Up** - Advanced techniques and patterns
- **Common Mistakes** - Pitfalls to avoid
- **Cheat Sheet** - Quick reference for common tasks
- **Glossary** - Key terms and definitions

### Downloadable Templates

Available in `resource-kit/docs/downloads/`:

- CLAUDE-RULES templates (14 project types)
- LESSONS-TEMPLATE.md
- CLAUDE-CODE-QUICKREF.md
- VIBE-CODING-CHECKLIST.md
- LLM-COMPARISON.md
- CHANGELOG-TEMPLATE.md

---

## LESSONS.md Templates

Templates for documenting project learnings, designed to carry forward wisdom without context bleed.

### Software Development

| Template | Use For |
|----------|---------|
| `LESSONS-general.md` | Any project type (start here if unsure) |
| `LESSONS-desktop-app.md` | Electron, Tauri, native desktop apps |
| `LESSONS-browser-extension.md` | Chrome/Firefox/Edge extensions |
| `LESSONS-web-app.md` | React, Vue, static sites, SPAs |
| `LESSONS-data-pipeline.md` | Python scripts, ETL, scrapers, data processing |
| `LESSONS-mobile-app.md` | React Native, Capacitor, Flutter, native mobile |

### Journalism & Publishing

| Template | Use For |
|----------|---------|
| `LESSONS-digital-archive.md` | Digital preservation, historical archives, collections |
| `LESSONS-event-website.md` | Conferences, summits, events with registration |
| `LESSONS-content-pipeline.md` | CMS workflows, publishing automation, syndication |
| `LESSONS-editorial-tool.md` | Newsroom tools, reporter/editor software |
| `LESSONS-research-project.md` | Investigations, data journalism, analysis projects |
| `LESSONS-publication.md` | Newsletters, blogs, ongoing content series |

---

## CLAUDE-RULES Templates

Project memory files for Claude Code, providing context and guidelines for AI assistance.

### Software Development

| Template | Use For |
|----------|---------|
| `CLAUDE-RULES-general.md` | Any project type |
| `CLAUDE-RULES-desktop-app.md` | Electron, Tauri, native apps |
| `CLAUDE-RULES-browser-extension.md` | Browser extensions |
| `CLAUDE-RULES-web-app.md` | Web applications |
| `CLAUDE-RULES-data-pipeline.md` | Data processing, ETL |
| `CLAUDE-RULES-mobile-app.md` | Mobile applications |

### Journalism & Publishing

| Template | Use For |
|----------|---------|
| `CLAUDE-RULES-digital-archive.md` | Digital archives |
| `CLAUDE-RULES-event-website.md` | Event websites |
| `CLAUDE-RULES-content-pipeline.md` | Content automation |
| `CLAUDE-RULES-editorial-tool.md` | Editorial tools |
| `CLAUDE-RULES-research-project.md` | Research projects |
| `CLAUDE-RULES-publication.md` | Publications |

---

## Anime.js Documentation

Comprehensive documentation for the Anime.js animation library (v4):

| File | Content |
|------|---------|
| `ANIMEJS-COMPLETE-DOCUMENTATION.md` | Full reference guide |
| `animejs-documentation.md` | Core API documentation |
| `animejs-timeline-documentation.md` | Timeline and sequencing |
| `animejs-stagger-documentation.md` | Stagger effects |
| `animejs-draggable-documentation.md` | Draggable elements |
| `animejs-scrollobserver-documentation.md` | Scroll-based animations |
| `animejs-waapi-documentation.md` | Web Animations API integration |

---

## Project Structure

```
tools/
├── resource-kit/
│   └── docs/                    # GitHub Pages (served from here)
│       ├── index.html           # Main landing page
│       ├── llm-advisor/         # LLM tool selector app
│       ├── vibe-coding/         # Vibe coding guide (5 pages)
│       ├── terminal-setup/      # Terminal configuration guide
│       ├── tool-stacks/         # Low-cost development tools
│       ├── downloads/           # Downloadable templates
│       └── assets/              # Shared CSS, JS, images
├── LESSONS-*.md                 # Project retrospective templates
├── CLAUDE-RULES-*.md            # Claude Code memory templates
├── animejs-*.md                 # Animation library documentation
├── mcp-servers/                 # MCP server configurations
├── scripts/                     # Utility scripts
└── .github/workflows/           # GitHub Actions (auto-deploy)
```

---

## How to Use

### Using Templates

```bash
# Copy a template to your project
cp LESSONS-web-app.md /path/to/project/LESSONS.md
cp CLAUDE-RULES-web-app.md /path/to/project/CLAUDE.md
```

Or ask Claude Code:
> "Create a LESSONS.md for this project using the web-app template"

### Local Development

```bash
cd resource-kit/docs
python -m http.server 8000
# Open http://localhost:8000
```

### Deployment

Push to master - GitHub Actions automatically deploys to Pages.

```bash
# Check deployment status
gh run list --limit 3
```

---

## Template Philosophy

### Focus on "The Real Problem"
Every template has a section for this. What did users actually need vs what you built? This insight transfers to future projects.

### Keep vs Start Fresh
Templates separate recommendations for continuing vs starting over. Both are valid paths.

### Artifacts Worth Keeping
Code dies, but patterns live. Identify files/components that could be extracted and reused.

---

## Choosing a Template

**Building software?**
- Desktop app → `desktop-app`
- Browser extension → `browser-extension`
- Website/web app → `web-app`
- Scripts/automation → `data-pipeline`
- Mobile app → `mobile-app`

**Journalism/publishing project?**
- Preserving content → `digital-archive`
- Conference/event site → `event-website`
- Content automation → `content-pipeline`
- Newsroom tool → `editorial-tool`
- Investigation/analysis → `research-project`
- Newsletter/blog → `publication`

**Not sure?** Start with `general` and adapt.

---

## License

MIT
