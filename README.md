# LESSONS.md Templates

Templates for documenting project learnings, designed to carry forward wisdom without context bleed.

## Software Development Templates

| Template | Use For |
|----------|---------|
| `LESSONS-general.md` | Any project type (start here if unsure) |
| `LESSONS-desktop-app.md` | Electron, Tauri, native desktop apps |
| `LESSONS-browser-extension.md` | Chrome/Firefox/Edge extensions |
| `LESSONS-web-app.md` | React, Vue, static sites, SPAs |
| `LESSONS-data-pipeline.md` | Python scripts, ETL, scrapers, data processing |
| `LESSONS-mobile-app.md` | React Native, Capacitor, Flutter, native mobile |

## Journalism & Publishing Templates

| Template | Use For |
|----------|---------|
| `LESSONS-digital-archive.md` | Digital preservation, historical archives, collections |
| `LESSONS-event-website.md` | Conferences, summits, events with registration |
| `LESSONS-content-pipeline.md` | CMS workflows, publishing automation, syndication |
| `LESSONS-editorial-tool.md` | Newsroom tools, reporter/editor software |
| `LESSONS-research-project.md` | Investigations, data journalism, analysis projects |
| `LESSONS-publication.md` | Newsletters, blogs, ongoing content series |

## How to Use

### Starting a New Project
```bash
# Copy the appropriate template to your project
cp ~/.claude/templates/LESSONS-[type].md /path/to/project/LESSONS.md
```

### From Claude Code
Ask Claude to:
> "Create a LESSONS.md for this project using the [type] template from ~/.claude/templates/"

### When to Write Lessons
- **Before abandoning a project** - capture what you learned
- **After a major pivot** - document why the old approach failed
- **When starting fresh** - reference lessons from related projects
- **After shipping** - retrospective on what worked
- **After an event** - while details are fresh
- **When an investigation concludes** - preserve methodology

## Template Philosophy

### Focus on "The Real Problem"
Every template has a section for this. It's the most important part. What did users actually need vs what you built? This insight transfers to future projects.

### Keep vs Start Fresh
Templates separate recommendations for continuing the current project vs starting over. Both are valid paths.

### Artifacts Worth Keeping
Code dies, but patterns live. Identify files/components that could be extracted and reused.

### Stakeholders & Relationships
Journalism templates emphasize people - sources, partners, collaborators. These relationships often outlast individual projects.

## Customizing Templates

Feel free to modify these templates. They're guidelines, not rules. Add sections relevant to your work, remove ones that don't apply.

## Integration with CLAUDE.md

Reference LESSONS.md from your project's CLAUDE.md:
```markdown
## Background
See @LESSONS.md for context on past attempts and what we learned.
```

This gives Claude Code the historical context without polluting the main instructions.

## Quick Reference: Choosing a Template

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
