# AI tools for newsrooms — Quick reference

> Print this page or keep it open as a cheat sheet.

---

## Best LLMs for coding (Dec 2025)

| Need | Model | Notes |
|------|-------|-------|
| Coding/writing | Claude 4.5 Opus | Best by far |
| Front-end design | Gemini 3.0 Pro | Best context window |
| OpenAI coding | Codex (GPT 5.1) | Specialized for code |
| Free option | Claude.ai free | Limited but capable |
| In-editor | GitHub Copilot | $10/mo, real-time |

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
