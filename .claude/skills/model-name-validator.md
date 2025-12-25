---
name: model-name-validator
description: Use current AI model names consistently. Activate when writing about models, adding tools to data files, or reviewing content accuracy.
---

# Model Name Validator

AI model names change constantly. Use current names consistently across all content to maintain trust and prevent data mismatches.

## When to activate

- Writing about AI models in any content
- Adding new tools to JSON data files
- Reviewing PRs for naming accuracy
- Updating after model version changes
- Cross-referencing tool names across files

## Core concept

**Model names are foreign keys.** Every reference must match exactly. "Claude 4.5 Opus" ≠ "Claude Opus 4.5" ≠ "Claude 4.5 opus". One typo breaks the comparison modal.

## Current naming (December 2025)

| Company | Correct Name | Never Use |
|---------|-------------|-----------|
| Anthropic | **Claude 4.5 Opus** | Claude 4 Opus, Claude Opus, Opus |
| Anthropic | **Claude 4.5 Sonnet** | Claude 4 Sonnet, Claude Sonnet |
| Google | **Gemini 3.0 Pro** | Gemini 2.x, Gemini Pro, Gemini Advanced |
| Google | **Gemini 3.0 Flash** | Gemini 2.x Flash, Gemini Flash |
| OpenAI | **Codex (GPT 5.1)** | Codex CLI, just "Codex" |
| OpenAI | **GPT 5.1** | GPT-4, GPT-4o, GPT-4 Turbo, ChatGPT |
| xAI | **Grok** | Grok 2, Grok-2 |
| DeepSeek | **DeepSeek** | DeepSeek V2, DeepSeek-V3 |
| Mistral | **Mistral** | Mistral Large, Mixtral |
| Perplexity | **Perplexity** | Perplexity AI |
| Google | **NotebookLM** | Notebook LM, NotebookLM Plus |
| ElevenLabs | **ElevenLabs** | Eleven Labs, 11 Labs |
| Midjourney | **Midjourney** | MidJourney, Mid Journey |

## Writing conventions

**First mention:** Full name
> Claude 4.5 Opus is best for complex coding tasks.

**Subsequent:** Can shorten
> Claude excels at context. Opus handles long documents.

**With parenthetical:** Only when clarifying
> Codex (GPT 5.1) is OpenAI's coding-focused model.

**Never abbreviate to:** C4O, C4S, G3P, GPT (alone)

## Files requiring consistency

When updating model names, check ALL:

```
/resource-kit/docs/llm-advisor/data/
├── model-info.json         ← Source of truth
├── tool-comparison.json    ← Keys must match model-info
├── case-studies.json       ← "tool" field must match
├── decision-tree.json      ← "tools" arrays must match
├── best-practices.json     ← May reference models
└── changelog.json          ← Historical (don't change old)

/resource-kit/docs/downloads/
└── LLM-COMPARISON.md

/resource-kit/markdown/
└── vibe-coding-guide.md
```

## Update procedure

When a model version changes (e.g., Gemini 2.5 → Gemini 3.0):

```bash
# 1. Update source of truth
# Edit model-info.json - change key name
# Edit tool-comparison.json - change key name

# 2. Search for old name
grep -r "Gemini 2.5" resource-kit/
grep -r "Gemini 2.5" *.md

# 3. Replace in each file found
# (Don't change historical changelog entries)

# 4. Update color mapping if needed
# Check app.js ~line 68 getPillClasses()

# 5. Add changelog entry
# Add version entry to changelog.json
```

## Cross-reference validation

```javascript
// Quick validation script
const modelKeys = Object.keys(modelInfo);

// Check every case study tool reference
caseStudies.forEach((study, i) => {
    if (!modelKeys.includes(study.tool)) {
        console.error(`Case study ${i}: Unknown tool "${study.tool}"`);
        console.log(`  Did you mean: ${modelKeys.find(k =>
            k.toLowerCase().includes(study.tool.toLowerCase().split(' ')[0])
        )}?`);
    }
});
```

## Common mistakes

| Mistake | Correct |
|---------|---------|
| "Claude 4 Opus" | Claude 4.5 Opus |
| "GPT-4o" | GPT 5.1 |
| "Gemini Pro" | Gemini 3.0 Pro |
| "ChatGPT" | GPT 5.1 |
| "Claude" (in data files) | Claude 4.5 Opus or Claude 4.5 Sonnet |
| "Anthropic Claude" | Claude 4.5 Opus |

## When new models release

1. **Research:** Check official announcement for exact name
2. **Add to model-info.json:** description, features, link
3. **Add to tool-comparison.json:** strengths, weaknesses, bestFor, pricing
4. **Add color mapping:** Update `getPillClasses()` in app.js
5. **Update this skill:** Add to current naming table
6. **Consider decision tree:** Add to relevant recommendations

## Version history tracking

Old versions become "never use":
- Gemini 2.5 Pro → Gemini 3.0 Pro
- GPT-4o → GPT 5.1
- Claude 4 Opus → Claude 4.5 Opus

Old names only appear in historical changelog entries.

## Related skills

- `llm-advisor-data-schema` - Full schema validation
- `development-workflow` - Process for making updates
- `evaluation-framework` - Testing after changes

---
*Skill version: 1.1 | Updated: December 2025*
