---
hooks:
  - type: PostToolUse
    tool: Edit
    command: |
      FILE="${CLAUDE_TOOL_INPUT_FILE_PATH:-}"

      # Only check relevant files
      if [[ "$FILE" == *.json ]] || [[ "$FILE" == *.html ]] || [[ "$FILE" == *.md ]]; then
        # Check for outdated model names
        OUTDATED=$(grep -nE "Claude 4 Opus|Claude 3|Claude 4\.5 Opus|Claude 4\.5 Sonnet|GPT-4o|GPT-4|GPT 5\.1|GPT 5\.2|Gemini 3\.0|Gemini 2\.|Gemini 1\." "$FILE" 2>/dev/null || true)

        if [ -n "$OUTDATED" ]; then
          echo ""
          echo "⚠️  OUTDATED MODEL NAMES DETECTED"
          echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
          echo "$OUTDATED"
          echo ""
          echo "📋 Current names to use:"
          echo "   • Claude Opus 4.8"
          echo "   • Claude Sonnet 4.6"
          echo "   • Gemini 3.1 Pro"
          echo "   • Gemini 3.1 Flash"
          echo "   • GPT 5.5 / Codex (GPT 5.5)"
          echo ""
        fi
      fi
---

# Model Name Validator Hook

Automatically checks edited files for outdated AI model names.

## Correct Model Names

| Model | Correct Name |
|-------|-------------|
| Claude best | Claude Opus 4.8 |
| Claude fast | Claude Sonnet 4.6 |
| Gemini best | Gemini 3.1 Pro |
| Gemini fast | Gemini 3.1 Flash |
| OpenAI code | Codex (GPT 5.5) |
| OpenAI chat | GPT 5.5 |

## Outdated Names (flagged)

- Claude 4 Opus, Claude 3.x
- GPT-4o, GPT-4
- Gemini 2.x, Gemini 1.x

## Files Checked

- `.json` - LLM Advisor data files
- `.html` - Web pages
- `.md` - Documentation and templates
