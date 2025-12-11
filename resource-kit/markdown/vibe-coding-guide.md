# Vibe coding starter guide for newsrooms

> A practical guide for journalists and non-developers. Learn to code with AI by managing projects, not memorizing syntax.

**Author:** Joe Amditis
**Last updated:** December 2025

---

## What is vibe coding?

"Vibe coding" is a term coined by Andrej Karpathy to describe a new approach to software development where you describe what you want in natural language and let AI write the code. You're the project manager, not the programmer.

This isn't about replacing programming knowledge—it's about lowering the barrier to entry. Journalists can now build tools, automate workflows, and analyze data without spending years learning syntax.

> **Key insight:** You don't need to understand every line of code. You need to understand what you're trying to build and how to test if it works.

---

## Essential mindset shifts

Before you write your first prompt, internalize these mental models:

### Manager, not mechanic
You're directing the project, not debugging semicolons. Focus on requirements, not implementation details.

### Start simple, build up
Begin with a script that does one thing. Add complexity only when the simple version works.

### Project-based learning
Learn by building things you actually need. Abstract exercises don't stick—real problems do.

### AI as tool, not crutch
AI accelerates your work, but you still need to verify outputs and understand the logic.

---

## The workflow

Here's the core loop for vibe coding:

### 1. Define the scope
Write down exactly what you want the tool to do. Be specific about inputs, outputs, and edge cases. The clearer your requirements, the better the AI's output.

### 2. Generate first draft
Ask the AI to write the code. Include context about your environment (e.g., "I'm using Python 3.11 on Windows"). Don't worry about perfection—this is a starting point.

### 3. Test and iterate
Run the code. When it breaks (and it will), paste the error back to the AI. Each iteration teaches you something and improves the code.

### 4. Document what worked
Keep a changelog. Write down what you built, what broke, and how you fixed it. This becomes your personal knowledge base.

---

## When to use each language

Different languages excel at different tasks:

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

## Best LLMs for coding (December 2025)

| Model | Strengths | Best for |
|-------|-----------|----------|
| Claude 4.5 Opus | Best for coding and writing by far | All coding, large projects, debugging |
| Gemini 3.0 Pro | Best for front-end design, large context | Front-end work, large documents |
| Codex (GPT 5.1) | OpenAI's specialized coding model | OpenAI coding tasks |
| Claude.ai (free) | Free tier, solid capabilities | Getting started, simple scripts |

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

- **Try it:** Pick a small, real problem and attempt to solve it with AI assistance
- **Use the templates:** Download the changelog and checklist from this resource kit
- **Join a community:** Find other journalists learning to code—the IRE and NICAR communities are great places to start

---

*From [Center for Cooperative Media](https://centerforcooperativemedia.org) AI Tools for Newsrooms*
