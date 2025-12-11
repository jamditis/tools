# CLAUDE.md - [Project Name]

> Template for: Event websites (conferences, workshops, campaigns)
> Copy to: `./CLAUDE.md` or `./.claude/CLAUDE.md` in your project root
>
> **What is this?** CLAUDE.md is a memory file that gives Claude Code persistent context about your project. It's automatically read at the start of every conversation, so Claude understands your codebase, conventions, and preferences without you having to re-explain them.
>
> **Official docs:** https://code.claude.com/docs/en/memory

## Project overview

[One sentence: What event this site promotes and when it happens]

**Event date(s):** [Specific dates]
**Event type:** [Conference, workshop, campaign, etc.]
**Audience:** [Who attends]
**Status:** [Planning, registration open, post-event, archived]

## Tech stack

**Framework:** [Static HTML, Next.js, Hugo, etc.]
**Hosting:** [Vercel, Netlify, GitHub Pages]
**CMS:** [If applicable: Sanity, Contentful, etc.]
**Registration:** [Eventbrite, Tito, custom, etc.]

## Common commands

```bash
# Development
[command to start dev server]

# Build
[command to build for production]

# Deploy
[command to deploy, or auto-deploy notes]

# Content updates
[how to update speakers, schedule, etc.]
```

## Site structure

```
/                   # Landing page
/schedule           # Event schedule
/speakers           # Speaker bios
/register           # Registration
/venue              # Location info
/about              # About the event
```

## Content management

**Speakers:**
- [Where speaker data lives: JSON, CMS, etc.]
- [Required fields: name, bio, photo, talk title]
- [Image specs: dimensions, format]

**Schedule:**
- [Format: time blocks, tracks, sessions]
- [Timezone handling]

**Sponsors:**
- [Sponsor tiers and logo requirements]

## Design system

- **Primary color:** [hex code]
- **Accent color:** [hex code]
- **Font:** [display and body fonts]
- **Logo:** [location and variants]

## Key dates and deadlines

- [ ] [Date]: Call for speakers opens
- [ ] [Date]: Early bird registration ends
- [ ] [Date]: Schedule finalized
- [ ] [Date]: Event day(s)
- [ ] [Date]: Recordings published

## Integrations

- **Registration:** [Platform and embed method]
- **Email:** [Newsletter signup, integration]
- **Analytics:** [GA4, Plausible, etc.]
- **Social:** [Embed feeds, share buttons]

## Accessibility requirements

- Color contrast: WCAG AA minimum
- Alt text for all images
- Keyboard navigation
- Screen reader testing

## Post-event updates

After the event:
- [ ] Update status to "Past Event"
- [ ] Add recording links
- [ ] Publish slide decks
- [ ] Archive registration links

## Things to avoid

- Don't remove speaker pages after event
- Avoid time-sensitive content without dates
- Don't break URLs that may be shared

---

*Update dates and status as the event progresses.*
