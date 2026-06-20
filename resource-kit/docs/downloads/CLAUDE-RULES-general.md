# CLAUDE.md - [Project Name]

> Template for: General projects (Updated for Claude Code v2.1)
> Copy to: `./CLAUDE.md` or `./.claude/CLAUDE.md` in your project root
>
> **What is this?** CLAUDE.md is a memory file that gives Claude Code persistent context about your project. It's automatically read at the start of every conversation, so Claude understands your codebase, conventions, and preferences without you having to re-explain them.
>
> **Official docs:** https://code.claude.com/docs/en/claude-code

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
│   ├── settings.local.json  # Permissions and agents
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

## Claude Code v2.1 Configuration

### Recommended Skills

Create in `.claude/skills/` for repeated tasks:

```markdown
---
name: [skill-name]
description: [What this skill does]
context: fork  # Optional: for parallel sub-agents
---

# [Skill Name]

[Instructions for Claude when this skill is invoked]
```

### Recommended Hooks

Create in `.claude/hooks/` for automation:

```yaml
---
hooks:
  - type: SessionStart
    once: true
    command: |
      echo "Welcome to [Project Name]"
      # Check environment, show status

  - type: PostToolUse
    tool: Edit
    command: |
      # Validate edits, run tests
      npm test

  - type: Stop
    command: |
      # Remind about next steps
      echo "Remember to commit your changes!"
---
```

### Session Naming Convention

Use `/rename` to name sessions for this project:

- `[project]-feature-[name]` - Feature development
- `[project]-bugfix-[issue]` - Bug fixes
- `[project]-refactor` - Refactoring work

### Agent Configurations

Define in `.claude/settings.local.json`:

```json
{
  "agents": {
    "[project]-dev": {
      "description": "Full development access",
      "tools": ["Read", "Glob", "Grep", "Edit", "Write", "Bash"]
    },
    "[project]-review": {
      "description": "Read-only code review",
      "tools": ["Read", "Glob", "Grep"],
      "disallowedTools": ["Edit", "Write", "Bash"]
    }
  }
}
```

---

*Be specific. "Use 2-space indentation" beats "Format code properly."*
*Updated for Claude Code v2.1 - January 2026*
