---
name: template-factory
context: fork
description: Generate both LESSONS and CLAUDE-RULES templates in parallel for a new project
---

# Template Factory Skill

This skill generates matching LESSONS and CLAUDE-RULES templates simultaneously for a new project, using Claude Code's forked context feature for parallel generation.

## When to Use

- Starting a new journalism project
- Setting up Claude Code memory for a new tool
- Creating project documentation templates
- Onboarding a new development workflow

## How It Works

When the user describes their project, spawn TWO parallel sub-agents:

### Agent 1: LESSONS Generator

Create a project retrospective template based on:
- Project type (software or journalism category)
- Key milestones and phases
- Technical stack and decisions
- Team structure and roles

Output: `LESSONS-{project-name}.md`

### Agent 2: CLAUDE-RULES Generator

Create a Claude Code memory file based on:
- Project architecture and structure
- Coding conventions and patterns
- File organization and naming
- Common commands and workflows
- Things to avoid

Output: `CLAUDE-RULES-{project-name}.md`

## Template Categories

### Software Development
- `general` - Generic software project
- `desktop-app` - Electron/native apps
- `browser-extension` - Chrome/Firefox extensions
- `web-app` - Full-stack web applications
- `data-pipeline` - ETL and data processing
- `mobile-app` - iOS/Android development

### Journalism/Publishing
- `digital-archive` - Historical content preservation
- `event-website` - Conference/event sites
- `content-pipeline` - CMS and publishing workflows
- `editorial-tool` - Newsroom productivity tools
- `research-project` - Investigation and analysis
- `publication` - News sites and magazines

## Usage

Invoke the skill and describe your project:

```
/template-factory

"I'm building a browser extension for journalists that helps verify social media claims.
It uses React, integrates with fact-checking APIs, and will be distributed via Chrome Web Store."
```

The skill will generate both templates in parallel, customized to your specific project.

## Output

```
Generated 2 files:

1. LESSONS-claim-verifier-extension.md
   - Browser extension retrospective template
   - Sections for: API integration, store submission, user feedback

2. CLAUDE-RULES-claim-verifier-extension.md
   - Extension architecture overview
   - React patterns and state management
   - Manifest v3 conventions
   - Testing workflows
```
