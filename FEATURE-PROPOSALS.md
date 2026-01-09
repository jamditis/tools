# Claude Code Feature Proposals for Amditis Resource Kit

This document outlines creative ways to leverage newly released Claude Code features (v2.1.0-2.1.2) for the Amditis Resource Kit journalism tools project.

---

## Table of Contents

1. [Hooks & Automation](#1-hooks--automation)
2. [Forked Context Skills](#2-forked-context-skills)
3. [MCP Server Integration](#3-mcp-server-integration)
4. [Session Management](#4-session-management)
5. [Background Tasks](#5-background-tasks)
6. [Language & Internationalization](#6-language--internationalization)
7. [Plan Mode Workflows](#7-plan-mode-workflows)
8. [Agent-Scoped Development](#8-agent-scoped-development)
9. [LSP Integration](#9-lsp-integration)
10. [Tool Restrictions](#10-tool-restrictions)

---

## 1. Hooks & Automation

### 1.1 Model Name Validator Hook (PostToolUse)

**Feature Used:** `PostToolUse` hook with `once: false`

Automatically validate that all AI model names in edited files follow the naming convention (Claude 4.5 Opus, Gemini 3.0 Pro, etc.)

```yaml
# .claude/hooks/model-validator.yml
hooks:
  - type: PostToolUse
    tool: Edit
    command: |
      FILE="${CLAUDE_TOOL_INPUT_FILE_PATH}"
      if [[ "$FILE" == *.json ]] || [[ "$FILE" == *.html ]] || [[ "$FILE" == *.md ]]; then
        if grep -qE "Claude 4 Opus|GPT-4o|Gemini 2\." "$FILE"; then
          echo "⚠️ OUTDATED MODEL NAME DETECTED in $FILE"
          echo "Run: /model-name-validator skill to fix"
          exit 1
        fi
      fi
```

### 1.2 Amditis Theme Validator Hook (PreToolUse)

**Feature Used:** `PreToolUse` hook

Prevent accidental light-theme class usage before any CSS/HTML edit:

```yaml
# .claude/hooks/theme-validator.yml
hooks:
  - type: PreToolUse
    tool: Edit
    condition: |
      [[ "${CLAUDE_TOOL_INPUT_FILE_PATH}" == *.css ]] ||
      [[ "${CLAUDE_TOOL_INPUT_FILE_PATH}" == *.html ]]
    command: |
      # Check if new_string contains forbidden theme classes
      if echo "$CLAUDE_TOOL_INPUT_NEW_STRING" | grep -qE "bg-light-|dark:bg-dark-|bg-accent-"; then
        echo "🚫 BLOCKED: Light theme classes detected"
        echo "Use Amditis theme: bg-void, bg-panel, bg-surface"
        exit 1
      fi
```

### 1.3 JSON Schema Validation Hook

**Feature Used:** `PostToolUse` hook for Write/Edit on JSON files

Validate LLM Advisor data files after modification:

```yaml
# .claude/hooks/json-validator.yml
hooks:
  - type: PostToolUse
    tool: [Edit, Write]
    condition: '[[ "${CLAUDE_TOOL_INPUT_FILE_PATH}" == *llm-advisor/data/*.json ]]'
    command: |
      FILE="${CLAUDE_TOOL_INPUT_FILE_PATH}"
      if ! node -e "JSON.parse(require('fs').readFileSync('$FILE'))"; then
        echo "❌ Invalid JSON in $FILE"
        exit 1
      fi
      echo "✅ JSON valid: $FILE"
```

### 1.4 Deployment Status Hook (Stop)

**Feature Used:** `Stop` hook with `once: true`

Remind about GitHub Pages deployment after session ends:

```yaml
# .claude/hooks/deploy-reminder.yml
hooks:
  - type: Stop
    once: true
    command: |
      if git status --porcelain | grep -q .; then
        echo "📦 Uncommitted changes detected!"
        echo "Remember: Push to master for GitHub Pages deployment"
        echo "Check status: gh run list --limit 3"
      fi
```

### 1.5 Session Start Hook for Development Environment

**Feature Used:** `SessionStart` hook

Set up the development environment automatically:

```yaml
# .claude/hooks/session-start.yml
hooks:
  - type: SessionStart
    command: |
      echo "🎨 Amditis Resource Kit Development Session"
      echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

      # Check if local server is running
      if ! curl -s http://localhost:8000 > /dev/null 2>&1; then
        echo "💡 Tip: Start local server with:"
        echo "   cd resource-kit/docs && python -m http.server 8000"
      else
        echo "✅ Local server running at http://localhost:8000"
      fi

      # Show pending GitHub Actions
      echo ""
      echo "📊 Recent deployments:"
      gh run list --limit 2 2>/dev/null || echo "   (gh CLI not configured)"
```

---

## 2. Forked Context Skills

### 2.1 Parallel Content Auditor

**Feature Used:** `context: fork` in skill frontmatter

Create a skill that spawns parallel sub-agents to audit different aspects simultaneously:

```markdown
---
name: content-auditor
context: fork
description: Runs parallel audits on LLM Advisor content
---

# Content Auditor Skill

When invoked, spawn three parallel sub-agents:

1. **Model Name Audit** - Check all JSON for outdated model names
2. **Link Validator** - Verify all external URLs in case-studies.json
3. **Accessibility Check** - Audit HTML for ARIA labels and alt text

Each sub-agent reports back findings independently.
```

### 2.2 Template Generator with Forked Specialization

**Feature Used:** `context: fork` for specialized template generation

```markdown
---
name: template-factory
context: fork
description: Generate both LESSONS and CLAUDE-RULES templates in parallel
---

# Template Factory

When user describes a project, spawn two parallel agents:

1. **LESSONS Generator** - Creates retrospective template
2. **CLAUDE-RULES Generator** - Creates Claude memory file

Both use shared project context but work independently.
```

### 2.3 Multi-Format Export Skill

**Feature Used:** `context: fork` for parallel format conversion

```markdown
---
name: multi-export
context: fork
description: Export decision tree to multiple formats simultaneously
---

# Multi-Format Export

Export current decision-tree.json to:
- Mermaid diagram (for documentation)
- CSV (for spreadsheet users)
- Markdown table (for README)

All conversions run in parallel.
```

---

## 3. MCP Server Integration

### 3.1 LLM Advisor Data Management Server

**Feature Used:** MCP server with `list_changed` notifications

Create a custom MCP server for managing LLM Advisor JSON data:

```javascript
// mcp-servers/llm-advisor-data/index.js
const { Server } = require('@modelcontextprotocol/sdk');

const server = new Server({
  name: 'llm-advisor-data',
  version: '1.0.0'
});

// Tools that dynamically update based on data files
server.tools = {
  'add-decision-node': async ({ parent, question, options }) => {
    // Add node to decision-tree.json
    // Emit list_changed if new branch types added
  },

  'add-case-study': async ({ title, organization, challenge, solution }) => {
    // Add to case-studies.json with validation
  },

  'update-model-info': async ({ model, updates }) => {
    // Update model-info.json with version tracking
  },

  'validate-all-json': async () => {
    // Validate all 6 JSON files against schemas
  }
};
```

**Settings configuration:**

```json
{
  "mcpServers": {
    "llm-advisor-data": {
      "command": "node",
      "args": ["./mcp-servers/llm-advisor-data/index.js"]
    }
  },
  "permissions": {
    "allow": ["mcp__llm-advisor-data__*"]
  }
}
```

### 3.2 Amditis Theme Token Server

**Feature Used:** MCP server for design system tokens

```javascript
// mcp-servers/amditis-theme/index.js
const server = new Server({
  name: 'amditis-theme',
  version: '1.0.0'
});

server.tools = {
  'get-color': async ({ semantic }) => {
    // Returns: { "primary": "#ccff00", "class": "text-acid" }
  },

  'suggest-component': async ({ type }) => {
    // Returns Amditis-styled HTML snippet for buttons, cards, etc.
  },

  'validate-classes': async ({ classes }) => {
    // Check if CSS classes follow Amditis conventions
  }
};
```

---

## 4. Session Management

### 4.1 Named Sessions for Feature Development

**Feature Used:** `/rename` command and `--resume <name>`

Create semantic session names for different development contexts:

```bash
# LLM Advisor enhancements
claude
/rename llm-advisor-v2

# Later, resume specifically
claude --resume llm-advisor-v2
```

**Recommended session naming conventions:**

| Session Name | Purpose |
|-------------|---------|
| `llm-advisor-data` | JSON content updates |
| `llm-advisor-ui` | UI/UX improvements |
| `template-updates` | LESSONS/CLAUDE-RULES maintenance |
| `theme-refinement` | Amditis CSS updates |
| `skill-development` | Creating new .claude/skills |
| `deployment-fix` | GitHub Pages issues |

### 4.2 Session Statistics for Journalism Workflow

**Feature Used:** `/stats` command

Track Claude usage patterns across journalism tool development:

```
/stats

# Output shows:
# - Favorite model (probably Claude 4.5 Opus for complex JSON work)
# - Usage patterns (peak hours, weekend vs weekday)
# - Streaks (consecutive days of development)
```

---

## 5. Background Tasks

### 5.1 Parallel JSON Validation

**Feature Used:** Background tasks with wake-up messaging

Run validation on all JSON files while continuing conversation:

```markdown
# Skill: background-validator

1. Start background validation: `node scripts/validate-all-json.js &`
2. Continue working on other tasks
3. Receive notification when validation completes
4. Review any errors found
```

### 5.2 Local Server with Live Reload

**Feature Used:** Background bash commands with Ctrl+B

```bash
# Start server in background
cd resource-kit/docs && python -m http.server 8000 &

# Continue development
# Use Ctrl+B to background all foreground tasks

# Server runs persistently during session
```

### 5.3 GitHub Actions Monitoring

**Feature Used:** Background polling for deployment status

```bash
# Monitor deployment in background
while true; do
  STATUS=$(gh run list --limit 1 --json status -q '.[0].status')
  if [ "$STATUS" = "completed" ]; then
    echo "🚀 Deployment complete!"
    break
  fi
  sleep 30
done &
```

---

## 6. Language & Internationalization

### 6.1 Multilingual Content Development

**Feature Used:** `language` setting in settings.json

For developing internationalized versions of the resource kit:

```json
// .claude/settings.local.json
{
  "language": "spanish"
}
```

Use for:
- Translating decision tree content
- Creating Spanish/French/Portuguese versions of templates
- Adapting case studies for international newsrooms

### 6.2 Language-Specific Skills

Create skills for each target language:

```markdown
---
name: spanish-translator
language: spanish
---

# Spanish Translation Skill

Translate LLM Advisor content maintaining:
- Journalism terminology accuracy
- Latin American vs. Castilian preferences
- Cultural context in case studies
```

---

## 7. Plan Mode Workflows

### 7.1 /plan for Complex Features

**Feature Used:** `/plan` command, plan mode rejection feedback

Use plan mode for multi-file changes:

```
User: I want to add a "Verification Tools" category to the LLM Advisor

/plan

[Claude enters plan mode]
[Explores codebase thoroughly]
[Writes plan to plan.md]
[User reviews and requests changes]
[Plan is refined before implementation]
```

### 7.2 Shift+Tab for Rapid Prototyping

**Feature Used:** Shift+Tab auto-accept edits in plan mode

For quick iterations on template designs:

1. Enter plan mode
2. Press Shift+Tab to enable auto-accept
3. Rapidly iterate on template structure
4. Review all changes at once

---

## 8. Agent-Scoped Development

### 8.1 Specialized Development Agents

**Feature Used:** `--agent` flag, `agent_type` in hooks

Create focused development sessions:

```bash
# JSON content editing only
claude --agent json-editor

# Theme development only
claude --agent theme-developer

# Template maintenance
claude --agent template-maintainer
```

### 8.2 Agent Hooks for Specialized Validation

**Feature Used:** Agent-scoped hooks

```yaml
# .claude/hooks/agent-json-editor.yml
hooks:
  - type: PostToolUse
    agent: json-editor
    tool: Edit
    command: |
      # Extra strict JSON validation for json-editor agent
      node scripts/deep-validate-json.js
```

---

## 9. LSP Integration

### 9.1 JavaScript Navigation for app.js

**Feature Used:** LSP tool for go-to-definition, find references

Use LSP for navigating the 573-line LLM Advisor app.js:

```
# Find all references to showModal function
LSP: find-references showModal

# Go to definition of handleDecisionClick
LSP: go-to-definition handleDecisionClick

# Get hover documentation for event handlers
LSP: hover addEventListener
```

### 9.2 CSS Variable Tracking

Use LSP for tracking Amditis theme variables:

```
# Find all uses of --acid color
LSP: find-references --acid

# Track theme variable cascade
LSP: go-to-definition bg-void
```

---

## 10. Tool Restrictions

### 10.1 Content-Only Sessions

**Feature Used:** `--tools` flag, `--disallowedTools`

For journalists reviewing content without code changes:

```bash
# Read-only exploration
claude --tools Read,Glob,Grep

# No file modifications allowed
claude --disallowedTools Edit,Write,Bash
```

### 10.2 Disable Specific Agents

**Feature Used:** `Task(AgentName)` syntax for disabling

```json
{
  "disallowedTools": [
    "Task(general-purpose)",
    "Bash"
  ]
}
```

Use for controlled template editing sessions.

---

## Implementation Priority

### Phase 1: Immediate Value (This Week)
1. Session start hook for development environment
2. Model name validator hook
3. Named sessions for feature branches
4. Background server workflow

### Phase 2: Enhanced Workflow (Next 2 Weeks)
5. JSON schema validation hooks
6. Forked context skills for parallel audits
7. Plan mode for complex features
8. Agent-scoped development

### Phase 3: Advanced Integration (Month 2)
9. MCP server for LLM Advisor data
10. LSP integration for app.js navigation
11. Multi-language skill variants
12. Automated deployment hooks

---

## Quick Reference: New Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Alt+T | Toggle thinking mode |
| Alt+P | Switch models mid-prompt |
| Shift+Tab | Auto-accept edits (plan mode) |
| Ctrl+B | Background all foreground tasks |
| ; / , | Repeat f/F/t/T vim motions |

---

## Files to Create

Based on these proposals, the following files should be created:

```
.claude/
├── hooks/
│   ├── model-validator.yml
│   ├── theme-validator.yml
│   ├── json-validator.yml
│   ├── deploy-reminder.yml
│   └── session-start.yml
├── skills/
│   ├── content-auditor.md (context: fork)
│   ├── template-factory.md (context: fork)
│   ├── multi-export.md (context: fork)
│   └── spanish-translator.md
└── settings.local.json (updated with MCP, permissions)

mcp-servers/
├── llm-advisor-data/
│   └── index.js
└── amditis-theme/
    └── index.js

scripts/
├── validate-all-json.js
└── deep-validate-json.js
```

---

*Generated for the Amditis Resource Kit project based on Claude Code v2.1.0-2.1.2 changelog analysis.*
