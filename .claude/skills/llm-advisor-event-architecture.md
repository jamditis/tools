# LLM Advisor Event Architecture

The LLM Advisor uses event delegation, but with a critical gotcha you must understand before adding any event handlers.

## The DOM architecture

```
<body>
  ├── #sidebar (OUTSIDE container)
  │   ├── #show-comparison-btn
  │   ├── #case-studies-btn
  │   ├── #best-practices-btn
  │   └── #model-info-btn
  │
  ├── #llm-tool-advisor-container (delegated listener here)
  │   ├── #main-content
  │   ├── #progress-bar
  │   ├── #breadcrumb
  │   └── .option-button elements
  │
  └── #universal-modal (OUTSIDE container)
      ├── #modal-close-btn
      ├── .compare-tool-btn elements
      └── .model-pill-btn elements
```

## The rule

| Element Location | How to Handle Events |
|-----------------|---------------------|
| INSIDE `#llm-tool-advisor-container` | Use delegation via `e.target.closest()` |
| OUTSIDE (sidebar, modal) | Attach listener DIRECTLY to element |

## Correct pattern: Sidebar buttons

```javascript
// Sidebar buttons are OUTSIDE container - attach directly
const showComparisonBtn = document.getElementById('show-comparison-btn');
if (showComparisonBtn) {
    showComparisonBtn.addEventListener('click', () => {
        showModal('Tool comparison', renderComparisonModal);
    });
}

// Same for other sidebar buttons
const caseStudiesBtn = document.getElementById('case-studies-btn');
if (caseStudiesBtn) {
    caseStudiesBtn.addEventListener('click', () => {
        showModal('Case studies', renderCaseStudiesModal);
    });
}
```

## Correct pattern: Modal buttons

```javascript
// Modal is OUTSIDE container - needs its own listener
universalModal.addEventListener('click', e => {
    const button = e.target.closest('button');
    if (!button) return;

    if (button.id === 'modal-close-btn') {
        hideModal();
        return;
    }

    if (button.classList.contains('compare-tool-btn')) {
        const tool = button.dataset.tool;
        toggleComparisonTool(tool);
        renderComparisonModal();
    }

    if (button.classList.contains('model-pill-btn')) {
        const modelName = button.dataset.modelName;
        showModal('Model information', renderModelInfoModal, modelName);
    }
});
```

## Correct pattern: Container delegation

```javascript
// Elements INSIDE container can use delegation
container.addEventListener('click', e => {
    const button = e.target.closest('button');
    if (!button) return;

    // These elements ARE inside the container
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

## What breaks (common mistakes)

```javascript
// WRONG - Adding sidebar button to container listener
container.addEventListener('click', e => {
    if (e.target.id === 'show-comparison-btn') {
        // This NEVER fires - button is outside container!
        showModal(...);
    }
});

// WRONG - Expecting modal buttons via container
container.addEventListener('click', e => {
    if (e.target.classList.contains('compare-tool-btn')) {
        // This NEVER fires - button is in modal, outside container!
    }
});

// WRONG - Not checking if element exists
document.getElementById('new-btn').addEventListener('click', ...);
// Throws error if element doesn't exist
```

## Before adding any event handler

Ask yourself:
1. Where does this element live in the DOM?
2. Is it inside or outside `#llm-tool-advisor-container`?
3. If outside → attach directly to element
4. If inside → use container delegation
5. Always check element exists before attaching: `if (btn) { btn.addEventListener... }`

## File reference

Event handling code is in `/resource-kit/docs/llm-advisor/app.js`:
- Container delegation: ~line 470
- Sidebar buttons: ~lines 533-547
- Modal listener: ~line 502
