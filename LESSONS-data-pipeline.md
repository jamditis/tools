# Lessons Learned - [Project Name]

> Template for: Data Pipelines & Processing Tools (Python, ETL, scraping, etc.)
> Last updated: YYYY-MM-DD

## Project Summary
[One paragraph describing what this pipeline does and what data it processes]

## What Worked

### Technical Wins
- [Library that handled the job well]
- [Data storage approach]
- [Error handling strategy]

### Data Quality Wins
- [Validation approach that caught issues]
- [Deduplication strategy]
- [Data enrichment technique]

### Operational Wins
- [Logging/monitoring approach]
- [Recovery/retry mechanism]
- [Scheduling solution]

## What Didn't Work

### Critical Failures
- [Data source that broke]
- [Rate limiting issue]
- [Memory/performance bottleneck]

### Technical Debt
- [Hardcoded assumption that broke]
- [Missing error handling]
- [Schema drift not handled]

### External Dependencies
- [API that changed]
- [Service that went down]
- [Authentication issue]

## Key Insights

### The Real Problem
[What the data actually needed vs what you built]

### Scraping/API Lessons
- [Anti-bot detection encountered]
- [Rate limiting strategies]
- [Authentication patterns]

### Data Storage Lessons
- [Why you chose SQLite/Sheets/Postgres/etc.]
- [Schema evolution approach]
- [Backup strategy]

## Recommendations for Future Work

### If Continuing This Project
- [Priority 1 fix/improvement]
- [Priority 2 fix/improvement]

### If Starting Fresh
- [Architecture reconsideration]
- [Tool alternatives]

### Tech Stack Recommendations
- [Keep: library that worked]
- [Replace: library to swap out]
- [Add: missing capability]

## Artifacts Worth Keeping

| File | Why |
|------|-----|
| `processors/` | Reusable data transformations |
| `utils/` | Helper functions |

## Operational Notes
- Run command: `python main.py`
- Schedule: [cron expression or manual]
- Data location: [path or service]
- Credentials needed: [list, no values]
- Recovery procedure: [steps if it fails]

## Data Schema
```
[Key tables/collections and their relationships]
```

---

*Update this document when new insights emerge.*
