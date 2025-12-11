# CLAUDE.md - [Project Name]

> Template for: Digital archives (preservation, collections, research databases)
> Copy to: `./CLAUDE.md` or `./.claude/CLAUDE.md` in your project root
>
> **What is this?** CLAUDE.md is a memory file that gives Claude Code persistent context about your project. It's automatically read at the start of every conversation, so Claude understands your codebase, conventions, and preferences without you having to re-explain them.
>
> **Official docs:** https://code.claude.com/docs/en/memory

## Project overview

[One sentence: What this archive contains and who uses it]

**Collection scope:** [Date range, subject matter, media types]
**Primary users:** [Researchers, public, internal]
**Record count:** [Approximate size of collection]

## Tech stack

**Backend:** [Python, Node.js, etc.]
**Database:** [PostgreSQL, SQLite, etc.]
**Storage:** [Local, S3, Google Drive, etc.]
**Search:** [Full-text, Elasticsearch, Algolia, etc.]
**Frontend:** [If applicable]

## Common commands

```bash
# Ingest new records
[command to add content to archive]

# Run enrichment pipeline
[command to process/analyze content]

# Export data
[command to generate exports]

# Backup
[command to backup archive]
```

## Data model

**Core entities:**
- Record: [fields and relationships]
- Entity: [people, places, organizations]
- Media: [files, formats supported]

**Relationships:**
- [How records link to entities]
- [How records relate to each other]

## Metadata schema

```
{
  "id": "unique identifier",
  "title": "record title",
  "date": "YYYY-MM-DD or date range",
  "source": "original source",
  "content_type": "article|video|audio|document",
  "entities": ["extracted entities"],
  "tags": ["manual or AI-generated tags"]
}
```

## File structure

```
project-root/
├── src/            # Application code
│   ├── ingest/     # Content ingestion
│   ├── enrich/     # AI/metadata enrichment
│   └── export/     # Export utilities
├── data/           # Database files
├── media/          # Archived media files
└── config/         # Configuration
```

## Rights and permissions

- [Copyright status of materials]
- [Access restrictions]
- [Attribution requirements]
- [Embargo periods if applicable]

## Preservation standards

- [File format requirements]
- [Metadata standards: Dublin Core, etc.]
- [Backup frequency and locations]
- [Format migration strategy]

## AI enrichment

- [Entity extraction: which models/APIs]
- [Categorization approach]
- [Summarization if used]
- [Quality verification for AI outputs]

## Search and discovery

- [Searchable fields]
- [Faceted search options]
- [Related record algorithms]

## Quality control

- [Validation rules for new records]
- [Duplicate detection]
- [Data cleaning procedures]
- [Review workflow for flagged items]

## External integrations

- [Source APIs or scrapers]
- [Storage services]
- [AI/ML services]
- [Export destinations]

## Things to avoid

- [Don't ingest without metadata]
- [Never delete original source files]
- [Avoid bulk operations without backup]

---

*Keep this updated as the collection grows or standards change.*
