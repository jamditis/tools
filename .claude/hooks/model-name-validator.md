---
hooks:
  - type: PostToolUse
    tool: Edit
    command: |
      FILE="${CLAUDE_TOOL_INPUT_FILE_PATH:-}"

      # Only check relevant files
      if [[ "$FILE" == *.json ]] || [[ "$FILE" == *.html ]] || [[ "$FILE" == *.md ]]; then
        # Check for outdated model names
        OUTDATED=$(grep -nE "Claude 4 Opus|Claude 3|GPT-4o|GPT-4|Gemini 2\.|Gemini 1\." "$FILE" 2>/dev/null || true)

        if [ -n "$OUTDATED" ]; then
          echo ""
          echo "⚠️  OUTDATED MODEL NAMES DETECTED"
          echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
          echo "$OUTDATED"
          echo ""
          echo "📋 Current names to use:"
          echo "   • Claude 4.5 Opus"
          echo "   • Claude 4.5 Sonnet"
          echo "   • Gemini 3.0 Pro"
          echo "   • Gemini 3.0 Flash"
          echo "   • GPT 5.1 / Codex (GPT 5.1)"
          echo ""
        fi
      fi
---

# Model Name Validator Hook

Automatically checks edited files for outdated AI model names.

## Correct Model Names

| Model | Correct Name |
|-------|-------------|
| Claude best | Claude 4.5 Opus |
| Claude fast | Claude 4.5 Sonnet |
| Gemini best | Gemini 3.0 Pro |
| Gemini fast | Gemini 3.0 Flash |
| OpenAI code | Codex (GPT 5.1) |
| OpenAI chat | GPT 5.1 |

## Outdated Names (flagged)

- Claude 4 Opus, Claude 3.x
- GPT-4o, GPT-4
- Gemini 2.x, Gemini 1.x

## Files Checked

- `.json` - LLM Advisor data files
- `.html` - Web pages
- `.md` - Documentation and templates
