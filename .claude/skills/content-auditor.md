---
name: content-auditor
context: fork
description: Runs parallel audits on LLM Advisor content for quality assurance
---

# Content Auditor Skill

This skill spawns parallel sub-agents to audit different aspects of the LLM Advisor content simultaneously, leveraging Claude Code's new forked context feature.

## When to Use

- Before major releases or deployments
- After bulk content updates
- When validating contributed content
- During periodic quality reviews

## Audit Tasks (Run in Parallel)

When this skill is invoked, spawn these three parallel sub-agents using the Task tool:

### 1. Model Name Audit Agent

Search all JSON and HTML files for outdated AI model names:
- Check for: "Claude 4 Opus", "Claude 3", "GPT-4o", "GPT-4", "Gemini 2.", "Gemini 1."
- Report file, line number, and suggested replacement
- Files to check: `resource-kit/docs/llm-advisor/data/*.json`, `resource-kit/docs/**/*.html`

### 2. Link Validator Agent

Validate all external URLs in case studies and documentation:
- Extract URLs from `case-studies.json` and `best-practices.json`
- Check HTTP status codes (200 OK, redirects, 404s)
- Report broken or redirected links
- Suggest archive.org alternatives for dead links

### 3. Content Consistency Agent

Check for consistency across all data files:
- Model names match between `model-info.json` and `decision-tree.json`
- Tool names are consistent across all files
- Category labels match across decision tree and comparisons
- No orphaned references (items referenced but not defined)

## Output Format

Return a consolidated audit report:

```markdown
## Content Audit Report

### Model Names
- ✅ All model names current
  OR
- ⚠️ Found 3 outdated references:
  - file.json:42 - "GPT-4o" → "GPT 5.1"

### External Links
- ✅ All 15 links valid
  OR
- ⚠️ Found 2 issues:
  - case-studies.json: example.com/article (404)

### Content Consistency
- ✅ All references valid
  OR
- ⚠️ Found inconsistencies:
  - "Claude Opus" vs "Claude 4.5 Opus" mismatch
```

## Usage

```
/content-auditor
```

Or invoke when quality assurance is needed before deployment.
