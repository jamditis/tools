# Claude Skills Proposals for Amditis Resource Kit

Based on comprehensive codebase review following the 10-step skill development methodology.

---

## Executive Summary

Analysis identified **10 high-value skill opportunities** across three categories:
1. **Project-Specific Skills** (4) - Address gaps unique to this codebase
2. **Template/Documentation Skills** (3) - Systematize template workflows
3. **Quality Assurance Skills** (3) - Prevent common failure modes

Each skill follows the 4 Core Truths:
- **Expertise Transfer, Not Instructions** → Makes Claude think like an expert
- **Flow, Not Friction** → Produces output, not intermediate documents
- **Voice Matches Domain** → Sounds like a practitioner
- **Focused Beats Comprehensive** → Every section earns its place

---

## Category 1: Project-Specific Skills

### Skill 1: Amditis Theme Expert

**The Problem (Where Claude Fails)**
Claude defaults to generic CSS patterns: light/dark toggles, Inter font, purple gradients, `bg-white/bg-gray-100`. The Amditis theme is single dark-mode with specific cyberpunk aesthetics that Claude doesn't know.

**Core Expertise to Transfer**
Think like a designer who lives in this dark, cyberpunk aesthetic. Void backgrounds, acid-green accents, chrome text, ice-blue secondaries. Borders are always transparent white (`border-white/10`), never solid colors. The CRT overlay and glitch effects aren't decoration—they're identity.

**Skill Definition**
```markdown
# Amditis Theme Expert

You are styling for the Amditis dark cyberpunk theme. This is NOT a light/dark toggle system—it's permanent dark mode with a specific character.

## Color System (memorize these)
- **Backgrounds:** void (#050505), panel (#0a0a0a), surface (#111111)
- **Text:** chrome (#e8e8e8) for primary, gray-400/500/600 for secondary
- **Accents:** acid (#c8ff00) green, ice (#00f0ff) cyan, signal (#ff3366) red
- **Borders:** ALWAYS `border-white/10` or `border-white/5`. Never solid colors.

## Typography
- Headings: `font-display` (Chakra Petch)
- Code/Labels: `font-mono` (Share Tech Mono)
- Never use Arial, Inter, or system fonts

## Utility Classes Available
- `.clip-notch` / `.clip-notch-top` - Cut corner effect
- `.crt-overlay` - Scanline effect (use sparingly)
- `.glitch-text` - Animated glitch (hero titles only)
- `.cyber-checkbox` - Styled checkboxes

## What You Must NEVER Do
- Use `bg-white`, `bg-gray-100`, or any light backgrounds
- Use `dark:` prefixed classes (no dark mode toggle exists)
- Use pre-colored borders like `border-gray-300`
- Default to purple gradients or generic "tech" aesthetics

When styling new components, ask: "Does this look like it belongs on a spaceship console from 2087?"
```

**Triggers**
- Any CSS/styling work in this repository
- Creating new HTML pages or components
- Reviewing PRs that touch styling

---

### Skill 2: LLM Advisor Event Architecture

**The Problem (Where Claude Fails)**
Claude adds event listeners to the main container (`#llm-tool-advisor-container`) assuming delegation will work. But sidebar buttons and modal elements are OUTSIDE this container—their events never bubble to it. This causes silent failures that are hard to debug.

**Core Expertise to Transfer**
Think like someone who got burned by this exact bug. The container delegation pattern works great—for elements INSIDE the container. Sidebar? Outside. Modal? Outside. Before adding any click handler, mentally trace the DOM: where does this element live?

**Skill Definition**
```markdown
# LLM Advisor Event Architecture

The LLM Advisor uses event delegation, but with a critical gotcha you must understand.

## The Architecture
```
<body>
  ├── #sidebar (OUTSIDE container)
  │   └── buttons like #show-comparison-btn
  ├── #llm-tool-advisor-container (delegated listener here)
  │   └── #main-content, #progress-bar, etc.
  └── #universal-modal (OUTSIDE container)
      └── modal buttons, .compare-tool-btn, etc.
```

## The Rule
- Elements INSIDE `#llm-tool-advisor-container` → Use delegation (e.target.closest())
- Elements OUTSIDE (sidebar, modal) → Attach listeners DIRECTLY to element

## Correct Pattern for Sidebar Buttons
```javascript
// ✅ CORRECT - Direct listener, element is outside container
const btn = document.getElementById('show-comparison-btn');
if (btn) {
    btn.addEventListener('click', () => showModal(...));
}
```

## Correct Pattern for Modal Buttons
```javascript
// ✅ CORRECT - Modal needs its own listener
universalModal.addEventListener('click', e => {
    const button = e.target.closest('button');
    if (!button) return;

    if (button.classList.contains('compare-tool-btn')) {
        // Handle comparison toggle
    }
});
```

## Red Flags (What Breaks)
- Adding sidebar button handler to container listener (won't fire)
- Expecting modal buttons to work via container delegation (won't work)
- Not checking if element exists before adding listener (null errors)

Before adding any event handler: "Is this element inside or outside the container?"
```

**Triggers**
- Adding new buttons to LLM Advisor
- Debugging "button doesn't work" issues
- Code review of event handling changes

---

### Skill 3: LLM Advisor Data Schema Expert

**The Problem (Where Claude Fails)**
Claude generates JSON data that doesn't match the expected schemas. Missing required fields, wrong nesting, incompatible tool names. The app fails silently or shows empty content.

**Core Expertise to Transfer**
Think like someone maintaining these data files for a year. You know exactly what fields are required, what's optional, and how files reference each other. Tool names must match EXACTLY across all files—"Claude 4.5 Opus" not "Claude Opus 4.5".

**Skill Definition**
```markdown
# LLM Advisor Data Schemas

Six JSON files power the LLM Advisor. They reference each other by tool name—consistency is critical.

## File: decision-tree.json
```json
{
  "nodeId": {
    "question": "Required - user-facing question",
    "options": [
      {
        "text": "Required - button label",
        "next": "Required - nodeId or 'recommendation'",
        "track": "Required - research|content|data|editing|sources|multimedia",
        "tools": "Optional - array, required if next='recommendation'"
      }
    ]
  }
}
```
Every path must eventually reach `"next": "recommendation"` with a `tools` array.

## File: model-info.json
```json
{
  "Tool Name": {
    "description": "Required - 1-2 sentences",
    "features": "Required - array of strings",
    "link": "Required - official URL"
  }
}
```

## File: tool-comparison.json
```json
{
  "Tool Name": {
    "strengths": "Required - array",
    "weaknesses": "Required - array",
    "bestFor": "Required - array",
    "pricing": "Required - string"
  }
}
```

## File: case-studies.json
```json
[{
  "title": "Required",
  "tool": "Required - must match model-info.json key",
  "journalist": "Required - Name, Publication",
  "challenge": "Required",
  "solution": "Required",
  "quote": "Required",
  "tips": "Required",
  "sourceUrl": "Required - valid URL"
}]
```

## Tool Name Consistency (Current Valid Names)
- Claude 4.5 Opus, Claude 4.5 Sonnet
- Gemini 3.0 Pro, Gemini 3.0 Flash
- Codex (GPT 5.1), GPT 5.1
- Perplexity, ElevenLabs, Midjourney, NotebookLM

## Cross-File Validation Rule
Any `tool` field value must exist as a key in `model-info.json` and `tool-comparison.json`.
```

**Triggers**
- Adding new models/tools
- Creating case studies
- Modifying decision tree
- Debugging "tool not found" errors

---

### Skill 4: State Management Debugger

**The Problem (Where Claude Fails)**
The app.js has state scattered across closure variables with no validation. Claude doesn't know what state exists, can't trace mutations, and makes changes that put the app in invalid states.

**Core Expertise to Transfer**
Think like someone debugging a state-related bug at 2am. You know where every piece of state lives, what mutations are valid, and how to trace the current state via console.

**Skill Definition**
```markdown
# LLM Advisor State Management

State lives in closure variables at the top of the IIFE in app.js. There's no state object—just scattered `let` declarations.

## Current State Variables (app.js ~line 48)
```javascript
let currentStep = 'start';        // Current node ID in decision tree
let history = [];                 // [{step, question, selection, track}]
let selectedTools = [];           // Tools for recommendation view
let compareTools = [];            // Tools selected for comparison (max 3)
let showRecommendation = false;   // Which view to render
let currentTrack = 'research';    // Current track for color coding
```

## State Mutation Patterns
- `history.push(item)` - Add navigation step
- `history.pop()` - Go back one step
- `selectedTools = [...]` - Replace wholesale on recommendation
- `compareTools.push()/filter()` - Toggle comparison tool
- `showRecommendation = true/false` - Switch views
- `currentTrack = 'research'` - Update color coding

## Debugging State
To inspect current state, add temporary console.log in renderApp():
```javascript
function renderApp() {
    console.log('STATE:', {currentStep, history, selectedTools, showRecommendation, currentTrack});
    // ...
}
```

## Invalid States to Avoid
- `currentStep` pointing to non-existent node (crashes on render)
- `history` with items that don't match actual navigation
- `showRecommendation = true` with empty `selectedTools`
- `compareTools` with more than 3 items

## Recovery Pattern
When state gets corrupted, the restart button resets everything:
```javascript
currentStep = 'start';
history = [];
selectedTools = [];
compareTools = [];
showRecommendation = false;
currentTrack = 'research';
```
```

**Triggers**
- Debugging navigation issues
- Adding new state-dependent features
- Investigating "stuck" or "broken" UI states

---

## Category 2: Template & Documentation Skills

### Skill 5: Project Memory Generator (CLAUDE.md)

**The Problem (Where Claude Fails)**
Claude either generates overly generic CLAUDE.md files or overly detailed ones full of information the AI should already know (language syntax, obvious patterns). The result is noise that wastes context window.

**Core Expertise to Transfer**
Think like a senior developer onboarding a competent contractor. You don't explain JavaScript—you explain YOUR project's quirks, YOUR naming conventions, YOUR deployment gotchas. The CLAUDE.md is a shortcut past tribal knowledge.

**Skill Definition**
```markdown
# Project Memory Generator (CLAUDE.md)

Create CLAUDE.md files that transfer tribal knowledge, not obvious information.

## What Belongs in CLAUDE.md
✅ Project-specific quirks ("sidebar is outside main container")
✅ Naming conventions that differ from defaults
✅ Commands with YOUR project's specific flags
✅ Architecture decisions that aren't obvious from code
✅ Common mistakes specific to this codebase
✅ External dependencies and their configuration

## What Does NOT Belong
❌ Language syntax or standard library usage
❌ How React/Vue/etc. works generally
❌ Generic best practices any developer knows
❌ Verbose explanations of obvious patterns
❌ Information that's already in comments

## Structure (adapt per project type)
```markdown
# CLAUDE.md

## Project overview
[1-2 sentences: what this does and its tech stack]

## Commands
[Only project-specific commands, not "npm install"]

## Architecture quirks
[Things that would surprise a new developer]

## Patterns we use
[Only non-obvious patterns]

## Things to avoid
[Project-specific anti-patterns]

## External dependencies
[APIs, services, credentials locations]
```

## The Test
For each line, ask: "Would a senior developer already know this?"
If yes → Delete it
If no → Keep it

## Voice
Direct, terse, no fluff. Like notes you'd leave for yourself.
```

**Triggers**
- Starting a new project
- User asks to create CLAUDE.md
- Project without existing CLAUDE.md

---

### Skill 6: Project Retrospective Writer (LESSONS.md)

**The Problem (Where Claude Fails)**
Claude generates generic retrospectives full of platitudes ("communication is important") or overly positive summaries that don't capture actual failures. The "what didn't work" section is where the real value lives.

**Core Expertise to Transfer**
Think like a journalist writing about your own project failure. Be specific, be honest, name the actual mistakes. "The Real Problem" section is the most valuable—it reveals the gap between what you thought you were building and what was actually needed.

**Skill Definition**
```markdown
# Project Retrospective Writer (LESSONS.md)

Create LESSONS.md files that capture institutional knowledge, especially failures.

## The Critical Section: "The Real Problem"
This is the most valuable part. It answers: "What did we THINK we were building vs. what was ACTUALLY needed?"

Example of what works:
> "We built a comprehensive tagging system when users just needed full-text search. Three weeks on features no one used."

Example of what doesn't work:
> "We learned the importance of user research." (Too generic, no value)

## Structure
```markdown
# LESSONS.md

## Project
[Name, dates, status, your name]

## Summary
[One paragraph: what it did, what it achieved]

## What worked
**Technical:** [Specific wins with why they worked]
**Process:** [What methodologies/tools helped]

## What didn't work
**Critical failures:** [Things that blocked progress]
**Technical debt:** [Shortcuts that hurt later]
**External factors:** [Things outside your control]

## The real problem
[Gap between assumed need and actual need]

## Recommendations
**If continuing:** [Priorities in order]
**If starting fresh:** [What to do differently]
**Tech stack:** [Keep/Replace/Add]

## Reusable artifacts
| Component | Why it's valuable |
|-----------|------------------|
| [Name]    | [Specific reuse potential] |
```

## Voice
Honest, specific, slightly self-deprecating. Like explaining to a friend why the project took twice as long.

## The Test
Ask: "Would this help someone starting a similar project avoid my mistakes?"
If no → Be more specific
```

**Triggers**
- Project completion or major milestone
- User asks for project retrospective
- Post-mortem after significant failures

---

### Skill 7: Template Selector

**The Problem (Where Claude Fails)**
This repository has 11 pairs of category-specific templates (web-app, data-pipeline, content-pipeline, etc.). Claude doesn't know which to recommend and often picks the wrong one.

**Core Expertise to Transfer**
Think like someone who's used all 11 template types. You know that a "newsletter dashboard" is publication, not web-app. A "scraping script" is data-pipeline, not general. An "AI fact-checker" is editorial-tool, not research-project.

**Skill Definition**
```markdown
# Template Selector

Match projects to the correct template category.

## Software Development Templates
| Category | Use When | NOT For |
|----------|----------|---------|
| **general** | Truly generic or doesn't fit others | Projects that clearly fit a category |
| **web-app** | React/Vue/Next sites, SPAs, dashboards | Static sites, APIs only |
| **desktop-app** | Electron, Tauri, native apps | Web apps, even if they look native |
| **browser-extension** | Chrome/Firefox/Safari extensions | Bookmarklets, web apps |
| **data-pipeline** | ETL, scraping, data processing, scheduled jobs | One-off scripts, data analysis |
| **mobile-app** | React Native, Capacitor, Flutter | PWAs, responsive web |

## Journalism/Publishing Templates
| Category | Use When | NOT For |
|----------|----------|---------|
| **digital-archive** | Historical collections, preservation, databases | Active content sites |
| **event-website** | Conferences, summits, events with dates | Ongoing content |
| **content-pipeline** | CMS workflows, publishing automation | Single articles, manual publishing |
| **editorial-tool** | Newsroom tools, AI assistants, fact-checkers | Generic productivity tools |
| **publication** | Newsletters, podcasts, ongoing content series | One-off reports |
| **research-project** | Investigations, data journalism | Ongoing research ops |

## Decision Tree
1. Is it journalism/publishing focused? → Use journalism category
2. Does it have a specific end date/event? → event-website
3. Does it process data in batches/schedules? → data-pipeline
4. Does it live in the browser chrome? → browser-extension
5. Does it install on desktop? → desktop-app
6. Does it run on mobile devices? → mobile-app
7. Is it a web interface? → web-app
8. None of the above → general

## Common Mistakes
- "Newsletter dashboard" → publication (not web-app)
- "Scraping script" → data-pipeline (not general)
- "AI fact-checker" → editorial-tool (not research-project)
- "Event registration site" → event-website (not web-app)
```

**Triggers**
- Starting a new project
- User asks which template to use
- Setting up project documentation

---

## Category 3: Quality Assurance Skills

### Skill 8: AI Writing Detox

**The Problem (Where Claude Fails)**
Claude generates text with obvious AI patterns: "delve into," "it's important to note," "This is a game-changer," "rich tapestry," excessive hedging. These phrases signal AI-generated content and reduce trust.

**Core Expertise to Transfer**
Think like an editor who's read 10,000 AI-generated articles and can spot the patterns instantly. Your job is to sound human, not to sound smart. Good writing is invisible.

**Skill Definition**
```markdown
# AI Writing Detox

Eliminate phrases that signal AI-generated content.

## Banned Words (Never Use)
- delve, realm, tapestry, landscape, multifaceted
- crucial, vital, key (as filler)
- embark, unveil, unlock, harness, leverage
- robust, seamless, comprehensive, cutting-edge
- utilize (use "use"), facilitate (use "help")

## Banned Patterns
❌ "It's important to note that..." → Just state it
❌ "In today's [X] landscape..." → Delete entirely
❌ "Let's dive/delve into..." → Just start
❌ "This is a game-changer" → Describe the actual change
❌ "At its core..." → Just say what it is
❌ "At the end of the day..." → Delete

## Banned Structures
❌ Starting with "So," or "Well,"
❌ "To be fair," "To be honest," "Honestly,"
❌ "Here's the thing:" or "Here's the deal:"
❌ Ending with "...and that's a wrap!" or "...and that's okay!"
❌ "Without further ado..."

## The Test
Read it aloud. Does it sound like how you'd explain this to a colleague? If it sounds like a LinkedIn post or a press release, rewrite it.

## Voice Principle
Write like you talk. If you wouldn't say "utilize" out loud, don't write it.

## Case Sensitivity
Use Sentence case for headings, not Title Case.
❌ "Getting Started With Your New Project"
✅ "Getting started with your new project"
```

**Triggers**
- Writing documentation, READMEs
- Creating content for the resource kit
- Any user-facing text

---

### Skill 9: Frontend Authenticity

**The Problem (Where Claude Fails)**
Claude generates visually generic UIs: purple gradients, Inter font, the same card layouts, predictable hover states. The result looks AI-generated because it IS the median of every design Claude has seen.

**Core Expertise to Transfer**
Think like a designer who's sick of seeing the same purple gradient on every AI-generated site. Character comes from constraints and context. A tool for journalists should look different than a tool for developers. The question isn't "what looks good?" but "what looks like THIS?"

**Skill Definition**
```markdown
# Frontend Authenticity

Create UIs with character, not generic "modern" aesthetics.

## What to Avoid (The AI Slop Checklist)
❌ Purple gradients (especially purple-to-pink)
❌ Inter or system-ui as the only font
❌ Perfect 16px/24px/32px spacing everywhere
❌ Cards with identical border-radius everywhere
❌ Blurred background circles/blobs
❌ Generic hero sections with gradient text
❌ "Modern minimal" that looks like every SaaS landing page

## How to Find Character
Ask: "What should this FEEL like?"
- A journalism tool → Credible, serious, maybe newspaper-inspired
- A developer tool → Technical, dense, terminal-influenced
- A creative tool → Playful, unexpected, rule-breaking
- An archive → Historical, preservation-focused, timeless

## Concrete Techniques
- **Typography:** Pick ONE distinctive display font, pair with reliable body
- **Color:** Start with ONE accent color, not a rainbow
- **Spacing:** Let rhythm be irregular—not everything needs to be 8px grid
- **Borders:** Vary them. Some sharp, some rounded, some none
- **Motion:** Less is more. One signature animation beats five subtle ones

## The Context Test
Show someone the UI with no labels. Can they guess what domain it's for?
If no → Add more context-specific character
If yes → You've found the right aesthetic

## For Amditis Specifically
The character is: cyberpunk, terminal-inspired, dark, high-contrast
Key elements: void backgrounds, acid-green accents, scanline effects, cut corners
```

**Triggers**
- Creating new UI components
- Designing new pages
- Reviewing design implementations

---

### Skill 10: Model Name Validator

**The Problem (Where Claude Fails)**
AI model names change constantly. Claude might use "GPT-4o" (outdated) instead of "GPT 5.1" or "Claude 4 Opus" instead of "Claude 4.5 Opus". This creates inconsistencies and outdated references.

**Core Expertise to Transfer**
Think like someone maintaining a comparison chart across model versions. You track when names change and update all references. Consistency matters because users trust this as authoritative.

**Skill Definition**
```markdown
# Model Name Validator

Use current model names consistently across all content.

## Current Naming (December 2025)
| Company | Correct Name | DO NOT USE |
|---------|-------------|------------|
| Anthropic | Claude 4.5 Opus | Claude 4 Opus, Claude Opus |
| Anthropic | Claude 4.5 Sonnet | Claude 4 Sonnet, Claude Sonnet |
| Google | Gemini 3.0 Pro | Gemini 2.x, Gemini Pro |
| Google | Gemini 3.0 Flash | Gemini 2.x Flash |
| OpenAI | Codex (GPT 5.1) | Codex, GPT-4, GPT-4o |
| OpenAI | GPT 5.1 | GPT-4, GPT-4o, GPT-4 Turbo |

## When Writing About Models
- Always use full name on first mention: "Claude 4.5 Opus"
- Subsequent mentions can shorten: "Claude" or "Opus"
- Never use old version numbers
- Include parenthetical only when helpful: "Codex (GPT 5.1)"

## Cross-Reference Check
When adding a new model reference:
1. Check if it exists in model-info.json
2. Use EXACT same spelling
3. If it's a new model, add to model-info.json first

## Files That Need Consistency
- llm-advisor/data/model-info.json (source of truth)
- llm-advisor/data/tool-comparison.json
- llm-advisor/data/case-studies.json
- llm-advisor/data/decision-tree.json
- downloads/LLM-COMPARISON.md
- vibe-coding-guide.md
- Any markdown/HTML mentioning models

## Update Process
When a model version changes:
1. Update model-info.json first
2. Search all files for old name
3. Replace systematically
4. Update changelog.json with version note
```

**Triggers**
- Writing about AI models
- Adding new tools to comparison
- Reviewing content for accuracy

---

## Implementation Priority

### Immediate (High Impact, Low Effort)
1. **AI Writing Detox** - Improves all content immediately
2. **Model Name Validator** - Prevents inconsistencies
3. **Template Selector** - Helps users pick right template

### Short-term (High Impact, Medium Effort)
4. **Amditis Theme Expert** - Prevents styling regressions
5. **LLM Advisor Event Architecture** - Prevents common bugs
6. **Project Memory Generator** - Improves new project setup

### Medium-term (Medium Impact, Higher Effort)
7. **LLM Advisor Data Schema Expert** - Ensures data quality
8. **State Management Debugger** - Helps with complex debugging
9. **Project Retrospective Writer** - Captures institutional knowledge
10. **Frontend Authenticity** - Improves design quality

---

## Next Steps

1. **Test each skill** on a real scenario
2. **Iterate** based on where the skill falls short
3. **Finalize** into optimal structure per the 10-step methodology
4. **Store** as `.claude/skills/` or similar location for activation
