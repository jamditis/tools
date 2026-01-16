# AI resources + toolkit

A collection of AI tools, templates, and guides for journalists and developers. Created by **Joe Amditis** and hosted at **https://tools.amditis.tech/**

## Resource kit website

Interactive tools and guides built with love and frustration by Joe Amditis.

### Tools & guides

| Page | Description |
|------|-------------|
| [LLM Advisor](https://tools.amditis.tech/llm-advisor/) | Decision tree tool for selecting the right AI model for your task |
| [Vibe coding guide](https://tools.amditis.tech/vibe-coding/) | Multi-page tutorial on AI-assisted development |
| [Terminal setup guide](https://tools.amditis.tech/terminal-setup/) | Step-by-step instructions for configuring AI CLI tools |
| [Tool stacks](https://tools.amditis.tech/tool-stacks/) | IDEs, AI app builders, databases, deployment, and 14 tool categories |
| [Quick reference card](https://tools.amditis.tech/quick-reference-card/) | Printable cheat sheet for common AI prompts |
| [Glossary](https://tools.amditis.tech/glossary/) | AI and development terminology |
| [Language guide](https://tools.amditis.tech/language-guide/) | How to write effective prompts |
| [About](https://tools.amditis.tech/about/) | About the project and author |

### Vibe coding guide sections

The vibe coding guide is a comprehensive multi-page resource:

- **Essentials** - Core concepts for AI-assisted development
- **Level up** - Advanced techniques and patterns
- **Common mistakes** - Pitfalls to avoid
- **Cheat sheet** - Quick reference for common tasks
- **Glossary** - Key terms and definitions

### Downloadable templates

Available in `resource-kit/docs/downloads/`:

- CLAUDE-RULES templates (14 project types)
- LESSONS-TEMPLATE.md
- CLAUDE-CODE-QUICKREF.md
- VIBE-CODING-CHECKLIST.md
- LLM-COMPARISON.md
- CHANGELOG-TEMPLATE.md

---

## LESSONS.md templates

Templates for documenting project learnings, designed to carry forward wisdom without context bleed.

### Software development

| Template | Use for |
|----------|---------|
| `LESSONS-general.md` | Any project type (start here if unsure) |
| `LESSONS-desktop-app.md` | Electron, Tauri, native desktop apps |
| `LESSONS-browser-extension.md` | Chrome/Firefox/Edge extensions |
| `LESSONS-web-app.md` | React, Vue, static sites, SPAs |
| `LESSONS-data-pipeline.md` | Python scripts, ETL, scrapers, data processing |
| `LESSONS-mobile-app.md` | React Native, Capacitor, Flutter, native mobile |

### Journalism & publishing

| Template | Use for |
|----------|---------|
| `LESSONS-digital-archive.md` | Digital preservation, historical archives, collections |
| `LESSONS-event-website.md` | Conferences, summits, events with registration |
| `LESSONS-content-pipeline.md` | CMS workflows, publishing automation, syndication |
| `LESSONS-editorial-tool.md` | Newsroom tools, reporter/editor software |
| `LESSONS-research-project.md` | Investigations, data journalism, analysis projects |
| `LESSONS-publication.md` | Newsletters, blogs, ongoing content series |

---

## CLAUDE-RULES templates

Project memory files for Claude Code, providing context and guidelines for AI assistance.

### Software development

| Template | Use for |
|----------|---------|
| `CLAUDE-RULES-general.md` | Any project type |
| `CLAUDE-RULES-desktop-app.md` | Electron, Tauri, native apps |
| `CLAUDE-RULES-browser-extension.md` | Browser extensions |
| `CLAUDE-RULES-web-app.md` | Web applications |
| `CLAUDE-RULES-data-pipeline.md` | Data processing, ETL |
| `CLAUDE-RULES-mobile-app.md` | Mobile applications |

### Journalism & publishing

| Template | Use for |
|----------|---------|
| `CLAUDE-RULES-digital-archive.md` | Digital archives |
| `CLAUDE-RULES-event-website.md` | Event websites |
| `CLAUDE-RULES-content-pipeline.md` | Content automation |
| `CLAUDE-RULES-editorial-tool.md` | Editorial tools |
| `CLAUDE-RULES-research-project.md` | Research projects |
| `CLAUDE-RULES-publication.md` | Publications |

---

## Anime.js documentation

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

## Project structure

```
tools/
├── resource-kit/
│   └── docs/                    # GitHub Pages (served from here)
│       ├── index.html           # Main landing page
│       ├── about/               # About page
│       ├── glossary/            # AI terminology glossary
│       ├── language-guide/      # Prompt writing guide
│       ├── llm-advisor/         # LLM tool selector app
│       ├── llm-advisor-doc/     # Static LLM documentation
│       ├── quick-reference-card/ # Printable cheat sheet
│       ├── terminal-setup/      # Terminal configuration guide
│       ├── tool-stacks/         # Development tools (14 categories)
│       ├── vibe-coding/         # Vibe coding guide (5 pages)
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

## How to use

### Using templates

```bash
# Copy a template to your project
cp LESSONS-web-app.md /path/to/project/LESSONS.md
cp CLAUDE-RULES-web-app.md /path/to/project/CLAUDE.md
```

Or ask Claude Code:
> "Create a LESSONS.md for this project using the web-app template"

### Local development

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

## Template philosophy

### Focus on "the real problem"
Every template has a section for this. What did users actually need vs what you built? This insight transfers to future projects.

### Keep vs start fresh
Templates separate recommendations for continuing vs starting over. Both are valid paths.

### Artifacts worth keeping
Code dies, but patterns live. Identify files/components that could be extracted and reused.

---

## Choosing a template

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
