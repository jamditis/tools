# Design: vibe coding guide update

**Date:** 2026-02-26
**Author:** Joe Amditis (via Claude)
**Repo:** jamditis/tools
**Target file:** `resource-kit/markdown/vibe-coding-guide.md`
**HTML file:** `resource-kit/docs/vibe-coding/index.html`

---

## Goal

Update the vibe coding guide to reflect current thinking and practice: CLI agents as the primary approach, not just web chat. Keep the guide accessible for beginners but add a clear path to CLI-first vibe coding.

---

## Approach

Weave CLI-agent concepts throughout the existing guide rather than bolting on a section. The guide should read as current from start to finish, with web chat as the on-ramp and CLI agents as where the practice actually lives.

---

## Section-by-section changes

### Section 1: What is vibe coding?

**Current:** Defines vibe coding as "coined by Andrej Karpathy" — describe what you want, let AI write the code.

**Change:** Drop the Karpathy origin story. Lead with the practice. Describe what vibe coding is now: you describe what you want, a CLI agent writes and runs the code, you review and iterate. No syntax memorization required.

The new intro should establish:
- What you do (describe tasks in plain language)
- What the agent does (write, run, iterate)
- Why it matters for journalists (no years of learning syntax required)

---

### Section 2: Essential mindset shifts

**Current shifts:** manager not mechanic, start simple, project-based learning, AI as tool not crutch

**Changes:**
1. Replace "manager not mechanic" with **"managing, not prompting"** — the key shift is that you're delegating tasks with context and judgment, not typing clever prompts. As Ethan Mollick puts it: "You aren't prompting, you are managing."
2. Add new shift: **"Apps vs. harnesses"** — Web chat tools (ChatGPT, Claude.ai, Gemini.com) are apps: easy to use but context-limited, no file access, no automation. CLI tools (Claude Code, Gemini CLI, Codex CLI) are harnesses: programmable, file-aware, scriptable. Vibe coding starts in apps and graduates to harnesses.
3. Keep: start simple, project-based learning, AI as tool not crutch.

---

### Section 3: The workflow

**Current:** Define scope → generate first draft → test and iterate → document what worked

**Change:** Show two workflows side by side:

**Web-based workflow** (entry level):
1. Define the scope
2. Paste your request into the chat
3. Test the output manually
4. Iterate until it works
5. Document what worked

**CLI agent workflow** (current practice):
1. Define the scope
2. Launch your CLI agent (`claude` or `gemini`)
3. Describe the task — the agent writes and runs the code inside the session
4. Review the output, course-correct in conversation
5. Document what worked (the agent can write the changelog too)

The key difference: in the CLI workflow, you don't manually run code. The agent executes it and reports back.

---

### New section: CLI tools for vibe coding

Add a section between the workflow and the language table. Cover:

**The three main CLI tools:**

| Tool | Install | Best for |
|------|---------|----------|
| Claude Code | `npm install -g @anthropic-ai/claude-code` | All coding tasks, large projects, debugging |
| Gemini CLI | `npm install -g @google/gemini-cli` | Free tier (1,000 req/day), front-end work |
| Codex CLI | `npm install -g @openai/codex` | OpenAI users |

**The key advantage:** CLI tools work where your files live. No upload/download cycles — describe a task and the agent reads your files, writes code, and runs it in place.

**When to use web vs. CLI:**
- Quick one-off questions, brainstorming → web chat
- File processing, batch work, automation, anything with a changelog → CLI agent

**Getting started:** You only need Node.js (v20+) installed. Then install one CLI tool and run it from your project folder.

---

### New section: Context files

Add after the CLI tools section.

**The problem context files solve:** Web chat forgets everything between sessions. Every time you open a new chat, you re-explain your beat, your style, your source standards. CLI tools solve this with context files — markdown files the agent reads automatically at the start of every session.

**The main context file formats:**
- `CLAUDE.md` — for Claude Code
- `GEMINI.md` — for Gemini CLI
- `AGENTS.md` — works with multiple tools

**What to put in a context file:**
- Beat knowledge: key sources, regular meetings, terminology, local acronyms
- Style guide: AP style preferences, publication-specific rules
- Source standards: how to handle anonymous sources, what verification looks like
- Project status: what you're working on, what's already done

**The deletion test:** Before adding a line to your context file, ask: "If I deleted this, would the AI behave differently?" If no, leave it out. Context files should contain information the AI doesn't already know.

**Template:**
```markdown
# [Beat name] — context file

## About me
[Reporter name, publication, beat]

## Beat knowledge
- Key sources: [names, roles]
- Regular events: [city council meetings, press briefings, etc.]
- Key terminology: [local acronyms, specialized terms]

## Style
- [AP style notes specific to your beat]
- [Publication-specific preferences]

## Current projects
- [What I'm working on]
```

---

### Section: When to use each language

**Current:** Table of Python, R, JS, Bash, SQL.

**Change:** Keep the table but add a note at the top: in CLI agent mode, you often don't need to pick a language — describe the task and the agent selects the right tool. The table is most useful when you want to understand what the agent wrote or when you're learning.

---

### Section: Best LLMs for coding

**Current model names (outdated):**
- Claude 4.5 Opus
- Gemini 3.0 Pro
- Codex (GPT 5.1)

**Updated model names:**
- Claude Opus 4.6
- Claude Sonnet 4.6 (add this — fast chat model, good for iteration)
- Gemini 3.1 Pro
- Codex (GPT 5.2)

Also update the table to note which models support CLI tool use (all of them) and which have free tiers (Gemini CLI: 1,000 req/day).

**Also update `tools/CLAUDE.md` model naming table** with these same corrected names to keep the repo consistent.

---

### Section: Quick start checklist

**Add CLI setup items:**
- [ ] Install Node.js (v20 or higher) — nodejs.org
- [ ] Install one CLI tool (Claude Code, Gemini CLI, or Codex CLI)
- [ ] Create a project folder with a clear name
- [ ] Create a context file (`CLAUDE.md` or `GEMINI.md`) with your beat basics

---

### Section: Next steps

**Current:** Generic — "try it," "use the templates," "join IRE/NICAR."

**Update:** Keep IRE/NICAR reference. Update "Try it" to reflect CLI agent workflow. Add: "When you're ready to go further: look into custom skills (reusable prompt templates for your beat), automation pipelines (scripts that run on a schedule), and retrieval-augmented generation (having the agent search your own document archive)."

No references to the course.

---

## Scope note: markdown vs. HTML

The markdown file (`resource-kit/markdown/vibe-coding-guide.md`) is the source of truth. The HTML file (`resource-kit/docs/vibe-coding/index.html`) is a styled web version. Both need to be updated. The HTML may need new sections added to match the markdown.

---

## Out of scope

- Adding course or MOOC references
- Changing the design/theme of the HTML
- Updating the LLM Advisor tool
- Adding new downloadable templates (can be a follow-up)
