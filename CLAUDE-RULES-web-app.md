# CLAUDE.md - [Project Name]

> Template for: Web applications (React, Vue, Next.js, static sites)
> Copy to: `./CLAUDE.md` or `./.claude/CLAUDE.md` in your project root
>
> **What is this?** CLAUDE.md is a memory file that gives Claude Code persistent context about your project. It's automatically read at the start of every conversation, so Claude understands your codebase, conventions, and preferences without you having to re-explain them.
>
> **Official docs:** https://code.claude.com/docs/en/memory

## Project overview

[One sentence: What this web app does and who uses it]

**Framework:** [React, Vue, Svelte, Next.js, etc.]
**Styling:** [Tailwind, CSS Modules, styled-components, etc.]
**State:** [Redux, Zustand, Context, Pinia, etc.]
**Deployment:** [Vercel, Netlify, AWS, etc.]

## Common commands

```bash
# Development
npm run dev              # Start dev server at localhost:3000

# Testing
npm test                 # Run test suite
npm run test:watch       # Watch mode

# Build & Deploy
npm run build            # Production build
npm run preview          # Preview production build locally

# Code quality
npm run lint             # Check for issues
npm run format           # Auto-format code
```

## Code style

- Use [2/4] space indentation
- Component files: `PascalCase.tsx`
- Utility files: `kebab-case.ts`
- CSS/style files: `component-name.module.css`
- Prefer named exports over default exports
- [Functional components only / class components for X]

## Component patterns

- Components live in `src/components/`
- Each component gets its own folder: `ComponentName/index.tsx`
- Co-locate styles: `ComponentName/styles.module.css`
- Co-locate tests: `ComponentName/ComponentName.test.tsx`

## Styling rules

- Use [Tailwind classes / CSS modules / styled-components]
- Design tokens defined in: `[path to theme/tokens]`
- Responsive breakpoints: `sm:640px, md:768px, lg:1024px, xl:1280px`
- Dark mode: [approach - CSS variables, Tailwind dark:, etc.]

## State management

- Global state: [where it lives, how to add]
- Server state: [React Query, SWR, etc.]
- Form state: [React Hook Form, Formik, native]
- URL state: [query params approach]

## API integration

- API client location: `src/lib/api.ts`
- Base URL configured in: `.env.local`
- Authentication: [how auth tokens are handled]
- Error handling pattern: [describe approach]

## File structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Route components (or app/ for Next.js 13+)
├── hooks/          # Custom React hooks
├── lib/            # Utilities and API clients
├── styles/         # Global styles and tokens
└── types/          # TypeScript type definitions
```

## Performance considerations

- Images: Use [next/image, lazy loading approach]
- Code splitting: [approach for routes/components]
- Bundle analysis: `npm run analyze`

## Accessibility requirements

- All images need alt text
- Interactive elements need keyboard support
- Color contrast: [WCAG AA / AAA]
- Screen reader testing: [tool used]

## Environment variables

Required in `.env.local`:
```
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_[OTHER]=
```

## Deployment notes

- Branch `main` auto-deploys to production
- Preview deployments on PRs
- Environment variables set in [Vercel dashboard / etc.]

---

*Keep this updated as the project evolves.*
