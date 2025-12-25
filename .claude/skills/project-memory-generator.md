# Project Memory Generator (CLAUDE.md)

Create CLAUDE.md files that transfer tribal knowledge, not obvious information. Think like a senior developer onboarding a competent contractor—you don't explain JavaScript, you explain YOUR project's quirks.

## What belongs in CLAUDE.md

| Include | Don't Include |
|---------|---------------|
| Project-specific quirks | Language syntax |
| YOUR naming conventions | How frameworks work generally |
| Commands with YOUR flags | Generic best practices |
| Non-obvious architecture decisions | Information already in comments |
| Common mistakes in THIS codebase | Verbose explanations of obvious code |
| External service configurations | Standard library usage |

## The deletion test

For every line you write, ask: "Would a senior developer already know this?"
- If yes → Delete it
- If no → Keep it

## Template structure

```markdown
# CLAUDE.md

## Project overview
[1-2 sentences maximum. What this does + primary tech stack.]

## Commands
[Only project-specific commands. Not "npm install" or "git clone".]
```bash
npm run dev        # Starts with hot reload on port 3000
npm run test:e2e   # Requires TEST_DB_URL env var
```

## Architecture
[Only non-obvious decisions. Where does X live? Why?]

## Patterns
[Only patterns unique to this project]

## Things to avoid
[Project-specific anti-patterns and gotchas]

## External dependencies
[APIs, services, credential locations]
```

## What to cut ruthlessly

**Generic commands everyone knows:**
```markdown
<!-- DELETE THIS -->
npm install    # Install dependencies
npm start      # Start the app
git add .      # Stage changes
```

**Framework explanations:**
```markdown
<!-- DELETE THIS -->
React components live in /components. Each component is a function
that returns JSX. We use hooks for state management...
```

**Obvious patterns:**
```markdown
<!-- DELETE THIS -->
We use camelCase for variables and PascalCase for components,
following standard JavaScript conventions.
```

## What to keep

**Project-specific quirks:**
```markdown
<!-- KEEP THIS -->
The sidebar buttons are OUTSIDE the main container, so event
delegation doesn't work for them. Attach listeners directly.
```

**Non-obvious architecture:**
```markdown
<!-- KEEP THIS -->
State lives in closure variables at app.js:48, not a state object.
Debug by adding console.log to renderApp().
```

**Gotchas that burned you:**
```markdown
<!-- KEEP THIS -->
Tool names must EXACTLY match across all 6 JSON files.
"Claude 4.5 Opus" not "Claude Opus 4.5".
```

## Voice

- Direct and terse
- Like notes you'd leave for yourself
- No marketing language
- No "Welcome to..." introductions
- No "This project is..." padding

## Example: Good vs bad

**Bad (too verbose, obvious):**
```markdown
# CLAUDE.md

## Overview
Welcome to our project! This is a React application that uses
TypeScript for type safety. We follow modern best practices
including functional components and hooks.

## Getting Started
First, make sure you have Node.js installed. Then run:
npm install
npm start

## Code Style
We use ESLint and Prettier for code formatting...
```

**Good (tribal knowledge only):**
```markdown
# CLAUDE.md

## Overview
LLM recommendation tool. Vanilla JS, JSON data files, GitHub Pages.

## Gotchas
- Sidebar/modal are OUTSIDE #container—attach events directly
- Tool names must match EXACTLY across all 6 JSON files
- No dark mode toggle—single Amditis dark theme only

## Data files
Edit JSON in /llm-advisor/data/. Changes go live on push.
decision-tree.json drives navigation; tool names reference model-info.json.

## Debugging state
Add to renderApp(): console.log({currentStep, history, showRecommendation})
```

## Length guideline

A good CLAUDE.md is 50-150 lines. If it's longer, you're explaining too much. If it's shorter, you might be missing critical quirks.
