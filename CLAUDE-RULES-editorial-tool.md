# CLAUDE.md - [Project Name]

> Template for: Editorial tools (writing aids, fact-checking, research tools)
> Copy to: `./CLAUDE.md` or `./.claude/CLAUDE.md` in your project root
>
> **What is this?** CLAUDE.md is a memory file that gives Claude Code persistent context about your project. It's automatically read at the start of every conversation, so Claude understands your codebase, conventions, and preferences without you having to re-explain them.
>
> **Official docs:** https://code.claude.com/docs/en/memory

## Project overview

[One sentence: What editorial task this tool helps with and who uses it]

**Tool type:** [Fact-checker, research assistant, writing aid, etc.]
**Users:** [Reporters, editors, researchers]
**Interface:** [CLI, web app, browser extension, API]

## Tech stack

**Language:** [Python, TypeScript, etc.]
**Framework:** [If web-based]
**AI/ML:** [Models and APIs used]
**Data sources:** [Databases, APIs, archives accessed]

## Common commands

```bash
# Start the tool
[command to run]

# Run on specific content
[command with input]

# Update data sources
[command to refresh reference data]

# Test
[command to run tests]
```

## Core functionality

**Primary features:**
1. [Feature A]: [what it does]
2. [Feature B]: [what it does]
3. [Feature C]: [what it does]

**Workflow:**
```
[Input] --> [Analysis] --> [Results] --> [Human Review]
```

## File structure

```
project-root/
├── src/
│   ├── analyzers/      # Content analysis modules
│   ├── sources/        # Data source integrations
│   ├── ui/             # User interface (if applicable)
│   └── utils/          # Shared utilities
├── data/               # Reference data
├── prompts/            # AI prompts (if applicable)
└── tests/              # Test suite
```

## Data sources

**[Source A]:**
- Type: [API, database, file]
- Update frequency: [real-time, daily, etc.]
- Access credentials: [location]

**[Source B]:**
- [Same structure]

## AI/ML components

- **Model(s):** [GPT-4, Claude, custom, etc.]
- **Prompts:** [Location and versioning]
- **Confidence thresholds:** [When to flag for review]
- **Cost management:** [API limits, caching]

## Output format

```json
{
  "confidence": 0.95,
  "result": "verified|unverified|needs_review",
  "evidence": [],
  "suggestions": []
}
```

## Accuracy and reliability

- [Known limitations]
- [False positive/negative rates if known]
- [When human review is mandatory]
- [Disclaimer text for outputs]

## Ethical considerations

- [Bias awareness in training data]
- [Source transparency]
- [Human oversight requirements]
- [Not a replacement for: X, Y, Z]

## Testing approach

- Unit tests for analysis logic
- Integration tests for data sources
- [Sample content for testing]
- [Edge cases to test]

## Performance

- [Response time targets]
- [Concurrent user capacity]
- [Caching strategy]

## Things to avoid

- Don't present AI output as definitive fact
- Avoid single-source verification
- Don't skip human review for high-stakes content

---

*Update when adding new analysis capabilities or data sources.*
