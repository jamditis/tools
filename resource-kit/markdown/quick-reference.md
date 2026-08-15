# AI tools for newsrooms — Quick reference

> Print this page or keep it open as a cheat sheet.

---

## Current agent starting points

> Verified August 15, 2026. Check vendor model and pricing pages before production use.

| Need | Model | Notes |
|------|-------|-------|
| Maximum-capability Anthropic work | Claude Fable 5 | Long-running difficult agents |
| Advanced Anthropic coding and reasoning | Claude Opus 5 | Deep, long-horizon work |
| Balanced Anthropic coding | Claude Sonnet 5 | Daily speed-quality choice |
| Current Google coding and agents | Gemini 3.7 Flash | New workhorse released August 13, 2026 |
| OpenAI coding | Codex (GPT-5.6 Sol) | Specialized for code |
| Balanced OpenAI agents | GPT-5.6 Terra | Daily capability, latency, and cost balance |
| High-throughput OpenAI tasks | GPT-5.6 Luna | Fastest GPT-5.6 tier |
| Highest hosted Qwen evaluation | Qwen 3.8 Max preview | Preview lifecycle can change |
| Stable hosted Qwen agents | Qwen 3.7 Plus | One-million-token context |
| Open-weight long-horizon agents | GLM-5.2 | Hosting and hardware required |
| Efficient local agentic coding | Qwen3.6-35B-A3B | About 3B active parameters |

---

## Language by task

| Task | Use |
|------|-----|
| Data cleaning/analysis | Python + pandas |
| Statistical analysis | R |
| Interactive visualizations | JavaScript + D3.js |
| Web scraping | Python + BeautifulSoup |
| File automation | Bash or Python |
| Database queries | SQL |

---

## The vibe coding workflow

```
1. DEFINE  →  Write exactly what "done" looks like
2. GENERATE →  AI writes first draft of code
3. TEST    →  Run it, expect errors
4. DEBUG   →  Paste error back to AI
5. ITERATE →  Repeat 3-4 until working
6. DOCUMENT →  Update changelog
```

---

## Prompting tips

**Do:**
- Include your environment (OS, language version)
- Show sample input/output data
- Ask for code in chunks, not all at once
- Explain the "why" not just the "what"

**Don't:**
- Accept code without testing it
- Ask for entire applications at once
- Skip error messages when debugging
- Forget to document what worked

---

## When code breaks

1. Copy the **full** error message
2. Paste to AI with context: "I ran X and got Y"
3. If same error 3x, step back and explain the goal
4. Check if it's environment vs code issue

---

## Common pitfalls

| Problem | Solution |
|---------|----------|
| Scope creep | Note the idea, stay focused |
| No documentation | Use changelog template |
| Blind trust | Always verify AI outputs |
| Going in circles | Try different LLM or rephrase |
| Over-engineering | Start simpler |

---

## Project structure

```
my-project/
├── CHANGELOG.md      ← Document every session
├── data/             ← Input files
├── output/           ← Generated results
├── scripts/          ← Your code
└── README.md         ← What this does
```

---

## Session checklist

**Before:**
- [ ] Specific goal defined
- [ ] Sample data ready
- [ ] Time limit set
- [ ] Changelog file created

**After:**
- [ ] Tested with real data
- [ ] Changelog updated
- [ ] Next steps noted
- [ ] Working state saved

---

## Resources

- **Guides:** centerforcooperativemedia.org/tools/llmadvisor/
- **Templates:** Available in this resource kit
- **Community:** NICAR-L, IRE Data Slack

---

*Center for Cooperative Media · joeamditis.com*
