# Vibe coding guide update — implementation plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Update the vibe coding guide and related files to reflect CLI-agent-first practice, current model names, and the apps-vs-harnesses framing.

**Architecture:** Content-only update across five files. No new files created, no build step, no code changes. Markdown files are standalone documents; HTML files are independently authored. Changes to one do not propagate to the other — both must be updated explicitly.

**Tech stack:** Markdown, static HTML with Tailwind (Amditis V2 theme). GitHub Pages auto-deploys on push to master.

---

## Files being modified

| File | What changes |
|------|-------------|
| `resource-kit/markdown/vibe-coding-guide.md` | Full content update per design |
| `resource-kit/docs/downloads/VIBE-CODING-CHECKLIST.md` | LLM table + CLI items |
| `resource-kit/docs/downloads/LLM-COMPARISON.md` | Model names throughout |
| `CLAUDE.md` | Model naming table |
| `resource-kit/docs/vibe-coding/index.html` | Philosophy callout text |

## Model name corrections (apply everywhere)

| Old name | New name |
|----------|----------|
| Claude 4.5 Opus | Claude Opus 4.6 |
| Claude 4.5 Sonnet | Claude Sonnet 4.6 |
| Gemini 3.0 Pro | Gemini 3.1 Pro |
| Codex (GPT 5.1) | Codex (GPT 5.2) |
| GPT 5.1 | GPT 5.2 |

---

## Task 1: Rewrite vibe-coding-guide.md

**File:** `resource-kit/markdown/vibe-coding-guide.md`

### Step 1: Replace Section 1 — "What is vibe coding?"

Replace the current section (lines 10–18) with a definition that leads with practice, drops the Karpathy origin story, and introduces CLI agents:

```markdown
## What is vibe coding?

Vibe coding is an approach to software development where you describe what you want in plain language and let an AI agent write and run the code. You direct the project; the agent handles the syntax, execution, and debugging.

This works because modern AI tools — Claude Code, Gemini CLI, and Codex CLI — run directly on your computer. They read your files, write code, execute it, and report back, all inside a single conversation. You describe the task; the agent does it.

For journalists, the practical value is real: instead of pasting a city council transcript into a chat window and copying the summary by hand, you can describe a workflow to a CLI agent, and it builds the script, runs it against your files, and returns results — without you touching a browser.

> **Key insight:** Your job is to be clear about what you want and to verify that the output is correct. The agent handles execution.
```

### Step 2: Verify Section 1 no longer references Karpathy

After editing, confirm the word "Karpathy" does not appear in the file.

Run: `grep -n "Karpathy" resource-kit/markdown/vibe-coding-guide.md`
Expected: no output

### Step 3: Replace mindset shift "Manager, not mechanic" with "Managing, not prompting"

Replace the `### Manager, not mechanic` block with:

```markdown
### Managing, not prompting
You're delegating work to an agent, not typing clever prompts. Give clear instructions with context, review what comes back, and course-correct. The skill is judgment and specificity — the same skills that make a good editor or project manager.
```

### Step 4: Add "Apps vs. harnesses" mindset shift

After "Managing, not prompting", add:

```markdown
### Apps vs. harnesses
Web chat tools (ChatGPT, Claude.ai, Gemini.com) are apps: easy to access, no setup, but context-limited, session-bound, and disconnected from your files. CLI tools (Claude Code, Gemini CLI, Codex CLI) are harnesses: they give AI access to your filesystem, let you script and automate, and persist context across sessions. Vibe coding starts in apps and graduates to harnesses.
```

### Step 5: Update the workflow section — add CLI agent workflow alongside web workflow

Replace the current `## The workflow` section (lines 39–54) with a two-workflow structure:

```markdown
## The workflow

### Web-based (entry level)

Start here if you have no terminal experience:

1. **Define the scope** — Write down exactly what you want. Be specific about inputs, outputs, and edge cases.
2. **Paste your request** — Open Claude.ai, ChatGPT, or Gemini. Include your environment if relevant ("I'm on Windows, using Python").
3. **Test manually** — Copy the output, run it, see what happens.
4. **Iterate** — Paste errors back to the AI and ask it to fix them.
5. **Document** — Keep a CHANGELOG.md with what worked and what broke.

### CLI agent (current practice)

Once you have a terminal and one CLI tool installed:

1. **Define the scope** — Same as above. Clarity matters more here, not less.
2. **Launch your agent** — Open a terminal in your project folder. Type `claude` or `gemini` and press Enter.
3. **Describe the task** — The agent reads your files, writes code, runs it, and reports back. You don't type shell commands; you describe what you want.
4. **Review and course-correct** — Check the output. If it's wrong, say so in plain language. Stay in the session.
5. **Document** — Ask the agent to update your changelog before you end the session.

> **The key difference:** In the CLI workflow, the agent executes. You don't copy code, open a terminal, and run it yourself — the agent does that in one step.
```

### Step 6: Add a new "CLI tools for vibe coding" section

Insert this section after the workflow and before "When to use each language":

```markdown
## CLI tools for vibe coding

CLI tools are harnesses: they give AI direct access to your files, terminal, and system. Once installed, you launch one with a single command and work in plain English from there.

### The three main options

| Tool | Install | Best for |
|------|---------|----------|
| **Claude Code** | `npm install -g @anthropic-ai/claude-code` | All coding tasks, large projects, debugging |
| **Gemini CLI** | `npm install -g @google/gemini-cli` | Free tier (1,000 req/day), front-end work |
| **Codex CLI** | `npm install -g @openai/codex` | OpenAI users |

You only need Node.js (v20 or higher) installed first. Get it at nodejs.org.

### When to use web vs. CLI

| Task | Use |
|------|-----|
| Quick one-off question | Web chat |
| Processing a file or folder | CLI agent |
| Batch work (50+ documents) | CLI agent |
| Building and running a script | CLI agent |
| Automating a recurring task | CLI agent |

> **Pro tip:** For simple questions, web chat is faster. For anything involving your actual files or more than one step, a CLI agent saves significant time.
```

### Step 7: Add a new "Context files" section

Insert this after the CLI tools section:

```markdown
## Context files

Web chat forgets everything between sessions. Every time you open a new chat, you re-explain your beat, your style, your sources. CLI tools solve this with context files — markdown files the agent reads automatically when you start a session.

### The file formats

- `CLAUDE.md` — read by Claude Code
- `GEMINI.md` — read by Gemini CLI
- `AGENTS.md` — read by multiple tools

Create the file in your project folder. The agent picks it up automatically.

### What to put in a context file

- **Beat knowledge:** key sources, regular meetings, local acronyms, terminology specific to your coverage area
- **Style guide:** AP style preferences, publication-specific rules
- **Source standards:** how you handle anonymous sources, what verification looks like for your newsroom
- **Project status:** what you're working on, what's already done

### The deletion test

Before adding a line to your context file, ask: "If I deleted this, would the AI behave differently on my tasks?" If the answer is no, leave it out. Context files work because they contain information the AI doesn't already know.

### Starter template

```markdown
# [Beat name] — context file

## About this project
[What this folder is for, one sentence]

## Beat knowledge
- Key sources: [names, roles, contact info]
- Regular events: [city council schedule, press briefings, etc.]
- Key terms: [local acronyms, specialized terminology]

## Style
- [AP style notes specific to your beat]
- [Publication name and audience]

## Current projects
- [What I'm working on right now]
```
```

### Step 8: Update language table — add CLI agent note

Add a note above the existing language table:

```markdown
> **Note:** In CLI agent mode, you often don't need to pick a language — describe the task and the agent selects the right tool. The table below is most useful for understanding what the agent writes or for learning the languages yourself.
```

### Step 9: Update the LLM table — new model names and CLI column

Replace the existing LLM table (lines 96–103) with:

```markdown
## Best LLMs for coding (February 2026)

| Model | Strengths | Best for | CLI tool |
|-------|-----------|----------|----------|
| Claude Opus 4.6 | Best for coding and writing | All coding, large projects, debugging | Claude Code |
| Claude Sonnet 4.6 | Fast, follows instructions precisely | Daily tasks, iteration, brainstorming | Claude Code |
| Gemini 3.1 Pro | Front-end design, large context | Front-end work, large documents | Gemini CLI |
| Codex (GPT 5.2) | Multi-file projects, OpenAI integration | OpenAI coding tasks | Codex CLI |
| Claude.ai (free) | Free tier, solid capabilities | Getting started, simple scripts | Web only |
```

### Step 10: Update quick start checklist — add CLI setup items

After the existing checklist items, add:

```markdown
### If using a CLI agent (recommended)

- [ ] Install Node.js (v20 or higher) — nodejs.org
- [ ] Install one CLI tool: `npm install -g @anthropic-ai/claude-code` or `npm install -g @google/gemini-cli`
- [ ] Launch it from your project folder: type `claude` or `gemini` and press Enter
- [ ] Create a context file (`CLAUDE.md`) with your beat basics before your first session
```

### Step 11: Update next steps section

Replace the current "Next steps" (lines 165–171) with:

```markdown
## Next steps

- **Try it:** Pick a small, real problem. If you have a CLI tool installed, describe it in a session. If not, start with web chat.
- **Build a context file:** Even a 10-line CLAUDE.md makes a noticeable difference. Write down your beat basics before your next session.
- **Use the templates:** Download the changelog template and quick start checklist from this resource kit.
- **Go further:** Once scripts are working, look into custom skills (reusable prompt templates for your beat), scheduled automation (scripts that run on a timer), and retrieval-augmented generation (having the agent search your own document archive).
- **Join a community:** IRE and NICAR are the best communities for journalists learning to work with data and code.
```

### Step 12: Verify the guide reads coherently end to end

Read through the full updated markdown file and confirm:
- No references to Karpathy
- No references to any course or MOOC
- Model names match the corrections table above
- Both web and CLI workflows appear under "The workflow"
- CLI tools section appears before the language table
- Context files section appears after CLI tools

---

## Task 2: Update VIBE-CODING-CHECKLIST.md

**File:** `resource-kit/docs/downloads/VIBE-CODING-CHECKLIST.md`

### Step 1: Add CLI setup items to "Before you start"

After `- [ ] Choose your LLM — Pick one and stick with it for this session`, add:

```markdown
- [ ] **Install a CLI tool (if batch/file work)** — `npm install -g @anthropic-ai/claude-code` or `npm install -g @google/gemini-cli`
- [ ] **Create a context file** — Add a CLAUDE.md or GEMINI.md with your beat basics
```

### Step 2: Update the LLM quick reference table

Replace:
```
| Coding and writing | Claude 4.5 Opus |
| Front-end design, large docs | Gemini 3.0 Pro |
| OpenAI coding tasks | Codex (GPT 5.1) |
| Free, getting started | Claude.ai free tier |
```

With:
```
| Coding and writing | Claude Opus 4.6 |
| Fast daily tasks | Claude Sonnet 4.6 |
| Front-end design, large docs | Gemini 3.1 Pro |
| OpenAI coding tasks | Codex (GPT 5.2) |
| Free, getting started | Gemini CLI free tier |
```

### Step 3: Update date reference

Change `### Current best LLMs for coding (Dec 2025)` to `### Current best LLMs for coding (Feb 2026)`.

---

## Task 3: Update LLM-COMPARISON.md

**File:** `resource-kit/docs/downloads/LLM-COMPARISON.md`

### Step 1: Update all model names in the at-a-glance table

Replace old names with corrected names throughout the table.

### Step 2: Update each model's heading and body references

- `### Claude 4.5 Opus` → `### Claude Opus 4.6`
- `### Claude 4.5 Sonnet` → `### Claude Sonnet 4.6`
- `### Gemini 3.0 Pro` → `### Gemini 3.1 Pro` (update body text references too)
- `### Codex (GPT 5.1)` → `### Codex (GPT 5.2)`
- `### GPT 5.1` → `### GPT 5.2` (update body text references too)

### Step 3: Update "Which should you start with?" section

Update all model name references in that section to new names.

### Step 4: Update date

Change `Last updated: December 2025` to `Last updated: February 2026`.

### Step 5: Verify no old model names remain

Run: `grep -n "4\.5 Opus\|4\.5 Sonnet\|3\.0 Pro\|GPT 5\.1\b" resource-kit/docs/downloads/LLM-COMPARISON.md`
Expected: no output

---

## Task 4: Update CLAUDE.md model naming table

**File:** `CLAUDE.md`

### Step 1: Find the model naming section

Search for: `grep -n "Claude 4.5 Opus\|Gemini 3.0\|GPT 5.1" CLAUDE.md`

### Step 2: Update model naming conventions

Update the "Model naming conventions" section:
- `Claude 4.5 Opus` → `Claude Opus 4.6`
- `Claude 4.5 Sonnet` → `Claude Sonnet 4.6`
- `Gemini 3.0 Pro` → `Gemini 3.1 Pro`
- `Gemini 3.0 Flash` → `Gemini 3.1 Flash`
- `Codex (GPT 5.1)` → `Codex (GPT 5.2)`
- `GPT 5.1` → `GPT 5.2`

### Step 3: Verify no old model names remain

Run: `grep -n "4\.5 Opus\|4\.5 Sonnet\|3\.0 Pro\|3\.0 Flash\|GPT 5\.1\b" CLAUDE.md`
Expected: no output

---

## Task 5: Update philosophy callout in vibe-coding/index.html

**File:** `resource-kit/docs/vibe-coding/index.html`

### Step 1: Find the philosophy section

The section is around lines 329–347. It currently reads:

```
Vibe coding means learning by building - you pick up programming concepts when your project needs them, not years before.
AI handles the syntax; you handle the thinking.
```

### Step 2: Update the philosophy text

Replace:
```html
<p class="text-ink/70 leading-relaxed mb-4">
    <span class="text-ink font-medium">Vibe coding means learning by building</span> - you pick up programming concepts when your project needs them, not years before.
    AI handles the syntax; you handle the thinking.
</p>
<p class="text-sm text-ink/50 italic">
    Build things. Break things. Fix them. Repeat.
</p>
```

With:
```html
<p class="text-ink/70 leading-relaxed mb-4">
    <span class="text-ink font-medium">Vibe coding means describing what you want and letting an agent do it.</span> You don't write code — you delegate, review, and course-correct. The skill is judgment and clarity, not syntax.
</p>
<p class="text-sm text-ink/50 italic">
    Describe it. Review it. Ship it.
</p>
```

---

## Task 6: Commit all changes

### Step 1: Stage all modified files

```bash
git add resource-kit/markdown/vibe-coding-guide.md
git add resource-kit/docs/downloads/VIBE-CODING-CHECKLIST.md
git add resource-kit/docs/downloads/LLM-COMPARISON.md
git add CLAUDE.md
git add resource-kit/docs/vibe-coding/index.html
```

### Step 2: Verify staged files

Run: `git diff --staged --stat`
Expected: 5 files changed

### Step 3: Commit

```bash
git commit -m "Update vibe coding guide for CLI-agent-first practice

- Rewrite intro to lead with CLI agent practice, drop Karpathy framing
- Replace 'manager not mechanic' with 'managing, not prompting'
- Add apps-vs-harnesses mindset shift
- Add side-by-side web and CLI agent workflows
- Add CLI tools section (Claude Code, Gemini CLI, Codex CLI)
- Add context files section with CLAUDE.md template
- Update all model names: Opus/Sonnet 4.6, Gemini 3.1 Pro, Codex GPT 5.2
- Update checklist and LLM comparison with new names
- Update CLAUDE.md model naming table for consistency"
```

### Step 4: Push and verify deployment

```bash
git push origin master
gh run list --limit 3
```

Expected: GitHub Actions run triggered. Check it completes successfully before calling this done.
