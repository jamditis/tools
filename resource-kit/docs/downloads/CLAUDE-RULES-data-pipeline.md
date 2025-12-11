# CLAUDE.md - [Project Name]

> Template for: Data pipelines (ETL, scraping, processing, analytics)
> Copy to: `./CLAUDE.md` or `./.claude/CLAUDE.md` in your project root
>
> **What is this?** CLAUDE.md is a memory file that gives Claude Code persistent context about your project. It's automatically read at the start of every conversation, so Claude understands your codebase, conventions, and preferences without you having to re-explain them.
>
> **Official docs:** https://code.claude.com/docs/en/memory

## Project overview

[One sentence: What data this pipeline processes and where it goes]

**Language:** [Python, Node.js, etc.]
**Orchestration:** [Airflow, Prefect, cron, manual, etc.]
**Storage:** [PostgreSQL, BigQuery, S3, Google Sheets, etc.]
**Sources:** [APIs, web scraping, file uploads, etc.]

## Common commands

```bash
# Run pipeline
[command to run main pipeline]

# Test with sample data
[command to test without side effects]

# Validate output
[command to check data quality]

# View logs
[command to tail logs]
```

## Data flow

```
[Source A] ──> [Ingestion] ──> [Transform] ──> [Storage]
[Source B] ──────────┘              │
                                    └──> [Export/API]
```

## Schema overview

- **Input:** [describe expected input format/schema]
- **Intermediate:** [any staging tables or temp storage]
- **Output:** [final schema, destination tables]

## Code style

- [Naming: snake_case for files and functions]
- [Type hints: required/optional]
- [Logging: level and format conventions]
- [Config: environment variables vs config files]

## File structure

```
project-root/
├── src/            # Pipeline code
│   ├── extract/    # Data extraction modules
│   ├── transform/  # Transformation logic
│   └── load/       # Loading/storage modules
├── config/         # Configuration files
├── tests/          # Test suite
└── scripts/        # Utility scripts
```

## Error handling

- [Retry strategy: how many times, exponential backoff?]
- [Failure notifications: email, Slack, etc.]
- [Partial failure handling: skip, halt, or log and continue?]
- [Dead letter queue or failure log location]

## Rate limits and quotas

- [API A]: [X requests/minute]
- [API B]: [Y requests/day]
- [Storage]: [quota or cost considerations]

## Testing approach

- Unit tests for transformations
- Integration tests with sample data
- [Dry-run mode: how to test without writing to production]
- [Snapshot testing for schema validation]

## Idempotency

- [Can this pipeline be safely re-run?]
- [How duplicates are handled]
- [Primary keys or deduplication strategy]

## Monitoring

- [Where to check pipeline status]
- [Key metrics to watch]
- [Alerting thresholds]

## Secrets and credentials

- [How API keys are stored: env vars, secrets manager]
- [Service account locations]
- [Never commit: list sensitive files]

## Things to avoid

- [Don't run X without Y]
- [Never modify Z table directly]
- [Avoid processing during peak hours]

---

*Keep this updated as data sources or destinations change.*
