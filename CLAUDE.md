# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository purpose

This repository contains two complementary template collections:

### LESSONS templates
Templates for documenting project learnings. Designed to carry forward wisdom between projects without context bleed. Fill these in when:
- Abandoning or shelving a project
- After a major pivot
- After shipping
- During retrospectives

### CLAUDE-RULES templates
Templates for setting up Claude Code project memory (CLAUDE.md files). These give Claude persistent context about your codebase, conventions, and preferences. Copy to your project root at the **start** of a project.

**Official documentation:** https://code.claude.com/docs/en/memory

## Template categories

Both LESSONS and CLAUDE-RULES templates are available for:

**Software development:** general, desktop-app, browser-extension, web-app, data-pipeline, mobile-app

**Journalism/publishing:** digital-archive, event-website, content-pipeline, editorial-tool, research-project, publication

## Common tasks

Copy a LESSONS template to a project:
```bash
cp ~/.claude/templates/LESSONS-[type].md /path/to/project/LESSONS.md
```

Copy a CLAUDE-RULES template to a project:
```bash
cp ~/.claude/templates/CLAUDE-RULES-[type].md /path/to/project/CLAUDE.md
```

## Template structure

### LESSONS templates
1. **Project summary** - What it does, who it's for
2. **What worked** - Technical wins, process wins, domain-specific successes
3. **What didn't work** - Failures, technical debt, external factors
4. **Key insights** - "The real problem" section is the most important (actual need vs what was built)
5. **Recommendations** - Both for continuing and starting fresh
6. **Artifacts worth keeping** - Reusable code/patterns to extract

Domain-specific templates add relevant sections (e.g., research-project has source logs and ethical considerations; digital-archive has rights/permissions and collection overview).

### CLAUDE-RULES templates
1. **Project overview** - What it does, tech stack, key details
2. **Common commands** - Development, testing, building, deployment
3. **Code style** - Formatting, naming conventions, file organization
4. **Architecture** - File structure, data flow, key patterns
5. **Domain-specific sections** - Varies by template type (e.g., data-pipeline has schema and error handling; web-app has state management and API integration)
6. **Things to avoid** - Project-specific anti-patterns and gotchas

Each CLAUDE-RULES template includes a link to the official Claude Code memory documentation.

## When modifying templates

### LESSONS templates
- Keep "The real problem" section in every template - it's the core insight carrier
- Separate "If continuing" vs "If starting fresh" recommendations
- Focus on transferable insights, not project-specific details

### CLAUDE-RULES templates
- Always include the official documentation link
- Keep "Things to avoid" section in every template
- Focus on actionable guidance, not generic advice
- Include domain-specific sections relevant to that project type

### General
- Templates are guidelines, not rigid structures
- Adapt sections based on project complexity

## Development workflow

- **After making any changes to HTML/CSS/JS files**, automatically refresh the localhost browser so the user can preview changes immediately
- Use `start http://localhost:8080/html/index.html` (or the appropriate page) to refresh/open the browser
- The local server runs on port 8080 in the `resource-kit` directory

## Model naming conventions

When referencing AI models in this project, use these current names:
- **Claude 4.5 Opus** - best for coding and writing
- **Claude 4.5 Sonnet** - fast chat model
- **Gemini 3.0 Pro** - best for front-end design and large documents
- **Codex (GPT 5.1)** - OpenAI's coding model
- **GPT 5.1** - OpenAI's reasoning model

Never use outdated names like "Claude 4 Opus", "Claude Sonnet 4", "GPT-4o", or "Gemini 2.x"
