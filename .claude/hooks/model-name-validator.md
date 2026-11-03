---
hooks:
  - type: PostToolUse
    tool: Edit
    command: |
      FILE="${CLAUDE_TOOL_INPUT_FILE_PATH:-}"

      # Only check relevant files
      if [[ "$FILE" == *.json ]] || [[ "$FILE" == *.html ]] || [[ "$FILE" == *.md ]]; then
        # Check for outdated model names
        OUTDATED=$(grep -nE "Claude 4 Opus|Claude 3|Claude 4\.5 Opus|Claude 4\.5 Sonnet|Claude Opus 4\.6|GPT-4o|GPT-4|GPT 5\.1|GPT 5\.2|Gemini 3\.0|Gemini 2\.|Gemini 1\." "$FILE" 2>/dev/null || true)

        if [ -n "$OUTDATED" ]; then
          echo ""
          echo "⚠️  OUTDATED MODEL NAMES DETECTED"
          echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
          echo "$OUTDATED"
          echo ""
          echo "Check current catalog keys and provider verification dates:"
          echo "resource-kit/docs/llm-advisor/data/model-info.json"
          echo "resource-kit/docs/downloads/AI-MODEL-SOURCE-REGISTER.md"
          echo ""
        fi
      fi
---

# Model Name Validator Hook

Automatically checks edited files for outdated AI model names.

## Current model names

Read the exact keys in `resource-kit/docs/llm-advisor/data/model-info.json`.
Use `resource-kit/docs/downloads/AI-MODEL-SOURCE-REGISTER.md` for provider
sources and verification dates. The November 2, 2026 refresh supersedes the
June model list previously printed by this hook.

This hook uses legacy patterns and warns only; it is not a complete freshness
check. It may flag valid historical examples. Preserve case studies, old
changelog entries, plans, and archives. The hosted Content checks workflow
runs the maintained content and JSON checks.

## Outdated Names (flagged)

- Claude 4 Opus, Claude 3.x
- GPT-4o, GPT-4
- Gemini 2.x, Gemini 1.x

## Files Checked

- `.json` - LLM Advisor data files
- `.html` - Web pages
- `.md` - Documentation and templates
