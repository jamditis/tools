# CLAUDE.md - [Project Name]

> Template for: General projects (Updated for Claude Code v2.1)
> Copy to: `./CLAUDE.md` or `./.claude/CLAUDE.md` in your project root
>
> **What is this?** CLAUDE.md is a memory file that gives Claude Code persistent context about your project. It's automatically read at the start of every conversation, so Claude understands your codebase, conventions, and preferences without you having to re-explain them.
>
> **Official docs:** https://code.claude.com/docs/en/memory

## Project overview

[One sentence: What this project does and who it's for]

**Tech stack:** [Languages, frameworks, key dependencies]
**Repository:** [URL if applicable]

## Common commands

```bash
# Development
[command to start dev server or run locally]

# Testing
[command to run tests]

# Build
[command to build for production]

# Lint/Format
[command to check code style]
```

## Code style

- [Indentation preference: tabs vs spaces, size]
- [Naming conventions: camelCase, snake_case, etc.]
- [File naming: kebab-case.ts, PascalCase.tsx, etc.]
- [Import organization: external first, then internal]

## Architecture notes

- [Key architectural decisions]
- [Where business logic lives]
- [How data flows through the system]

## File structure

```
project-root/
├── .claude/           # Claude Code configuration
│   ├── settings.json        # Shared permissions and hooks
│   ├── settings.local.json  # Personal, gitignored overrides
│   ├── agents/              # Specialized subagent definitions
│   ├── skills/        # Custom skill definitions
│   └── hooks/         # Automation hooks
├── [dir/]             # [what it contains]
├── [dir/]             # [what it contains]
└── [file]             # [what it does]
```

## Important patterns

- [Pattern 1: how to do X in this codebase]
- [Pattern 2: how to do Y in this codebase]

## Testing approach

- [Unit test location and naming]
- [Integration test approach]
- [What must be tested vs optional]

## Things to avoid

- [Anti-pattern specific to this project]
- [Deprecated approach still in codebase]
- [Common mistake to watch for]

## External dependencies

- [Key API or service]: [what it's used for]
- [Database]: [type and connection info location]

## When making changes

- [Pre-commit requirements]
- [PR/review process notes]
- [Documentation that needs updating]

---

## Claude Code v2.1 configuration

### Recommended skills

Create in `.claude/skills/` for repeated tasks:

```markdown
---
name: [skill-name]
description: [What this skill does]
context: fork  # Optional: for parallel sub-agents
---

# [Skill name]

[Instructions for Claude when this skill is invoked]
```

### Recommended hooks

Configure hooks in `.claude/settings.json` for shared automation. Scripts may
live under `.claude/hooks/`, but they are not auto-discovered.

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup|resume",
        "hooks": [
          {
            "type": "command",
            "command": "git status --short"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "npm test"
          }
        ]
      }
    ]
  }
}
```

### Session naming convention

Use `/rename` to name sessions for this project:

- `[project]-feature-[name]` - Feature development
- `[project]-bugfix-[issue]` - Bug fixes
- `[project]-refactor` - Refactoring work

### Agent configurations

Define specialized agents as `.claude/agents/<name>.md` files:

```markdown
---
name: [project]-review
description: Read-only review for this project
tools: Read, Glob, Grep
disallowedTools: Edit, Write, Bash
model: inherit
---

Review the requested change and report concrete findings with file references.
```

---

*Be specific. "Use 2-space indentation" beats "Format code properly."*
*Verified July 24, 2026 against Claude Code v2.1 documentation.*
