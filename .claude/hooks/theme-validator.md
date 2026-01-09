---
hooks:
  - type: PreToolUse
    tool: Edit
    command: |
      NEW_CONTENT="${CLAUDE_TOOL_INPUT_NEW_STRING:-}"
      FILE="${CLAUDE_TOOL_INPUT_FILE_PATH:-}"

      # Only check CSS and HTML files
      if [[ "$FILE" == *.css ]] || [[ "$FILE" == *.html ]]; then
        # Check for forbidden light theme classes
        FORBIDDEN=$(echo "$NEW_CONTENT" | grep -oE "bg-light-[a-z]+|dark:bg-dark-[a-z]+|bg-accent-[a-z]+" || true)

        if [ -n "$FORBIDDEN" ]; then
          echo ""
          echo "🚫 BLOCKED: Light theme classes detected"
          echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
          echo "Found: $FORBIDDEN"
          echo ""
          echo "📋 Use Amditis dark theme classes instead:"
          echo ""
          echo "Backgrounds:"
          echo "   bg-void     (#050505) - deepest black"
          echo "   bg-panel    (#0a0a0a) - cards/panels"
          echo "   bg-surface  (#111111) - interactive"
          echo ""
          echo "Text:"
          echo "   text-chrome (#e8e8e8) - primary"
          echo "   text-gray-400/500/600 - secondary"
          echo ""
          echo "Accents:"
          echo "   text-acid / bg-acid   (#c8ff00) - primary green"
          echo "   text-ice / bg-ice     (#00f0ff) - blue"
          echo "   text-signal / bg-signal (#ff3366) - warning"
          echo ""
          exit 1
        fi
      fi
---

# Amditis Theme Validator Hook

Prevents accidental use of light theme classes in CSS/HTML files.

## Blocked Patterns

- `bg-light-*` - Light background classes
- `dark:bg-dark-*` - Dark mode toggle classes
- `bg-accent-*` - Generic accent classes

## Amditis Theme System

This is a single dark theme - no light/dark toggle.

### Backgrounds
| Class | Hex | Use |
|-------|-----|-----|
| `bg-void` | #050505 | Deepest black |
| `bg-panel` | #0a0a0a | Cards/panels |
| `bg-surface` | #111111 | Interactive |

### Text
| Class | Hex | Use |
|-------|-----|-----|
| `text-chrome` | #e8e8e8 | Primary |
| `text-gray-400` | - | Secondary |
| `text-gray-500` | - | Tertiary |

### Accents
| Class | Hex | Use |
|-------|-----|-----|
| `text-acid` | #c8ff00 | Primary accent |
| `text-ice` | #00f0ff | Secondary accent |
| `text-signal` | #ff3366 | Warning/error |

### Borders
Always use: `border-white/10` or `border-white/5`
