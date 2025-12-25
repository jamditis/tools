# LLM Advisor Data Schema Expert

Six JSON files power the LLM Advisor. They reference each other by tool name—consistency is critical. A typo in a tool name causes silent failures.

## File locations

All data files live in `/resource-kit/docs/llm-advisor/data/`:
- `decision-tree.json` (627 lines) - Navigation graph
- `model-info.json` (154 lines) - Tool descriptions
- `tool-comparison.json` (244 lines) - Strengths/weaknesses
- `case-studies.json` (119 lines) - Real-world examples
- `best-practices.json` (43 lines) - Guidance content
- `changelog.json` (37 lines) - Version history

## Schema: decision-tree.json

```json
{
  "nodeId": {
    "question": "Required - The question shown to user",
    "options": [
      {
        "text": "Required - Button label text",
        "next": "Required - Next nodeId OR 'recommendation'",
        "track": "Required - research|content|data|editing|sources|multimedia",
        "tools": "Optional - Required if next='recommendation'"
      }
    ]
  }
}
```

**Rules:**
- Every `nodeId` must be unique
- Every path must eventually reach `"next": "recommendation"`
- When `next` is `"recommendation"`, `tools` array is REQUIRED
- Valid tracks: `research`, `content`, `data`, `editing`, `sources`, `multimedia`

**Tools array structure (when present):**
```json
"tools": [{
  "name": "Required - Workflow name",
  "description": "Required - What this workflow does",
  "tools": ["Required - Array of model names"],
  "prompt": "Required - Sample prompt template",
  "tips": "Optional - Pro tip for users"
}]
```

## Schema: model-info.json

```json
{
  "Tool Name": {
    "description": "Required - 1-2 sentence description",
    "features": ["Required - Array of feature strings"],
    "link": "Required - Official URL"
  }
}
```

**Rules:**
- Keys are exact tool names (case-sensitive)
- All three fields are required
- `link` must be a valid URL

## Schema: tool-comparison.json

```json
{
  "Tool Name": {
    "strengths": ["Required - Array of strength strings"],
    "weaknesses": ["Required - Array of weakness strings"],
    "bestFor": ["Required - Array of use case strings"],
    "pricing": "Required - Pricing description string"
  }
}
```

**Rules:**
- Keys must EXACTLY match keys in `model-info.json`
- All four fields are required
- Arrays can't be empty

## Schema: case-studies.json

```json
[
  {
    "title": "Required - Case study title",
    "tool": "Required - Must match a key in model-info.json",
    "journalist": "Required - Name, Publication format",
    "challenge": "Required - The problem they faced",
    "solution": "Required - How they solved it",
    "quote": "Required - Direct quote from journalist",
    "tips": "Required - Key takeaway",
    "sourceUrl": "Required - Link to full article"
  }
]
```

**Rules:**
- Root is an ARRAY, not an object
- `tool` field must exactly match a key in `model-info.json`
- All 8 fields are required
- `sourceUrl` must be a valid URL

## Schema: best-practices.json

```json
{
  "general": {
    "corePrinciples": ["Array of strings"],
    "promptingTechniques": ["Array of strings"],
    "workflowIntegration": ["Array of strings"],
    "imagePrompting": ["Array of strings"],
    "ethicalGuidelines": ["Array of strings"],
    "gemini3Advanced": ["Array of strings"]
  }
}
```

## Schema: changelog.json

```json
[
  {
    "version": "Required - 'Month Day, Year' format",
    "notes": "Required - HTML string with changelog content"
  }
]
```

**Rules:**
- Root is an ARRAY
- Newest entries should be first
- `notes` can contain HTML tags

## Valid tool names (December 2025)

These are the ONLY valid tool names. Use EXACTLY as written:

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

When adding or updating data:

1. **New model?** Add to BOTH `model-info.json` AND `tool-comparison.json`
2. **New case study?** Ensure `tool` field matches a key in `model-info.json`
3. **New decision path?** Ensure all `tools` arrays use valid model names
4. **Renaming a model?** Search and replace in ALL 6 files

## Color mapping (app.js)

Tool names map to colors in `getPillClasses()`:
- Claude → Orange (#d9843b)
- Gemini → Teal (#369a8b)
- GPT/Codex → Slate
- Perplexity → Violet
- ElevenLabs → Emerald
- Midjourney → Indigo

If adding a new tool, also add its color mapping in app.js ~line 68.
