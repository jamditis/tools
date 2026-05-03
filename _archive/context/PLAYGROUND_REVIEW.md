# Playground projects review

> Generated: 2025-12-10
> Reviewed by: Claude Code (Opus 4.5)

## Overview

The playground directory contains various development projects spanning digital archiving, AI tools, voice interfaces, and experimental applications.

---

## Active projects

### audiobash (NEW)
**Status**: Just created
**Type**: Desktop app (Electron + React + TypeScript)
**Purpose**: Voice-controlled terminal for Claude Code

A new project built to solve the Windows UAC keystroke injection problem. Uses xterm.js + node-pty for an embedded terminal with push-to-talk voice input via Gemini API.

**Key files**:
- `electron/main.cjs` - Electron main process, PTY management
- `src/components/Terminal.tsx` - xterm.js wrapper
- `src/components/VoicePanel.tsx` - Voice input UI
- `src/services/transcriptionService.ts` - Gemini/Parakeet integration

**Next steps**: Test with Claude Code, add settings panel, polish UI.

---

### yap
**Status**: Functional but core problem unsolved
**Type**: Desktop app (Electron + React)
**Purpose**: Voice dictation tool with transcription

Original attempt at voice-to-Claude Code integration. Works for transcription but can't reliably send keystrokes to elevated admin terminals due to Windows UAC.

**What worked**:
- Gemini API transcription
- Audio visualization
- Global hotkeys (Alt+S, Alt+H)
- Tray mode

**What didn't**:
- Keystroke injection to admin terminals
- Windows Speech integration (unreliable)

**Recommendation**: Archive after audiobash proves concept. Keep as reference for transcription code.

---

### rosen-frontend
**Status**: Active development
**Type**: Web app (Windows 95 aesthetic)
**Purpose**: Frontend for Jay Rosen Digital Archive

Knowledge graph visualization interface for the archive system. Part of the three-system integration project.

**Related**: See INTEGRATION_PLAN.md for the full archive unification roadmap.

---

### ccm
**Status**: Unknown
**Type**: Appears to be new
**Purpose**: Unknown - needs exploration

Recently modified (Dec 10). Worth investigating.

---

### pisscord
**Status**: Active
**Type**: Likely a Discord bot or client
**Purpose**: Unknown - needs exploration

---

### pocketlink
**Status**: Unknown
**Type**: Web/mobile app
**Purpose**: Unknown - needs exploration

---

## Reference projects

### rosen-archive / rosen-scraper
**Status**: Active (documented in CLAUDE.md)
**Type**: Python pipelines
**Purpose**: Digital archiving system for Jay Rosen's content

Main backend systems for the archive project. Handles scraping, AI categorization, Google Sheets integration.

---

### image-analyzer / image-classifier
**Status**: Mature
**Type**: Python tools
**Purpose**: Automated image organization with Gemini Vision

---

### contextualizer
**Status**: Unknown
**Type**: Unknown
**Purpose**: Possibly context management tool

---

### gemini / gemini-app-builder
**Status**: Reference
**Type**: Configuration files
**Purpose**: Gemini API integration resources

---

## Archived/inactive

### ARCHIVED/
Contains older project versions or abandoned experiments.

### graveyard/
Dead projects. May contain useful patterns or lessons.

### cli/
Evaluation tools and form submissions for content programs.

### test/
Test directory.

---

## Integration project

The playground hosts a major integration effort documented in `INTEGRATION_PLAN.md`:

**Goal**: Unify three systems into a comprehensive 36-year archive (1989-2025):
1. DeepSeek-OCR (newspaper archive) - 84 articles
2. Rosen Scraper Backend - 765+ records
3. Windows 95 Frontend - knowledge graph

**Target**: 849 unified records, 6,000+ entities, 7,500+ relationships

---

## LESSONS.md templates

Templates for documenting project learnings are available at:
`~/.claude/templates/`

Categories:
- Software: general, desktop-app, browser-extension, web-app, data-pipeline, mobile-app
- Journalism: digital-archive, event-website, content-pipeline, editorial-tool, research-project, publication

---

## Recommendations

1. **Focus on audiobash** - Test it with Claude Code to verify the embedded terminal approach solves the core problem

2. **Document yap lessons** - The LESSONS.md already exists, keep it updated

3. **Explore ccm and pisscord** - Unclear what these are, worth documenting

4. **Archive cleanup** - Consider moving completed or abandoned projects to ARCHIVED/ or graveyard/

5. **Integration project** - Continue with Phase 1 per INTEGRATION_PLAN.md

---

*This review captures the state of playground projects as of December 2025. Update as projects evolve.*
