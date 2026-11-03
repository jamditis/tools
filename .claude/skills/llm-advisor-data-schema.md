---
name: llm-advisor-data-schema
description: Validate JSON data structures for the LLM Advisor. Activate when creating, editing, or debugging data in the advisor's JSON files.
---

# LLM Advisor Data Schema Expert

Six JSON files power the LLM Advisor. They reference each other by tool name—consistency is critical. A typo in a tool name causes silent failures.

## When to activate

- Adding new models, tools, or case studies
- Editing decision tree paths
- Debugging "tool not found" or empty UI errors
- Validating data integrity after changes
- Reviewing PRs that modify JSON files

## Core concept

**Tool names are foreign keys.** Every reference to a tool must exactly match a key in `model-info.json`. Case sensitivity and spacing matter: "Claude Opus 5.5" ≠ "Claude 5.5 Opus".

## File locations

All data files: `/resource-kit/docs/llm-advisor/data/`

| File | Purpose |
|------|---------|
| `decision-tree.json` | Navigation graph |
| `model-info.json` | Tool descriptions and catalog keys |
| `tool-comparison.json` | Strengths, weaknesses, pricing |
| `case-studies.json` | Historical real-world examples |
| `best-practices.json` | Guidance content |
| `changelog.json` | Version history |

The shipped JSON and `mcp-servers/llm-advisor-data/README.md` are the source
for current shapes and write validation; the examples below are abbreviated.

## Schemas

### decision-tree.json

```json
{
  "nodeId": {
    "question": "Required - User-facing question",
    "options": [
      {
        "text": "Required - Button label",
        "next": "Required - nodeId or 'recommendation'",
        "track": "Optional - workflow track string",
        "tools": "Conditional - Required if next='recommendation'"
      }
    ]
  }
}
```

**Validation rules:**
- Every `next` value must be a valid nodeId or "recommendation"
- When `next` = "recommendation", a nonempty `tools` array is required
- Any present `tools` array must be nonempty, including on intermediate options
- Each recommendation needs nonblank `name`, `description`, and `prompt`, plus a nonempty array of model-name strings in `tools`; `tips` is optional
- All paths must eventually reach "recommendation"

### model-info.json

```json
{
  "Tool Name": {
    "description": "Required - 1-2 sentence description",
    "features": ["Required - Array of feature strings"],
    "link": "Required - Official URL"
  }
}
```

### tool-comparison.json

```json
{
  "Tool Name": {
    "strengths": ["Required - Array"],
    "weaknesses": ["Required - Array"],
    "bestFor": ["Required - Array"],
    "pricing": "Required - String"
  }
}
```

**Rule:** Keys must exactly match `model-info.json` keys.

### case-studies.json

```json
[{
  "title": "Required",
  "tool": "Required - Historical model or tool name",
  "journalist": "Required - Name, Publication",
  "challenge": "Required",
  "solution": "Required",
  "quote": "Required",
  "tips": "Required",
  "sourceUrl": "Required - Valid URL"
}]
```

### best-practices.json

```json
{
  "general": {
    "corePrinciples": ["Array"],
    "promptingTechniques": ["Array"],
    "workflowIntegration": ["Array"],
    "imagePrompting": ["Array"],
    "ethicalGuidelines": ["Array"],
    "gemini3Advanced": ["Array"]
  }
}
```

### changelog.json

```json
[{
  "version": "Required - 'Month Day, Year' format",
  "notes": "Required - HTML string"
}]
```

## Valid tool names

Read the exact keys from `resource-kit/docs/llm-advisor/data/model-info.json`
rather than copying a versioned list from this document. Provider sources and
verification dates are in `resource-kit/docs/downloads/AI-MODEL-SOURCE-REGISTER.md`.
Active guidance was refreshed November 2, 2026; historical case studies and
changelog entries retain their original names.

## Cross-file validation

```javascript
// Validate all tool references
const modelKeys = Object.keys(modelInfo);

// Check tool-comparison.json
Object.keys(toolComparison).forEach(key => {
    if (!modelKeys.includes(key)) {
        console.error(`tool-comparison: Unknown key: ${key}`);
    }
});

// Historical case study names are preserved.

// Check decision-tree.json
Object.entries(decisionTree).forEach(([nodeId, node]) => {
    node.options?.forEach((opt, i) => {
        opt.tools?.forEach(toolSet => {
            toolSet.tools?.forEach(tool => {
                // Tool names in arrays should match modelKeys
                const match = modelKeys.find(k => tool.includes(k));
                if (!match) {
                    console.error(`decision-tree[${nodeId}][${i}]: Unknown tool: ${tool}`);
                }
            });
        });
    });
});
```

## Color mapping

Tool names map to colors in `app.js` `getPillClasses()`:

| Pattern | Color | Class |
|---------|-------|-------|
| Claude | Orange | `bg-[#d9843b]` |
| Gemini | Teal | `bg-[#369a8b]` |
| GPT/Codex | Slate | `bg-slate-500` |
| Perplexity | Violet | `bg-violet-500` |
| ElevenLabs | Emerald | `bg-emerald-500` |
| Midjourney | Indigo | `bg-indigo-600` |
| DeepSeek | Purple | `bg-[#615EFC]` |

**Adding new tool?** Also add color mapping in `app.js` ~line 68.

## Failure modes

| Failure | Symptom | Cause |
|---------|---------|-------|
| Blank recommendation | No tools shown | Invalid tool name or missing `tools` array |
| Wrong color pill | Gray instead of brand color | Name doesn't match `getPillClasses()` pattern |
| Missing case study | Not in modal | `tool` field doesn't match model-info key |
| Dead-end path | User gets stuck | `next` points to non-existent nodeId |
| Parse error | Page won't load | Invalid JSON syntax |

## Quick validation

```bash
# Check JSON syntax
cat data/model-info.json | jq .
cat data/tool-comparison.json | jq .
cat data/case-studies.json | jq .
cat data/decision-tree.json | jq .

# If jq isn't available, paste into jsonlint.com
```

## Related skills

- `tool-design-principles` - Schema design patterns
- `development-workflow` - Pipeline for making data changes
- `model-name-validator` - Current model naming conventions

---
*Documentation refreshed November 2, 2026.*
