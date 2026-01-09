---
hooks:
  - type: PostToolUse
    tool: [Edit, Write]
    command: |
      FILE="${CLAUDE_TOOL_INPUT_FILE_PATH:-}"

      # Only validate JSON files in llm-advisor/data
      if [[ "$FILE" == *llm-advisor/data/*.json ]]; then
        echo ""
        echo "🔍 Validating JSON: $(basename "$FILE")"

        # Check JSON syntax
        if node -e "JSON.parse(require('fs').readFileSync('$FILE', 'utf8'))" 2>/dev/null; then
          echo "✅ JSON syntax valid"

          # Additional schema checks based on file type
          FILENAME=$(basename "$FILE")
          case "$FILENAME" in
            decision-tree.json)
              # Check for required 'start' node
              if node -e "const d=JSON.parse(require('fs').readFileSync('$FILE','utf8')); if(!d.start)process.exit(1)" 2>/dev/null; then
                echo "✅ Has 'start' node"
              else
                echo "⚠️  Missing required 'start' node"
              fi
              ;;
            model-info.json)
              # Check for required model entries
              MODELS=$(node -e "console.log(Object.keys(JSON.parse(require('fs').readFileSync('$FILE','utf8'))).join(', '))" 2>/dev/null)
              echo "📋 Models defined: $MODELS"
              ;;
            case-studies.json)
              # Count case studies
              COUNT=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$FILE','utf8')).length)" 2>/dev/null)
              echo "📋 Case studies: $COUNT"
              ;;
          esac
        else
          echo "❌ INVALID JSON SYNTAX"
          echo "Fix the JSON before continuing"
          exit 1
        fi
        echo ""
      fi
---

# JSON Validator Hook

Automatically validates LLM Advisor JSON data files after modification.

## Validated Files

Located in `resource-kit/docs/llm-advisor/data/`:

| File | Validation |
|------|------------|
| `decision-tree.json` | Syntax + 'start' node required |
| `model-info.json` | Syntax + lists defined models |
| `case-studies.json` | Syntax + counts entries |
| `tool-comparison.json` | Syntax only |
| `best-practices.json` | Syntax only |
| `changelog.json` | Syntax only |

## Error Handling

- **Valid JSON**: Shows confirmation + schema-specific info
- **Invalid JSON**: Blocks and displays error

## Exit Codes

- `0` - Valid JSON, proceed normally
- `1` - Invalid JSON, blocks further processing
