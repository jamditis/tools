# Vibe coding starter guide for newsrooms

> A practical guide for journalists and non-developers. Learn to code with AI by managing projects, not memorizing syntax.

**Author:** Joe Amditis
**Last updated:** February 2026

---

## What is vibe coding?

Vibe coding is an approach to software development where you describe what you want in plain language and let an AI agent write and run the code. You direct the project; the agent handles the syntax, execution, and debugging.

This works because modern AI tools — Claude Code, Gemini CLI, and Codex CLI — run directly on your computer. They read your files, write code, execute it, and report back, all inside a single conversation. You describe the task; the agent does it.

For journalists, the benefit is direct: instead of pasting a city council transcript into a chat window and copying the summary by hand, you can describe a workflow to a CLI agent, and it builds the script, runs it against your files, and returns results — without you touching a browser.

> **Key insight:** Your job is to be clear about what you want and to verify that the output is correct. The agent handles execution.

---

## Essential mindset shifts

Before you write your first prompt, internalize these mental models:

### Managing, not prompting
You're delegating work to an agent, not typing clever prompts. Give clear instructions with context, review what comes back, and course-correct. The skill is judgment and specificity — the same skills that make a good editor or project manager.

### Apps vs. harnesses
Web chat tools (ChatGPT, Claude.ai, Gemini.com) are apps: easy to access, no setup, but context-limited, session-bound, and disconnected from your files. CLI tools (Claude Code, Gemini CLI, Codex CLI) are harnesses: they give AI access to your filesystem, let you script and automate, and persist context across sessions. Vibe coding starts in apps and graduates to harnesses.

### Start simple, build up
Begin with a script that does one thing. Add complexity only when the simple version works.

### Project-based learning
Learn by building things you actually need. Abstract exercises don't stick — real problems do.

### AI as tool, not crutch
AI accelerates your work, but you still need to verify outputs and understand the logic.

---

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

---

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

---

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

~~~markdown
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
~~~

---

## When to use each language

> **Note:** In CLI agent mode, you often don't need to pick a language — describe the task and the agent selects the right tool. The table below is most useful for understanding what the agent writes or for learning the languages yourself.

| Language | Best for | Examples |
|----------|----------|----------|
| **Python** | Data analysis, scraping, automation | Clean CSVs, scrape websites, call APIs |
| **R** | Statistical analysis, visualization | Regression analysis, publication-ready charts |
| **JavaScript** | Web interactivity, visualizations | Interactive maps, charts, web apps |
| **Bash** | File operations, automation | Rename files, batch processing, cron jobs |
| **SQL** | Database queries | Filter records, aggregate data, join tables |

> **Pro tip:** When in doubt, start with Python. It has the gentlest learning curve and the most resources for journalism-specific tasks.

---

## Useful scripts for journalists

### Python examples
- Clean and merge multiple CSV files
- Scrape a list of URLs and extract text
- Convert PDFs to searchable text
- Batch resize images
- Fetch data from APIs and format for analysis

### JavaScript examples
- Create interactive data visualizations
- Build a searchable database interface
- Add maps to stories with custom markers
- Create before/after image sliders

### Bash examples
- Rename hundreds of files with consistent naming
- Compress and archive project folders
- Schedule scripts to run automatically
- Convert file formats in bulk

---

## Best LLMs for coding (February 2026)

| Model | Strengths | Best for | CLI tool |
|-------|-----------|----------|----------|
| Claude Opus 4.6 | Best for coding and writing | All coding, large projects, debugging | Claude Code |
| Claude Sonnet 4.6 | Fast, follows instructions precisely | Daily tasks, iteration, brainstorming | Claude Code |
| Gemini 3.1 Pro | Front-end design, large context | Front-end work, large documents | Gemini CLI |
| Codex (GPT 5.2) | Multi-file projects, OpenAI integration | OpenAI coding tasks | Codex CLI |
| Claude.ai (free) | Free tier, solid capabilities | Getting started, simple scripts | Web only |

---

## The scripts-to-apps progression

Here's how projects typically evolve:

1. **Single-purpose scripts** — One file that does one thing
2. **Chained scripts** — Multiple scripts that work together
3. **Scheduled automation** — Scripts that run on a timer
4. **Web interface** — A simple UI for non-technical users
5. **Deployed application** — Something others can use online

> **Common mistake:** Don't jump to step 5. Most newsroom tools never need to be deployed apps. A scheduled script that emails a report is often enough.

---

## Quick start checklist

Before your first vibe coding session:

- [ ] Define a specific, achievable goal for this session
- [ ] Have your sample data ready (or know where to get it)
- [ ] Choose which LLM you'll use
- [ ] Set up a project folder with a clear name
- [ ] Create a CHANGELOG.md file to document progress
- [ ] Test that your programming environment works (can you run "Hello World"?)
- [ ] Set a time limit for the session

### If using a CLI agent (recommended)

- [ ] Install Node.js (v20 or higher) — nodejs.org
- [ ] Install one CLI tool: `npm install -g @anthropic-ai/claude-code` or `npm install -g @google/gemini-cli`
- [ ] Launch it from your project folder: type `claude` or `gemini` and press Enter
- [ ] Create a context file (`CLAUDE.md`) with your beat basics before your first session

---

## Changelog template

Use this structure to document each coding session:

```markdown
# Project Name — Changelog

## [Session Date]

### Goal
What I set out to accomplish today.

### What worked
- Thing that succeeded
- Another win

### What broke
- Error or problem encountered
- How it was resolved (or not)

### What I learned
- Insight gained
- Question to research later

### Next steps
- [ ] Task for next session
- [ ] Another task
```

---

## Next steps

- **Try it:** Pick a small, real problem. If you have a CLI tool installed, describe it in a session. If not, start with web chat.
- **Build a context file:** Even a 10-line CLAUDE.md makes a noticeable difference. Write down your beat basics before your next session.
- **Use the templates:** Download the changelog template and quick start checklist from this resource kit.
- **Go further:** Once scripts are working, look into custom skills (reusable prompt templates for your beat), scheduled automation (scripts that run on a timer), and retrieval-augmented generation (having the agent search your own document archive).
- **Join a community:** IRE and NICAR are the best communities for journalists learning to work with data and code.

---

*From [Center for Cooperative Media](https://centerforcooperativemedia.org) AI Tools for Newsrooms*
