# Frontend Authenticity

Create UIs with character, not generic "modern" aesthetics. Think like a designer who's sick of seeing the same purple gradient on every AI-generated site.

## The AI slop checklist (avoid all of these)

**Colors:**
- Purple-to-pink gradients
- Teal-to-blue gradients
- Any gradient as the primary visual element
- Blurred background circles/blobs
- Rainbow gradients on text

**Typography:**
- Inter as the only font
- System-ui with no character
- Giant hero text with gradient fill
- Perfectly uniform 16/24/32px sizing

**Layout:**
- Cards with identical border-radius everywhere
- Perfect 8px grid with no variation
- Hero → Features → CTA → Footer (every SaaS ever)
- Three-column feature grids with icons

**Effects:**
- Glassmorphism on everything
- Subtle shadows everywhere
- Hover animations on every element
- Floating decorative elements

## Finding character

Before designing, ask: "What should this FEEL like?"

| Domain | Character | Visual Direction |
|--------|-----------|------------------|
| Journalism tool | Credible, serious | Newspaper-inspired, structured |
| Developer tool | Technical, dense | Terminal-influenced, monospace |
| Creative tool | Playful, unexpected | Rule-breaking, asymmetric |
| Archive | Historical, timeless | Preservation-focused, restrained |
| Data tool | Analytical, precise | Charts, grids, information-dense |
| Newsroom | Fast, urgent | News ticker energy, bold headlines |

## Concrete techniques

### Typography
- Pick ONE distinctive display font for headings
- Pair with a reliable, readable body font
- Let the display font carry the character
- Don't use more than 2 font families

### Color
- Start with ONE accent color, not a palette
- Build from neutrals, add color sparingly
- Let whitespace (or darkspace) do work
- Accent color should mean something (action, highlight)

### Spacing
- Not everything needs to be on 8px grid
- Let rhythm be intentional, not mechanical
- Dense where information matters, spacious where it doesn't
- Vary spacing to create hierarchy

### Borders
- Mix sharp and rounded intentionally
- Some elements: sharp corners (technical feel)
- Some elements: rounded (approachable)
- Some elements: no border at all

### Motion
- One signature animation beats five subtle ones
- Motion should have purpose (feedback, attention, delight)
- No animation is better than generic animation
- Don't animate just because you can

## The context test

Show someone your UI with all labels removed.

Can they guess what domain it's for?
- If no → Add more context-specific character
- If yes → You've found the right aesthetic

Can they tell it's AI-generated?
- If yes → It's too generic, add specificity
- If no → You've escaped the slop

## For this project specifically

The Amditis theme has clear character: **cyberpunk, terminal-inspired, dark, high-contrast**

Key elements:
- Void/panel/surface background layers
- Acid-green (#c8ff00) as primary accent
- Cut corners (clip-notch)
- Scanline effects (sparingly)
- Monospace for labels/codes
- Chrome text on dark backgrounds

When adding to this project, ask: "Does this look like a spaceship console from 2087?"

## Anti-patterns in practice

**Generic SaaS hero:**
```html
<!-- SLOP - Every AI landing page -->
<section class="bg-gradient-to-r from-purple-600 to-pink-500 py-24">
  <h1 class="text-6xl font-bold text-white">
    Transform Your Workflow
  </h1>
  <p class="text-xl text-white/80 mt-4">
    The all-in-one platform for modern teams
  </p>
</section>
```

**Character-driven hero:**
```html
<!-- BETTER - Has specific identity -->
<section class="bg-void py-24 relative">
  <div class="crt-overlay"></div>
  <h1 class="font-display text-6xl text-chrome glitch-text">
    SYSTEM_ONLINE
  </h1>
  <p class="font-mono text-acid mt-4 tracking-widest">
    > JOURNALISM TOOLS LOADED
  </p>
</section>
```

## Questions to ask yourself

1. Could this design be for any product? (If yes, it's too generic)
2. Does the typography have personality? (If Inter/system, probably not)
3. Is there ONE thing that's distinctly "this project"? (If not, find it)
4. Would a user remember this design tomorrow? (If not, add character)
5. Am I using a gradient because it looks good or because I can't think of anything else? (Be honest)

## The minimum viable character

If you're stuck, add at least ONE distinctive element:
- A specific, non-generic font for headings
- An unusual accent color (not blue, not purple)
- A signature border treatment (cut corners, thick borders, dots)
- An intentional layout break (asymmetry, unexpected spacing)
- A domain-appropriate metaphor (newspaper columns, terminal output, file folders)

One strong choice beats five generic ones.
