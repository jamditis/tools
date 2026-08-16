# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Bug-fixing workflow

When a bug is reported, don't immediately attempt to fix it. Instead:

1. **Write a failing test first** that reproduces the bug
2. **Implement the smallest fix** that addresses the reproduced behavior
3. **Verify the fix** with the focused test and the broader relevant suite

---

## Project overview

The LLM journalism tool advisor is a multi-file web application that helps journalists select appropriate AI/LLM tools for specific workflows. It features an interactive decision tree interface that guides users through questions about their journalism tasks and provides tailored recommendations for AI tools like Claude, Gemini, ChatGPT, and specialized services.

## Architecture

**Multi-file structure:** The application is organized into separate files for maintainability and collaboration:
- `index.html` - Clean HTML structure
- `styles.css` - Custom CSS styles
- `app.js` - Application logic and data loading
- `data/` - Six JSON files containing all content data

**Core technologies:**
- Compiled Tailwind CSS from `resource-kit/docs/assets/tailwind.css`
- Amditis V3 theme tokens from `resource-kit/docs/assets/amditis-v3.css`
- Vanilla JavaScript for all functionality
- JSON files for content data storage
- Tailwind build and migration checks live in `resource-kit/tailwind-build/`

**Key components:**
- Decision tree engine that maps user journeys through journalism workflows
- Modal system for displaying case studies, best practices, and tool comparisons
- Day/night paper theme shared with the rest of the kit (see below)
- Progress tracking with breadcrumb navigation
- Dynamic data loading via Fetch API

**Data files (data/ directory):**
- `decision-tree.json`: Main navigation structure with questions and options
- `tool-comparison.json`: Comparison data for major AI tools
- `case-studies.json`: Real-world examples from newsrooms
- `best-practices.json`: General AI usage guidelines (includes Gemini 3 advanced techniques)
- `model-info.json`: Detailed information about current model families, tools, and explicitly labeled legacy entries
- `changelog.json`: Version history and updates

## Development workflow

**Running locally:**
Since the application uses the Fetch API to load JSON data, you need to run a local web server. Options:
- Python: `python -m http.server 8000`
- Node.js: `npx http-server`
- VS Code: Use the "Live Server" extension

Then open `http://localhost:8000` in your browser.

**Testing:**
- Run `node scripts/validate-all-json.js`
- Run `cd scripts && npm test`
- Run `cd resource-kit/tailwind-build && npm test`
- Test in both day and night paper using the theme toggle in the app header
- Verify all decision tree paths lead to appropriate recommendations
- Check modal functionality (case studies, best practices, tool comparison, changelog)
- Test breadcrumb navigation and back button functionality
- Verify workflow dropdown selector
- Test on mobile devices (responsive design with mobile-specific optimizations)
- Verify all JSON data loads correctly (check browser console for errors)

**Making updates:**

Content changes are now made in the corresponding JSON files in the `data/` directory:

1. **Adding new tools:** Update `data/model-info.json` and `data/tool-comparison.json`
2. **Adding case studies:** Add entries to `data/case-studies.json` array
3. **Updating recommendations:** Modify tool entries in `data/decision-tree.json`
4. **Adding decision tree nodes:** Extend the tree structure in `data/decision-tree.json`
5. **Updating best practices:** Edit sections in `data/best-practices.json`
6. **Recording changes:** Add new version entry to `data/changelog.json` array

**Updating styles:**
- Reach for the V3 tokens and component classes first (`.note`, `.folio`,
  `.stamp`, `.deckle-card`, `.section-label`) — see the theme section of the root
  `CLAUDE.md`
- Before using a Tailwind class, confirm it is already compiled into
  `assets/tailwind.css`; that file cannot be rebuilt here, and an uncompiled
  class silently does nothing
- Anything genuinely new belongs in `assets/amditis-v3.css`, not in a page-local
  `<style>` block, which would load last and break dark mode for that page

**Updating functionality:**
- Modify `app.js` for behavior changes
- All functions are clearly commented and organized

## Important implementation details

**Theme:** the advisor uses the kit-wide Amditis V3 day/night paper, not a theme
of its own. The toggle lives in `assets/theme.js` and stores the reader's choice
in `localStorage` under **`amditis-theme`**. The old `llm-advisor-theme` key and
the hidden `#theme-toggle-checkbox` are dead; `.switch` is still hidden in
`styles.css` (which the page does not load).

**Color coding:** AI tools carry provider-coded pills chosen by `getPillClasses()`.
The function returns a **class name**, not Tailwind colour utilities:
- Claude: `pill-anthropic` (orange)
- Gemini/Nano Banana: `pill-google` (teal)
- GPT/Codex: `pill-openai` (slate)
- Open-weight families: `pill-open-weight`
- Unmatched: `pill-neutral`

The fills are declared in `assets/amditis-v3.css`. They live there rather than
as arbitrary Tailwind values because `tailwind.css` cannot be rebuilt in this
repo, so a class like `bg-[#ab6121]` that is not already compiled does nothing —
three of the V2 fills were in exactly that state. Every fill is darkened along
its own hue until white text clears 4.6:1; the hue encodes the provider family,
which is real information, so it is preserved.

**Modal system:** Uses a single universal modal (`#universal-modal`) that dynamically updates content based on the type of information being displayed.

**Progress calculation:** Progress bar percentage is calculated based on decision tree depth, with recommendations showing 100% completion.

**Mobile optimization:** Compact layout automatically applies to smaller screens with adjusted typography and spacing.

## Reference materials

`gemini-3-prompting-guide.md` contains best practices for prompting Gemini 3, useful context when updating AI-related recommendations or guidance.

Current-facing model guidance was verified August 15, 2026. Re-check official provider model, lifecycle, and pricing pages before changing recommendations. Historical case studies and changelog entries should retain the names that were accurate when written.

## Brand guidelines

This tool follows Center for Cooperative Media brand standards:
- Use sentence case for all headings and UI copy (never title case)
- No console decoration as structure. V2 labelled the views `QUERY_01`,
  `ANALYSIS_COMPLETE`, `RECOMMENDED_MODELS` and `[ START_NEW_QUERY ]`; V3 uses a
  folio for the step counter and sentence-case note rubrics for the rest
- Decision-tree options are ruled rows, not numbered: the task categories have no
  inherent order
- Professional but accessible tone
- Focus on practical journalism applications
- Emphasize human oversight and verification

## Common tasks

**Update a tool recommendation:**
1. Open `data/decision-tree.json`
2. Find the relevant workflow node and its tools array
3. Modify the tool name, description, prompt, or tips
4. Save the file
5. Add changelog entry to `data/changelog.json` if significant change

**Add a new case study:**
1. Open `data/case-studies.json`
2. Add new object to array with required fields: title, tool, journalist, challenge, solution, outcome, quote, tips, sourceUrl
3. Save the file
4. Add changelog entry to `data/changelog.json` documenting the addition

**Modify decision tree:**
1. Open `data/decision-tree.json`
2. Find relevant node (e.g., "research", "content", etc.)
3. Update question text, modify options array, or add new branches
4. Ensure all paths eventually lead to a node with tools or to "recommendation"
5. Save the file

**Add/update AI model information:**
1. Open `data/model-info.json` for detailed descriptions
2. Open `data/tool-comparison.json` for comparison table data
3. Add or modify model entries
4. For new models, also update color coding in `app.js` (`getPillClasses` function) if needed — the returned value is a `pill-*` class declared in `assets/amditis-v3.css`
5. Save files

**Update best practices:**
1. Open `data/best-practices.json`
2. Add items to existing arrays or create new sections
3. Save the file

**Update styling:**
1. Modify `styles.css` for custom CSS changes
2. For Tailwind config changes, edit the `<script>` section in `index.html`
3. For tool color coding, add a `pill-*` class in `assets/amditis-v3.css` and map
   it in `getPillClasses()` in `app.js`. Check white text clears 4.5:1 on the new
   fill

## FTP deployment

The entire directory can be uploaded to a web server via FTP:
1. Upload all files maintaining directory structure
2. Ensure `data/` directory and all JSON files are included
3. The application will work immediately - no build step required
4. Target URL: `https://centerforcooperativemedia.org/tools/llmadvisor/`
