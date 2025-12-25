# Template Selector

This repository has 11 category-specific template pairs (CLAUDE-RULES + LESSONS). Match projects to the correct category.

## Quick reference

| Project Type | Template Category |
|-------------|-------------------|
| React/Vue/Next.js site | web-app |
| Electron/Tauri app | desktop-app |
| Chrome/Firefox extension | browser-extension |
| ETL, scraping, scheduled jobs | data-pipeline |
| React Native/Flutter app | mobile-app |
| Newsletter, podcast, blog | publication |
| Historical collection, archive | digital-archive |
| Conference, summit, event | event-website |
| CMS workflow, syndication | content-pipeline |
| Newsroom AI tool, fact-checker | editorial-tool |
| Investigation, data journalism | research-project |
| None of the above | general |

## Software development templates

### web-app
**Use when:** Building React, Vue, Next.js, Svelte sites, SPAs, dashboards, any browser-based interface
**Not for:** Static marketing sites (use general), APIs without UI, browser extensions

### desktop-app
**Use when:** Building Electron, Tauri, or native desktop applications that install on Mac/Windows/Linux
**Not for:** Web apps that look like desktop apps, PWAs

### browser-extension
**Use when:** Building Chrome, Firefox, Safari, or Edge extensions that live in browser chrome
**Not for:** Bookmarklets, web apps, browser-based tools that aren't extensions

### data-pipeline
**Use when:** Building ETL processes, web scrapers, data processing scripts, scheduled jobs, cron tasks, Airflow DAGs
**Not for:** One-off data analysis scripts, Jupyter notebooks for exploration

### mobile-app
**Use when:** Building React Native, Capacitor, Flutter, or native iOS/Android applications
**Not for:** Mobile-responsive web apps, PWAs

## Journalism/publishing templates

### publication
**Use when:** Building newsletters, podcasts, blogs, ongoing content series with regular publishing schedule
**Not for:** One-off articles, static content sites

### digital-archive
**Use when:** Building historical collections, preservation projects, research databases, document repositories
**Not for:** Active news sites, CMS platforms

### event-website
**Use when:** Building sites for conferences, summits, workshops, or events with specific dates
**Not for:** Ongoing content, organization websites without events

### content-pipeline
**Use when:** Building CMS workflows, publishing automation, content syndication systems
**Not for:** Manual publishing workflows, single-site content management

### editorial-tool
**Use when:** Building newsroom tools, writing assistants, fact-checkers, AI-powered research tools
**Not for:** Generic productivity tools, non-journalism software

### research-project
**Use when:** Building investigative journalism projects, data journalism, analysis with defined scope and end date
**Not for:** Ongoing research operations, general data analysis

### general
**Use when:** Project truly doesn't fit other categories
**Not for:** Projects that clearly fit a category—pick the specific one

## Decision tree

```
Is it for journalism/publishing?
├── Yes →
│   ├── Has specific end date/event? → event-website
│   ├── Ongoing content series? → publication
│   ├── Historical/preservation? → digital-archive
│   ├── Newsroom tool/AI? → editorial-tool
│   ├── CMS/automation? → content-pipeline
│   └── Investigation with scope? → research-project
│
└── No (software) →
    ├── Lives in browser chrome? → browser-extension
    ├── Installs on desktop? → desktop-app
    ├── Runs on mobile? → mobile-app
    ├── Processes data in batches? → data-pipeline
    ├── Web interface? → web-app
    └── None of above → general
```

## Common mistakes

| Project | Wrong Choice | Right Choice | Why |
|---------|-------------|--------------|-----|
| Newsletter dashboard | web-app | publication | It's about the publication, not the tech |
| Scraping script | general | data-pipeline | Has scheduling, data processing patterns |
| AI fact-checker | research-project | editorial-tool | It's a tool, not a one-off investigation |
| Event registration | web-app | event-website | Event-specific patterns (dates, schedules) |
| Podcast website | web-app | publication | Publishing patterns, audience, episodes |
| Document search | web-app | digital-archive | Preservation, metadata, collection patterns |

## Template file locations

Templates are in two places:
- Root: `/CLAUDE-RULES-*.md` and `/LESSONS-*.md`
- Downloads: `/resource-kit/docs/downloads/CLAUDE-RULES-*.md`

## Using templates

1. Identify project category using decision tree above
2. Copy appropriate `CLAUDE-RULES-[category].md` to project as `CLAUDE.md`
3. Fill in bracketed placeholders with project specifics
4. Create `LESSONS.md` from `LESSONS-[category].md` as project progresses
