---
name: amditis-theme-expert
description: Apply the Amditis cyberpunk dark theme correctly. Activate when styling any component, page, or UI element in this repository.
---

# Amditis Theme Expert

You are styling for the Amditis dark cyberpunk theme. This is NOT a light/dark toggle system—it's permanent dark mode with a specific character.

## When to activate

- Creating new HTML pages or components
- Styling existing elements or fixing visual issues
- Reviewing PRs that touch CSS or Tailwind classes
- Adding new UI patterns to the resource kit
- Debugging "why does this look wrong" issues

## Core concept

The Amditis theme has one rule: **everything belongs on a spaceship console from 2087**. If it looks like a generic SaaS dashboard, Bootstrap template, or default Tailwind—you've failed.

## Color system

| Token | Hex | Usage |
|-------|-----|-------|
| `bg-void` | #050505 | Page background, deepest layer |
| `bg-panel` | #0a0a0a | Card/panel backgrounds |
| `bg-surface` | #111111 | Interactive elements, buttons |
| `text-chrome` | #e8e8e8 | Primary text |
| `text-gray-400/500/600` | — | Secondary, tertiary, muted text |
| `text-acid` / `bg-acid` | #c8ff00 | Primary accent, CTAs, success |
| `text-ice` / `bg-ice` | #00f0ff | Secondary accent, links, info |
| `text-signal` / `bg-signal` | #ff3366 | Warnings, errors, alerts |

**Border rule:** ALWAYS `border-white/10` or `border-white/5`. Never solid colors.

## Typography

| Element | Class | Font |
|---------|-------|------|
| Headings | `font-display` | Chakra Petch |
| Code/Labels | `font-mono` | Share Tech Mono |
| Body | `font-sans` | Chakra Petch |

**Banned fonts:** Arial, Inter, Helvetica, system-ui, sans-serif defaults.

## Utility classes

```css
.clip-notch        /* Cut corner - bottom right */
.clip-notch-top    /* Cut corner - top left */
.crt-overlay       /* Scanline effect (hero only) */
.glitch-text       /* Animated glitch (hero titles only) */
.cyber-checkbox    /* Checkbox with acid glow */
.bg-grid-pattern   /* Matrix-like grid background */
```

## Anti-patterns (never use)

| Wrong | Why |
|-------|-----|
| `bg-white`, `bg-gray-100` | Light backgrounds break dark theme |
| `dark:` prefixed classes | No dark mode toggle exists |
| `border-gray-300` | Use `border-white/10` instead |
| Purple gradients | Generic AI aesthetic |
| `rounded-lg` everywhere | Mix sharp (`clip-notch`) and rounded |
| Inter/Arial fonts | Breaks cyberpunk character |

## Example: Correct vs wrong

```html
<!-- ✅ CORRECT -->
<div class="bg-panel border border-white/10 p-6 clip-notch">
  <h3 class="font-display text-xl text-chrome mb-2">Card Title</h3>
  <p class="text-gray-400">Card description.</p>
  <button class="bg-acid text-void px-4 py-2 font-mono text-sm mt-4">
    ACTION
  </button>
</div>

<!-- ❌ WRONG -->
<div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
  <h3 class="text-xl font-semibold text-gray-900">Card Title</h3>
  ...
</div>
```

## Hover and focus states

```css
/* Buttons */
hover:bg-acid/90 or hover:brightness-110

/* Links */
hover:text-acid transition-colors

/* Cards */
hover:border-white/20

/* Focus */
focus:ring-2 focus:ring-acid/50 focus:outline-none
```

## Common failure modes

| Failure | Symptom | Fix |
|---------|---------|-----|
| Wrong background | Element looks "floated" or washed out | Use `bg-panel` or `bg-surface` |
| Missing border | Cards blend into background | Add `border border-white/10` |
| Wrong text color | Text too bright or too dim | Use `text-chrome` for primary |
| Generic look | Could be any website | Add `clip-notch`, use `font-display` |

## Related skills

- `frontend-authenticity` - Broader principles for avoiding generic UI
- `ai-writing-detox` - Avoid generic patterns in content too

---
*Skill version: 1.1 | Updated: December 2025*
