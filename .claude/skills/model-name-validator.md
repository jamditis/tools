---
name: model-name-validator
description: Use exact catalog names in active LLM Advisor recommendations and preserve historical model references.
---

# Model name validator

Use this guidance when adding models, editing active recommendations, or
checking model references across the kit.

## Sources

- `resource-kit/docs/llm-advisor/data/model-info.json` contains the catalog keys.
- `resource-kit/docs/downloads/AI-MODEL-SOURCE-REGISTER.md` records provider,
  pricing, lifecycle, license, and prompting sources. The November 2, 2026
  refresh retains August verification dates for some families.
- `scripts/validate-all-json.js` and `scripts/ai-content-freshness.test.js`
  define the shipped checks. The GitHub-hosted Content checks workflow runs them.

Read these files before suggesting replacements. Do not maintain a second
versioned model list in this skill.

## Naming rules

Model names are lookup keys. Copy the exact catalog spelling into active
recommendation arrays and comparison keys. For example, `Claude Opus 5.5`
and `Claude 5.5 Opus` are different strings.

Distinguish products from models. Codex is a coding agent; its selected model
is a separate choice. ChatGPT is a product name, not a catalog model key.
Use the product name when describing the product and the exact model name
when a recommendation or lookup requires it.

Keep historical case studies, old changelog entries, plans, and frozen
archives as written. A legacy name can also be valid in a migration example
or compatibility table; do not replace every search result automatically.

## Updating active guidance

1. Check official provider sources for the exact name, access, price, and status.
2. Update catalog and comparison entries together.
3. Check decision-tree recommendations, best practices, active pages, downloads,
   Markdown references, and contributor instructions for affected claims.
4. Check `getPillClasses()` in `app.js` if a new model family needs styling.
5. Record a significant change in `changelog.json` and its sources in the register.
6. Read the hosted content check results on the final PR head. Do not run this
   public repository's CI on fleet machines.

The legacy model-name hook is a warning heuristic, not a complete validator.
Use the catalog and source register to decide whether a warning applies.

## Related skills

- `llm-advisor-data-schema` — data shapes and cross-references
- `development-workflow` — contribution workflow
- `evaluation-framework` — verification guidance
