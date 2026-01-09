---
hooks:
  - type: UserPromptSubmit
    once: true
    command: |
      echo ""
      echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
      echo "  🎨 AMDITIS RESOURCE KIT - DEV SESSION"
      echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
      echo ""

      # Check local server
      if curl -s http://localhost:8000 > /dev/null 2>&1; then
        echo "✅ Local server: http://localhost:8000"
      else
        echo "💡 Start server: cd resource-kit/docs && python -m http.server 8000"
      fi

      # Check deployment status
      echo ""
      if command -v gh &> /dev/null; then
        LAST_RUN=$(gh run list --limit 1 --json status,conclusion,displayTitle -q '.[0] | "\(.status): \(.displayTitle)"' 2>/dev/null)
        if [ -n "$LAST_RUN" ]; then
          echo "📦 Last deploy: $LAST_RUN"
        fi
      fi

      echo ""
      echo "Quick commands:"
      echo "  /plan     - Plan complex features"
      echo "  /rename   - Name this session"
      echo "  /stats    - View usage stats"
      echo ""
---

# Session Start Hook

This hook runs once at the start of each Claude Code session in the Amditis Resource Kit project.

## What it does

1. Displays development session banner
2. Checks if local development server is running
3. Shows last GitHub Pages deployment status
4. Provides quick command reminders

## Customization

To disable this hook, add to `.claude/settings.local.json`:

```json
{
  "hooks": {
    "disabled": ["session-start"]
  }
}
```
