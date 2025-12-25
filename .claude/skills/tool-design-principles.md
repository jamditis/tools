---
name: tool-design-principles
description: Design effective JSON data structures and tool interfaces for the LLM Advisor. Activate when creating new data schemas or modifying existing structures.
---

# Tool Design Principles

Tools are contracts between deterministic systems (your code) and non-deterministic agents (Claude). This skill teaches how to design effective data structures and interfaces.

## When to activate

- Creating new JSON data structures
- Modifying existing schemas
- Adding new features to LLM Advisor
- Debugging "why doesn't Claude use this correctly?"
- Standardizing data conventions

## Core concept

**Tools should be self-documenting.** An agent reading your JSON schema should understand what it contains, when to use each field, and what format to provide without asking clarifying questions.

## Four questions every schema must answer

1. **What** does this data represent?
2. **When** should this data be used?
3. **What fields** are required vs optional?
4. **What format** does each field expect?

## Schema design patterns

### Pattern 1: Explicit over implicit

```json
// ❌ Implicit - requires knowledge of conventions
{
  "name": "Claude",
  "type": 1,
  "status": true
}

// ✅ Explicit - self-documenting
{
  "name": "Claude 4.5 Opus",
  "type": "chat-model",
  "isActive": true,
  "activeSince": "2024-03-01"
}
```

### Pattern 2: Flat over nested (when possible)

```json
// ❌ Deeply nested - hard to query
{
  "model": {
    "details": {
      "pricing": {
        "tier": "premium"
      }
    }
  }
}

// ✅ Flat - easy to access
{
  "modelName": "Claude 4.5 Opus",
  "pricingTier": "premium"
}
```

### Pattern 3: Arrays for collections, objects for entities

```json
// ✅ Array for list of similar items
"features": ["coding", "writing", "analysis"]

// ✅ Object for structured entity
"pricing": {
  "tier": "premium",
  "monthlyUSD": 20
}
```

### Pattern 4: Consistent naming conventions

| Convention | Example | Use For |
|------------|---------|---------|
| camelCase | `modelName` | Object keys |
| SCREAMING_SNAKE | `MAX_TOKENS` | Constants |
| kebab-case | `decision-tree.json` | File names |
| Sentence case | `"Best for coding"` | Display text |

## Field type guidelines

| Field Purpose | Type | Example |
|---------------|------|---------|
| Identifiers | string | `"claude-4-opus"` |
| Display names | string | `"Claude 4.5 Opus"` |
| Descriptions | string | `"Best for complex tasks"` |
| Lists of items | array | `["coding", "writing"]` |
| Yes/no flags | boolean | `true` |
| Counts | number | `200000` |
| URLs | string (validated) | `"https://..."` |
| Dates | string (ISO) | `"2024-03-01"` |

## Designing for the LLM Advisor

### Decision tree nodes

```json
{
  "nodeId": {
    "question": "Required - shown to user",
    "options": [
      {
        "text": "Required - button label",
        "next": "Required - nodeId or 'recommendation'",
        "track": "Required - for color coding",
        "tools": "Required if next='recommendation'"
      }
    ]
  }
}
```

**Design decisions:**
- `question` is user-facing, so use natural language
- `next` creates the graph structure—must be valid nodeId
- `track` enables theming without coupling to colors
- `tools` only present at terminal nodes

### Tool recommendations

```json
{
  "name": "Workflow name",
  "description": "What this workflow does",
  "tools": ["Model names - must match model-info.json"],
  "prompt": "Sample prompt template",
  "tips": "Optional pro tip"
}
```

**Design decisions:**
- `tools` references external data (model-info.json)
- `prompt` gives users a starting point
- `tips` is optional enhancement

## Consolidation principle

**Prefer fewer, richer structures over many narrow ones.**

```json
// ❌ Fragmented - 3 lookups needed
models.json: { "claude": { "id": "claude" } }
descriptions.json: { "claude": "Best for..." }
pricing.json: { "claude": "Premium" }

// ✅ Consolidated - 1 lookup
model-info.json: {
  "Claude 4.5 Opus": {
    "description": "Best for...",
    "features": [...],
    "link": "..."
  }
}
```

## Error prevention

### Required field validation

```javascript
const REQUIRED_MODEL_FIELDS = ['description', 'features', 'link'];

function validateModel(name, data) {
    const missing = REQUIRED_MODEL_FIELDS.filter(f => !data[f]);
    if (missing.length) {
        throw new Error(`${name} missing: ${missing.join(', ')}`);
    }
}
```

### Cross-reference validation

```javascript
function validateCaseStudy(study, modelInfo) {
    if (!modelInfo[study.tool]) {
        throw new Error(`Unknown tool: ${study.tool}`);
    }
}
```

## Documentation pattern

For each JSON file, document:

```markdown
## filename.json

**Purpose:** What this file contains

**Schema:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name  | string | Yes | Display name |
| ...   | ...    | ... | ... |

**Example:**
```json
{ ... }
```

**Validation rules:**
- Field X must match keys in Y.json
- Field Z must be valid URL
```

## Trade-offs

| Choice | Advantage | Disadvantage |
|--------|-----------|--------------|
| Flat structure | Easy querying | Some duplication |
| Nested structure | No duplication | Complex access |
| String enums | Flexible | No compile-time checking |
| Separate files | Focused | Multiple loads |
| Single file | One load | Large payload |

## Related skills

- `llm-advisor-data-schema` - Specific schemas for this project
- `development-workflow` - Pipeline for making data changes
- `evaluation-framework` - Validating data integrity

---
*Skill version: 1.0 | Updated: December 2025*
