# Claude Code v2.1 Quick Reference

Essential commands, keyboard shortcuts, and features for Claude Code.

---

## Getting Started

```bash
# Install
npm install -g @anthropic-ai/claude-code

# Start session
claude

# Start with specific model
claude --model opus

# Resume a named session
claude --resume my-project

# Use a specific agent
claude --agent json-editor
```

---

## Essential Commands

| Command | Description |
|---------|-------------|
| `/plan` | Enter plan mode for complex features |
| `/rename <name>` | Name current session for later |
| `/stats` | View usage statistics |
| `/help` | Show all available commands |
| `/clear` | Clear conversation history |

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Alt+T` | Toggle thinking mode |
| `Alt+P` | Switch models mid-prompt |
| `Shift+Tab` | Auto-accept edits (plan mode) |
| `Ctrl+B` | Background all foreground tasks |
| `;` / `,` | Repeat f/F/t/T vim motions |

---

## Project Configuration

### CLAUDE.md (Project Memory)

Place in project root. Claude reads this at session start.

```markdown
# CLAUDE.md

## Project Overview
[What this project does]

## Architecture
[Key files and their purposes]

## Conventions
- [Naming conventions]
- [Code patterns to follow]

## Common Commands
- `npm run dev` - Start development server
- `npm test` - Run tests

## Things to Avoid
- [Anti-patterns]
- [Outdated approaches]
```

### Skills (.claude/skills/)

Reusable prompt templates for specialized tasks.

```markdown
---
name: my-skill
description: What this skill does
context: fork  # Optional: spawn parallel sub-agents
---

# Skill Name

Instructions for Claude when this skill is invoked.

## Steps
1. First step
2. Second step

## Examples
[Include examples of expected behavior]
```

### Hooks (.claude/hooks/)

Scripts that run at specific moments.

```yaml
---
hooks:
  - type: PreToolUse    # Before tool runs
    tool: Edit          # Which tool to watch
    command: |          # Script to run
      echo "About to edit: $CLAUDE_TOOL_INPUT_FILE_PATH"

  - type: PostToolUse   # After tool runs
    tool: [Edit, Write]
    once: true          # Run only once per session
    command: |
      npm test          # Run tests after edits

  - type: SessionStart  # When session begins
    command: |
      echo "Welcome to the project!"
      git status

  - type: Stop          # When session ends
    command: |
      echo "Remember to commit your changes!"
---

# Hook Documentation
[Explain what this hook does]
```

---

## Hook Types

| Type | When It Runs |
|------|--------------|
| `SessionStart` | Beginning of session |
| `PreToolUse` | Before a tool executes |
| `PostToolUse` | After a tool completes |
| `Stop` | When session ends |

### Hook Environment Variables

```bash
$CLAUDE_TOOL_INPUT_FILE_PATH    # File being edited
$CLAUDE_TOOL_INPUT_NEW_STRING   # New content (Edit)
$CLAUDE_TOOL_INPUT_OLD_STRING   # Old content (Edit)
$CLAUDE_TOOL_INPUT_COMMAND      # Command (Bash)
```

---

## Agent Configuration

Define specialized agents in `.claude/settings.local.json`:

```json
{
  "agents": {
    "json-editor": {
      "description": "Focused on JSON data files",
      "tools": ["Read", "Glob", "Grep", "Edit", "Write"],
      "disallowedTools": ["Bash", "Task"]
    },
    "content-reviewer": {
      "description": "Read-only review",
      "tools": ["Read", "Glob", "Grep"],
      "disallowedTools": ["Edit", "Write", "Bash"]
    }
  }
}
```

Use with: `claude --agent json-editor`

---

## Background Tasks

```bash
# Run command in background
node long-script.js &

# Background all foreground tasks
Ctrl+B

# Check running tasks
/tasks

# View task output
BashOutput tool with task ID
```

---

## Plan Mode Workflow

1. Enter plan mode: `/plan`
2. Claude explores codebase
3. Claude writes plan to plan.md
4. Review and provide feedback
5. Approve to begin implementation
6. Exit with `ExitPlanMode`

---

## MCP Server Integration

Add to `.claude/settings.local.json`:

```json
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["./mcp-servers/my-server/index.js"]
    }
  },
  "permissions": {
    "allow": ["mcp__my-server__*"]
  }
}
```

Wildcard `mcp__server__*` allows all tools from that server.

---

## Forked Context Skills

Create skills that spawn parallel sub-agents:

```markdown
---
name: content-auditor
context: fork
description: Run parallel audits
---

# Content Auditor

Spawn three parallel agents:
1. Model name audit
2. Link validation
3. Consistency check

Each reports back independently.
```

---

## Tips for Journalism Projects

1. **Create a CLAUDE.md** that documents your newsroom's style guide
2. **Use hooks** to validate AP style or model name conventions
3. **Name sessions** by story or project for easy resumption
4. **Plan mode** for complex investigations or multi-part stories
5. **Background tasks** for processing large document sets
6. **Skills** for repeated tasks like FOIA formatting or source verification

---

## Quick Debug Checklist

- [ ] Is CLAUDE.md in project root?
- [ ] Are hooks in .claude/hooks/?
- [ ] Are skills in .claude/skills/?
- [ ] Is settings.local.json valid JSON?
- [ ] Did you restart Claude after config changes?

---

## Resources

- [Claude Code Changelog](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)
- [Claude Code Documentation](https://code.claude.com/docs/en/overview)
- [Amditis Resource Kit](https://tools.amditis.tech/)

---

*Claude Code v2.1 | January 2026*
