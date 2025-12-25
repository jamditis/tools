---
name: evaluation-framework
description: Test and validate changes to the resource kit systematically. Activate when testing new features, reviewing PRs, or debugging issues.
---

# Evaluation Framework

Agent outputs are non-deterministic—traditional unit tests don't fully apply. This skill provides evaluation approaches for the Amditis Resource Kit.

## When to activate

- Testing changes before pushing
- Reviewing pull requests
- Debugging reported issues
- Validating data integrity
- Assessing quality of content changes

## Core concept

**Test outcomes, not paths.** Since Claude's responses vary, focus on whether the end result is correct rather than whether it followed a specific sequence.

## Evaluation dimensions

For any change, assess against these dimensions:

| Dimension | Question | How to Test |
|-----------|----------|-------------|
| **Correctness** | Does it do what it should? | Manual verification |
| **Completeness** | Is anything missing? | Checklist against requirements |
| **Consistency** | Does it match existing patterns? | Compare to similar items |
| **Usability** | Can users actually use it? | Click through as a user |
| **Accessibility** | Does it work for everyone? | Keyboard nav, screen reader |

## Testing by component

### JSON data files

```bash
# Syntax validation
cat data/model-info.json | jq .

# Schema validation (check required fields)
# For each entry in model-info.json:
# - description: string, non-empty
# - features: array, non-empty
# - link: valid URL
```

**Cross-reference validation:**
```javascript
// Every tool in case-studies.json must exist in model-info.json
const modelKeys = Object.keys(modelInfo);
caseStudies.forEach(study => {
    if (!modelKeys.includes(study.tool)) {
        console.error(`Invalid tool: ${study.tool}`);
    }
});
```

### Decision tree paths

**Manual path testing:**
1. Start at "start" node
2. Click each option
3. Verify you eventually reach a recommendation
4. Test the back button at each step
5. Verify breadcrumbs match your path

**Automated path validation:**
```javascript
// Check for dead ends
function validatePaths(tree, nodeId = 'start', visited = new Set()) {
    if (visited.has(nodeId)) return; // Prevent cycles
    visited.add(nodeId);

    const node = tree[nodeId];
    if (!node) {
        console.error(`Missing node: ${nodeId}`);
        return;
    }

    node.options?.forEach(opt => {
        if (opt.next === 'recommendation') {
            if (!opt.tools?.length) {
                console.error(`No tools at recommendation: ${nodeId}`);
            }
        } else {
            validatePaths(tree, opt.next, visited);
        }
    });
}
```

### UI components

**Visual regression checklist:**
- [ ] Component renders without console errors
- [ ] Correct colors from Amditis theme
- [ ] Responsive at mobile/tablet/desktop breakpoints
- [ ] Hover states work
- [ ] Focus states visible for keyboard users

**Interaction testing:**
- [ ] All buttons clickable
- [ ] Modals open and close correctly
- [ ] Forms submit properly
- [ ] Error states display when appropriate

### Content quality

Use the `ai-writing-detox` skill checklist:
- [ ] No banned AI phrases ("delve," "landscape," etc.)
- [ ] Sentence case for headings
- [ ] Specific over generic
- [ ] Active voice

## Test stratification

Organize tests by complexity:

| Level | Description | Example |
|-------|-------------|---------|
| **Simple** | Single action, obvious result | Click button, modal opens |
| **Medium** | Multi-step, clear path | Complete decision tree path |
| **Complex** | Ambiguous, multiple valid outcomes | Search finds relevant results |
| **Edge** | Boundary conditions | Empty state, very long input |

## Regression testing

After any change, verify existing functionality:

**Quick smoke test (2 minutes):**
1. Page loads without errors
2. LLM Advisor: complete one path
3. Modal: open and close comparison
4. Mobile: resize and check layout

**Full regression (10 minutes):**
1. All pages load
2. All decision tree paths work
3. All modals function
4. All external links valid
5. Downloads work
6. Search/filtering works

## PR review checklist

When reviewing pull requests:

```markdown
## Code Quality
- [ ] JSON syntax valid
- [ ] No console errors
- [ ] Follows existing patterns
- [ ] No unnecessary changes

## Functionality
- [ ] Feature works as described
- [ ] No regressions introduced
- [ ] Edge cases handled

## Content
- [ ] Model names match current naming
- [ ] No AI slop phrases
- [ ] Links are valid

## Testing
- [ ] Tested locally
- [ ] Multiple browsers (if UI change)
- [ ] Mobile responsive
```

## Debugging approach

When something breaks:

1. **Isolate:** What specific action causes the failure?
2. **Reproduce:** Can you make it fail consistently?
3. **Trace:** Check browser console, network tab
4. **Compare:** Does it work in production? Previous commit?
5. **Fix:** Make minimal change to fix
6. **Verify:** Run full regression after fix

## Automated checks (future)

Potential automation targets:
- JSON schema validation on commit
- Link checking
- Lighthouse performance/accessibility
- Visual regression screenshots

## Related skills

- `development-workflow` - Pipeline for making changes
- `llm-advisor-data-schema` - Schema definitions for validation
- `state-management-debugger` - Debug runtime state issues

---
*Skill version: 1.0 | Updated: December 2025*
