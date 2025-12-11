# CLAUDE.md - [Project Name]

> Template for: Content pipelines (publishing workflows, content automation)
> Copy to: `./CLAUDE.md` or `./.claude/CLAUDE.md` in your project root
>
> **What is this?** CLAUDE.md is a memory file that gives Claude Code persistent context about your project. It's automatically read at the start of every conversation, so Claude understands your codebase, conventions, and preferences without you having to re-explain them.
>
> **Official docs:** https://code.claude.com/docs/en/memory

## Project overview

[One sentence: What content this pipeline processes and where it publishes]

**Content types:** [Articles, newsletters, social posts, etc.]
**Sources:** [CMS, Google Docs, RSS, etc.]
**Destinations:** [Website, email, social platforms]
**Frequency:** [Daily, weekly, on-demand]

## Tech stack

**Language:** [Python, Node.js, etc.]
**Automation:** [GitHub Actions, cron, Zapier, etc.]
**Storage:** [Database, cloud storage, etc.]
**APIs:** [CMS, social platforms, email service]

## Common commands

```bash
# Run full pipeline
[command to process and publish content]

# Preview without publishing
[command for dry run]

# Process single item
[command to process one piece of content]

# Check pipeline status
[command to view queue/status]
```

## Content flow

```
[Source] --> [Ingest] --> [Transform] --> [Enrich] --> [Publish]
                              │
                              └--> [Review Queue] (if needed)
```

## Content schema

**Input format:**
```yaml
title: ""
body: ""
author: ""
date: ""
tags: []
status: draft|review|approved
```

**Output transformations:**
- [HTML formatting]
- [Image optimization]
- [SEO metadata generation]

## File structure

```
project-root/
├── src/
│   ├── ingest/         # Content ingestion
│   ├── transform/      # Format conversion
│   ├── enrich/         # AI enhancement, metadata
│   ├── publish/        # Platform publishers
│   └── utils/          # Shared utilities
├── templates/          # Output templates
├── config/             # Platform configs
└── queue/              # Processing queue
```

## Platform integrations

**[Platform A]:**
- API credentials location
- Rate limits
- Publishing rules

**[Platform B]:**
- Authentication method
- Content requirements
- Scheduling capabilities

## AI enrichment

- [Summarization: model and prompts]
- [Tagging: automated categorization]
- [SEO: title/description generation]
- [Human review: when required]

## Quality gates

- [ ] Spell check / grammar
- [ ] Link validation
- [ ] Image alt text
- [ ] SEO requirements
- [ ] Editorial approval (if required)

## Scheduling

- [How scheduled posts work]
- [Timezone considerations]
- [Queue management]

## Error handling

- [Failed publish retry strategy]
- [Notification on failure]
- [Manual intervention process]

## Monitoring

- [Where to check pipeline health]
- [Success/failure metrics]
- [Content performance tracking]

## Things to avoid

- Don't publish without preview
- Avoid duplicate posts to same platform
- Don't skip quality gates for "urgent" content

---

*Update when adding new content types or platforms.*
