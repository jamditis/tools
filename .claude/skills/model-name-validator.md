# Model Name Validator

AI model names change constantly. Use current names consistently across all content. A typo or outdated name breaks trust and causes silent failures in the LLM Advisor.

## Current naming (December 2025)

| Company | Correct Name | Never Use |
|---------|-------------|-----------|
| Anthropic | **Claude 4.5 Opus** | Claude 4 Opus, Claude Opus, Opus 4.5 |
| Anthropic | **Claude 4.5 Sonnet** | Claude 4 Sonnet, Claude Sonnet, Sonnet 4.5 |
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

**First mention:** Use full name
> Claude 4.5 Opus is best for complex coding tasks.

**Subsequent mentions:** Can shorten
> Claude excels at understanding context. Opus handles the longest documents.

**With parenthetical:** Only when clarifying
> Codex (GPT 5.1) is OpenAI's coding-focused model.

**Never abbreviate to:**
- C4O, C4S (for Claude)
- G3P, G3F (for Gemini)
- GPT (alone, without version)

## Files that must stay consistent

When updating model names, check ALL of these:

```
/resource-kit/docs/llm-advisor/data/
├── model-info.json         ← Source of truth
├── tool-comparison.json    ← Must match model-info.json keys
├── case-studies.json       ← "tool" field must match
├── decision-tree.json      ← "tools" arrays must match
├── best-practices.json     ← May reference models
└── changelog.json          ← Historical, don't change old entries

/resource-kit/docs/downloads/
└── LLM-COMPARISON.md       ← Must match current names

/resource-kit/markdown/
└── vibe-coding-guide.md    ← Model recommendations section
```

## Update process

When a model version changes (e.g., Gemini 2.5 → Gemini 3.0):

1. **Update source of truth first:**
   - Edit `model-info.json` - change the key name
   - Edit `tool-comparison.json` - change the key name

2. **Search all files for old name:**
   ```bash
   grep -r "Gemini 2.5" resource-kit/
   grep -r "Gemini 2.5" *.md
   ```

3. **Replace systematically:**
   - Update each file found
   - Don't change historical changelog entries

4. **Update color mapping if needed:**
   - Check `app.js` ~line 68 `getPillClasses()`
   - Ensure new name matches color logic

5. **Add changelog entry:**
   - Add version entry to `changelog.json`
   - Note the model name update

## Cross-reference validation

Before committing changes involving model names:

```javascript
// Pseudo-validation: all tool references should exist in model-info.json
const modelInfoKeys = Object.keys(modelInfo);

// Check decision-tree.json
decisionTree.forEach(node => {
  node.options?.forEach(opt => {
    opt.tools?.forEach(toolSet => {
      toolSet.tools.forEach(toolName => {
        if (!modelInfoKeys.some(key => toolName.includes(key))) {
          console.error(`Unknown tool: ${toolName}`);
        }
      });
    });
  });
});

// Check case-studies.json
caseStudies.forEach(study => {
  if (!modelInfoKeys.includes(study.tool)) {
    console.error(`Unknown tool in case study: ${study.tool}`);
  }
});
```

## Common mistakes

| Mistake | Correct |
|---------|---------|
| "Claude 4 Opus" | Claude 4.5 Opus |
| "GPT-4o" | GPT 5.1 |
| "Gemini Pro" | Gemini 3.0 Pro |
| "ChatGPT" | GPT 5.1 (or specify the interface) |
| "Claude" (alone in data) | Claude 4.5 Opus or Claude 4.5 Sonnet |
| "Anthropic Claude" | Claude 4.5 Opus |

## When new models release

1. Research official naming (check company announcements)
2. Add to `model-info.json` with description, features, link
3. Add to `tool-comparison.json` with strengths, weaknesses, bestFor, pricing
4. Add color mapping to `app.js` if needed
5. Update this skill file with new entry
6. Consider adding to decision tree if it fits a use case

## Version history pattern

When models get version bumps, the old version becomes "never use":

- Gemini 2.5 Pro → Never use (now Gemini 3.0 Pro)
- GPT-4o → Never use (now GPT 5.1)
- Claude 4 Opus → Never use (now Claude 4.5 Opus)

Old names should only appear in historical changelog entries, never in current recommendations.
