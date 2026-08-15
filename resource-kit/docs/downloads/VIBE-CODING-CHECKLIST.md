# Vibe coding quick start checklist

Pre-flight checklist for AI-assisted coding sessions. Print this out or keep it open during your first few projects.

---

## Before you start

- [ ] **Define a specific goal** — Write down exactly what "done" looks like in one sentence
- [ ] **Gather your data** — Have sample files ready, know your data format
- [ ] **Choose your LLM** — Pick one and stick with it for this session
- [ ] **Install a CLI tool (if batch/file work)** — `npm install -g @anthropic-ai/claude-code` or `npm install -g @google/gemini-cli`
- [ ] **Create a context file** — Add a CLAUDE.md or GEMINI.md with your beat basics
- [ ] **Create project folder** — Clear name, organized structure
- [ ] **Start a changelog** — Use the CHANGELOG-TEMPLATE.md file
- [ ] **Test your environment** — Can you run "Hello World" in your language of choice?
- [ ] **Set a time limit** — Protect yourself from rabbit holes

---

## During the session

### Prompting best practices

- [ ] Start with the big picture, then drill into details
- [ ] Include your environment info (OS, language version, key libraries)
- [ ] Provide sample input/output when possible
- [ ] Ask for code in chunks, not all at once
- [ ] When stuck, ask "What might be causing this?" not just "Fix this"

### When code breaks

- [ ] Copy the **full error message**, not just the last line
- [ ] Paste it back to the AI with context: "I ran this code and got this error"
- [ ] If same error 3+ times, step back and explain the bigger goal
- [ ] Check if the error is your environment, not the code

### Red flags

- [ ] Code getting too complex? Split into smaller scripts
- [ ] Scope creeping? Note the new idea for later, stay focused
- [ ] Going in circles? Take a break, return with fresh eyes
- [ ] AI giving same wrong answer? Try rephrasing or different LLM

---

## Before you stop

- [ ] **Test with real data** — Not just the sample
- [ ] **Document what you built** — Update the changelog
- [ ] **Note what's unfinished** — Clear next steps for future you
- [ ] **Save working state** — Commit to git or backup the folder
- [ ] **Clean up** — Remove test files, add comments to unclear code

---

## Quick reference

### When to use which language

| Task | Language |
|------|----------|
| Data cleaning/analysis | Python |
| Statistical analysis | R |
| Interactive web visualization | JavaScript |
| File automation | Bash/Python |
| Database queries | SQL |

### Current agent model starting points

> Verified August 15, 2026. Check vendor model, lifecycle, plan, and pricing pages before production use.

| Need | Recommendation |
|------|----------------|
| Maximum-capability Anthropic work | Claude Fable 5 |
| Advanced Anthropic coding and reasoning | Claude Opus 5 |
| Balanced daily agents | Claude Sonnet 5 |
| Current Google coding and agents | Gemini 3.7 Flash |
| OpenAI coding tasks | Codex (GPT-5.6 Sol) |
| Balanced OpenAI agents | GPT-5.6 Terra |
| High-throughput OpenAI tasks | GPT-5.6 Luna |
| Highest hosted Qwen evaluation | Qwen 3.8 Max preview |
| Stable hosted Qwen agents | Qwen 3.7 Plus |
| Open-weight long-horizon agents | GLM-5.2 |

---

*From [Center for Cooperative Media](https://centerforcooperativemedia.org) AI Tools for Newsrooms*
