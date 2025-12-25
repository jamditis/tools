# Amditis Theme Expert

You are styling for the Amditis dark cyberpunk theme. This is NOT a light/dark toggle system—it's permanent dark mode with a specific character.

## Color system (memorize these)

**Backgrounds:**
- `bg-void` (#050505) - Deepest black, page background
- `bg-panel` (#0a0a0a) - Card/panel backgrounds
- `bg-surface` (#111111) - Interactive elements, buttons

**Text:**
- `text-chrome` (#e8e8e8) - Primary text
- `text-gray-400` - Secondary text
- `text-gray-500` - Tertiary text
- `text-gray-600` - Muted text

**Accents:**
- `text-acid` / `bg-acid` (#c8ff00) - Primary green accent, CTAs, success
- `text-ice` / `bg-ice` (#00f0ff) - Blue/cyan accent, links, info
- `text-signal` / `bg-signal` (#ff3366) - Red accent, warnings, errors

**Borders:**
- ALWAYS use `border-white/10` or `border-white/5`
- NEVER use solid color borders like `border-gray-300`

## Typography

- Headings: `font-display` (Chakra Petch) - Tech/cyberpunk look
- Code/Labels: `font-mono` (Share Tech Mono) - Terminal aesthetic
- Body: `font-sans` (Chakra Petch)
- NEVER use Arial, Inter, Helvetica, or system fonts

## Utility classes available

```css
.clip-notch        /* Cut corner effect - bottom right */
.clip-notch-top    /* Cut corner effect - top left */
.crt-overlay       /* Scanline effect (use sparingly, hero only) */
.glitch-text       /* Animated glitch effect (hero titles only) */
.cyber-checkbox    /* Styled checkbox with acid glow */
.bg-grid-pattern   /* Subtle matrix-like grid background */
```

## What you must NEVER do

- Use `bg-white`, `bg-gray-100`, or any light backgrounds
- Use `dark:` prefixed classes (no dark mode toggle exists)
- Use pre-colored borders like `border-gray-300` or `border-slate-200`
- Default to purple gradients or generic "tech" aesthetics
- Use Inter, Arial, or system-ui fonts
- Create light/dark theme toggles

## The character test

When styling new components, ask: "Does this look like it belongs on a spaceship console from 2087?"

If it looks like a generic SaaS dashboard or a Bootstrap template, you've failed.

## Example: A card component

```html
<!-- CORRECT -->
<div class="bg-panel border border-white/10 p-6 clip-notch">
  <h3 class="font-display text-xl text-chrome mb-2">Card Title</h3>
  <p class="text-gray-400">Card description text.</p>
  <button class="bg-acid text-void px-4 py-2 font-mono text-sm mt-4">
    ACTION
  </button>
</div>

<!-- WRONG - Generic styling -->
<div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
  <h3 class="text-xl font-semibold text-gray-900">Card Title</h3>
  ...
</div>
```

## Hover and focus states

- Buttons: `hover:bg-acid/90` or `hover:brightness-110`
- Links: `hover:text-acid` transition
- Cards: `hover:border-white/20` subtle border brighten
- Focus: `focus:ring-2 focus:ring-acid/50 focus:outline-none`
