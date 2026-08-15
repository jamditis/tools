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

### Hooks (`.claude/settings.json`)

Define hooks under the `hooks` key in `~/.claude/settings.json`,
`.claude/settings.json`, or `.claude/settings.local.json`. Hook scripts may live
in `.claude/hooks/`, but Claude Code does not discover that directory by itself.

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/check-command.sh"
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

---

## Hook Types

| Type | When It Runs |
|------|--------------|
| `SessionStart` | Beginning of session |
| `PreToolUse` | Before a tool executes |
| `PostToolUse` | After a tool completes |
| `Stop` | When session ends |

### Hook input and enforcement

Command hooks receive JSON on stdin, including `session_id`, `cwd`,
`tool_name`, and `tool_input`. Parse the relevant field with `jq` or a real JSON
parser. Exit `0` to continue; for blocking events such as `PreToolUse`, exit `2`
with a message on stderr to block. Use structured JSON when you need allow,
deny, ask, or modified-input behavior.

---

## Agent Configuration

Define each specialized agent in `.claude/agents/<name>.md`:

```markdown
---
name: json-editor
description: Focused JSON editor for bounded catalog changes
tools: Read, Glob, Grep, Edit, Write
disallowedTools: Bash, Task
model: inherit
---

Edit only the requested JSON. Validate syntax and relevant cross-references.
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
3. Claude records a reviewable plan
4. Review and provide feedback
5. Approve to begin implementation
6. Approve implementation through the plan-mode permission flow

---

## MCP Server Integration

Add the server to the project-level `.mcp.json`:

```json
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["./mcp-servers/my-server/index.js"]
    }
  }
}
```

Keep permission rules in `.claude/settings.json` or
`.claude/settings.local.json`. Prefer the smallest tool allowlist that supports
the task; a wildcard such as `mcp__my-server__*` grants every tool from that
server.

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
- [ ] Are hooks configured under `hooks` in a settings JSON file?
- [ ] Do referenced hook scripts exist and have execute permission?
- [ ] Are skills in .claude/skills/?
- [ ] Is settings.local.json valid JSON?
- [ ] Did you restart Claude after config changes?

---

## Resources

- [Claude Code Changelog](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)
- [Claude Code Documentation](https://code.claude.com/docs/en/overview)
- [Amditis Resource Kit](https://tools.amditis.tech/)

---

*Verified August 15, 2026 against Claude Code v2.1 documentation and CLI 2.1.233.*
