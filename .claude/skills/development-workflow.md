---
name: development-workflow
description: Follow a structured development pipeline for making changes to the LLM Advisor and resource kit. Activate when planning or executing multi-step changes.
---

# Development Workflow

A structured pipeline approach for making changes to the Amditis Resource Kit, designed to minimize errors and make rollback easy.

## When to activate

- Planning multi-step changes to the resource kit
- Adding new features to LLM Advisor
- Making data updates (models, case studies, decision tree)
- Debugging failures in the development process
- Reviewing others' changes

## Core concept

**Validate before automating.** Test your approach manually on one example before building anything systematic. The file system tracks pipeline state—each step creates artifacts that enable recovery.

## The development pipeline

```
1. ACQUIRE   → Gather information (research, requirements)
2. PREPARE   → Plan the change (what files, what edits)
3. PROCESS   → Make the changes
4. VALIDATE  → Test the changes work
5. RENDER    → Deploy/push the changes
```

Stages 1, 2, 4, 5 are deterministic. Stage 3 (the actual work) is where errors happen.

## Pipeline by task type

### Adding a new model/tool

```
1. ACQUIRE
   - Research: official name, features, pricing, link
   - Check existing model-info.json for format

2. PREPARE
   - Draft entries for model-info.json and tool-comparison.json
   - Identify color for getPillClasses() in app.js

3. PROCESS
   - Edit model-info.json (add entry)
   - Edit tool-comparison.json (add entry)
   - Edit app.js getPillClasses() (add color)
   - Edit decision-tree.json (add to relevant recommendations)

4. VALIDATE
   - Run local server: python -m http.server 8000
   - Navigate to tool in LLM Advisor
   - Check model pill renders with correct color
   - Check comparison modal shows new tool

5. RENDER
   - git add, commit, push
   - Verify GitHub Actions deploys successfully
```

### Adding a case study

```
1. ACQUIRE
   - Source URL, journalist name, publication
   - Challenge, solution, quote, tips

2. PREPARE
   - Draft case study object matching schema
   - Verify tool name matches model-info.json

3. PROCESS
   - Add entry to case-studies.json
   - Validate JSON syntax

4. VALIDATE
   - Check case study appears in modal
   - Verify tool color renders correctly
   - Test source URL links work

5. RENDER
   - Commit with descriptive message
   - Push and verify deployment
```

### Modifying decision tree

```
1. ACQUIRE
   - Map current tree structure
   - Identify insertion point for new path

2. PREPARE
   - Draft new node(s) with all required fields
   - Trace all paths to ensure they reach recommendations
   - Check for orphaned nodes

3. PROCESS
   - Edit decision-tree.json
   - Validate JSON syntax

4. VALIDATE
   - Test EVERY path through modified section
   - Verify no dead ends
   - Check breadcrumbs render correctly
   - Test back button works through new paths

5. RENDER
   - Document change in changelog.json
   - Commit and push
```

## State tracking via files

Use the file system to track progress on complex changes:

```
# For multi-file changes, create a tracking file
CHANGE-LOG.md:
- [x] model-info.json updated
- [x] tool-comparison.json updated
- [ ] app.js color mapping
- [ ] decision-tree.json paths
- [ ] Local testing
- [ ] Deployed
```

This enables:
- **Resumption:** Pick up where you left off after interruption
- **Rollback:** Know exactly what was changed
- **Review:** Clear audit trail for PRs

## Validation checklist

Before pushing ANY change:

| Check | Command/Action |
|-------|----------------|
| JSON valid | Paste into jsonlint.com or use `jq` |
| Local server works | `python -m http.server 8000` |
| Page loads without errors | Check browser console |
| Navigation works | Click through affected paths |
| Modals open correctly | Test all modal buttons |
| Mobile responsive | Resize browser or use dev tools |

## Common failure modes

| Failure | Symptom | Prevention |
|---------|---------|------------|
| Invalid JSON | Page blank, console errors | Always validate JSON before commit |
| Mismatched tool name | Empty comparison, wrong color | Copy-paste names from model-info.json |
| Orphaned decision node | Path leads nowhere | Trace all paths before commit |
| Missing required field | Silent failure or crash | Check schema in `llm-advisor-data-schema` |
| Untested path | User hits dead end | Test every path through changes |

## Rollback procedure

If something breaks after push:

```bash
# View recent commits
git log --oneline -5

# Revert last commit (creates new commit)
git revert HEAD
git push

# Or reset to specific commit (destructive, use carefully)
git reset --hard <commit-hash>
git push --force
```

## Cost estimation

Before large changes, estimate scope:

| Change Type | Typical Files | Time Estimate |
|-------------|---------------|---------------|
| Add model | 3-4 files | 15-30 min |
| Add case study | 1 file | 5-10 min |
| New decision path | 1-2 files | 30-60 min |
| UI component | 2-4 files | 1-2 hours |
| Major refactor | Many files | Plan carefully |

## Related skills

- `llm-advisor-data-schema` - JSON schemas for validation
- `evaluation-framework` - Testing approaches
- `context-engineering-fundamentals` - Managing context for long tasks

---
*Skill version: 1.0 | Updated: December 2025*
