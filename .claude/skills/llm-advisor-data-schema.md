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

**Tool names are foreign keys.** Every reference to a tool must exactly match a key in `model-info.json`. Case sensitivity and spacing matter: "Claude 4.5 Opus" ≠ "Claude 4.5 opus".

## File locations

All data files: `/resource-kit/docs/llm-advisor/data/`

| File | Lines | Purpose |
|------|-------|---------|
| `decision-tree.json` | 627 | Navigation graph |
| `model-info.json` | 154 | Tool descriptions |
| `tool-comparison.json` | 244 | Strengths/weaknesses |
| `case-studies.json` | 119 | Real-world examples |
| `best-practices.json` | 43 | Guidance content |
| `changelog.json` | 37 | Version history |

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
        "track": "Required - research|content|data|editing|sources|multimedia",
        "tools": "Conditional - Required if next='recommendation'"
      }
    ]
  }
}
```

**Validation rules:**
- Every `next` value must be a valid nodeId or "recommendation"
- When `next` = "recommendation", `tools` array is required
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
  "tool": "Required - Must match model-info.json key",
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

## Valid tool names (December 2025)

Copy-paste these exactly:

```
Claude 4.5 Opus
Claude 4.5 Sonnet
Gemini 3.0 Pro
Gemini 3.0 Flash
Codex (GPT 5.1)
GPT 5.1
Perplexity
ElevenLabs
Midjourney
NotebookLM
Grok
DeepSeek
Mistral
```

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

// Check case-studies.json
caseStudies.forEach((study, i) => {
    if (!modelKeys.includes(study.tool)) {
        console.error(`case-studies[${i}]: Unknown tool: ${study.tool}`);
    }
});

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
*Skill version: 1.1 | Updated: December 2025*
