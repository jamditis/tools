---
name: llm-advisor-event-architecture
description: Handle event delegation correctly in the LLM Advisor app. Activate when adding buttons, debugging click handlers, or modifying UI interactions.
---

# LLM Advisor Event Architecture

The LLM Advisor uses event delegation, but with a critical architectural constraint you must understand before adding any event handlers.

## When to activate

- Adding new buttons to sidebar, modal, or main content
- Debugging "button doesn't work" or "click not firing" issues
- Modifying event handling in app.js
- Reviewing PRs that touch JavaScript event code
- Creating new interactive features

## Core concept

**The sidebar and modal are OUTSIDE the main container.** Event delegation on the container won't catch events from elements outside it. This is the #1 source of event handling bugs.

## DOM architecture

```
<body>
  ├── #sidebar                          ← OUTSIDE container
  │   ├── #show-comparison-btn
  │   ├── #case-studies-btn
  │   ├── #best-practices-btn
  │   └── #model-info-btn
  │
  ├── #llm-tool-advisor-container       ← Delegated listener here
  │   ├── #main-content
  │   ├── #progress-bar
  │   ├── #breadcrumb
  │   └── .option-button (dynamic)
  │
  └── #universal-modal                  ← OUTSIDE container
      ├── #modal-close-btn
      ├── .compare-tool-btn (dynamic)
      └── .model-pill-btn (dynamic)
```

## Decision rule

| Element Location | Event Pattern |
|-----------------|---------------|
| Inside `#llm-tool-advisor-container` | Use delegation via `e.target.closest()` |
| Outside (sidebar, modal) | Attach listener directly to element |

## Patterns

### Pattern 1: Container delegation (for elements INSIDE)

```javascript
container.addEventListener('click', e => {
    const button = e.target.closest('button');
    if (!button) return;

    if (button.classList.contains('option-button')) {
        handleOptionSelect(e);
    }
    if (button.id === 'back-btn') {
        handleBack();
    }
    if (button.id === 'restart-btn') {
        handleRestart();
    }
});
```

### Pattern 2: Direct attachment (for elements OUTSIDE)

```javascript
// Sidebar buttons - attach directly
const showComparisonBtn = document.getElementById('show-comparison-btn');
if (showComparisonBtn) {
    showComparisonBtn.addEventListener('click', () => {
        showModal('Tool comparison', renderComparisonModal);
    });
}
```

### Pattern 3: Modal delegation (separate from container)

```javascript
// Modal has its own delegated listener
universalModal.addEventListener('click', e => {
    const button = e.target.closest('button');
    if (!button) return;

    if (button.id === 'modal-close-btn') {
        hideModal();
        return;
    }
    if (button.classList.contains('compare-tool-btn')) {
        toggleComparisonTool(button.dataset.tool);
        renderComparisonModal();
    }
});
```

## Failure modes

| Failure | Symptom | Cause | Fix |
|---------|---------|-------|-----|
| Silent failure | Button click does nothing | Handler on container, button outside | Attach directly to element |
| Null reference | TypeError on addEventListener | Element doesn't exist yet | Add `if (element)` check |
| Duplicate handlers | Action fires twice | Same handler in container AND modal | Remove duplicate |
| Wrong target | Wrong button responds | `e.target` instead of `e.target.closest()` | Use `.closest('button')` |

## Checklist for adding new buttons

1. **Determine location:** Is this inside or outside container?
2. **Choose pattern:** Delegation (inside) or direct (outside)
3. **Check existence:** Always `if (btn)` before `.addEventListener()`
4. **Verify scope:** Don't duplicate handlers between container and modal
5. **Test:** Click the button. Does it fire once and only once?

## File reference

Event handling code locations in `/resource-kit/docs/llm-advisor/app.js`:
- Container delegation: ~line 470
- Sidebar buttons: ~lines 533-547
- Modal listener: ~line 502

## Related skills

- `state-management-debugger` - Debug state changes from event handlers
- `llm-advisor-data-schema` - Understand data passed via button attributes

---
*Skill version: 1.1 | Updated: December 2025*
