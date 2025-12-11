# CLAUDE.md - [Project Name]

> Template for: Browser extensions (Chrome, Firefox, Safari)
> Copy to: `./CLAUDE.md` or `./.claude/CLAUDE.md` in your project root
>
> **What is this?** CLAUDE.md is a memory file that gives Claude Code persistent context about your project. It's automatically read at the start of every conversation, so Claude understands your codebase, conventions, and preferences without you having to re-explain them.
>
> **Official docs:** https://code.claude.com/docs/en/memory

## Project overview

[One sentence: What this extension does and who uses it]

**Browsers:** [Chrome, Firefox, Safari, Edge]
**Manifest version:** [MV2 or MV3]
**Language:** [TypeScript, JavaScript]
**Build tool:** [Webpack, Vite, none]

## Common commands

```bash
# Development
[command to build for development]
[command to watch for changes]

# Production build
[command to build for store submission]

# Load extension
# Chrome: chrome://extensions > Load unpacked > select dist/
# Firefox: about:debugging > Load Temporary Add-on > select manifest.json
```

## Architecture

- **Background:** [service worker (MV3) or background page (MV2)]
- **Content scripts:** [what pages they run on]
- **Popup:** [popup UI if applicable]
- **Options:** [settings page if applicable]
- **Sidepanel:** [if applicable]

## File structure

```
project-root/
├── src/
│   ├── background/     # Service worker / background script
│   ├── content/        # Content scripts
│   ├── popup/          # Popup UI
│   ├── options/        # Options page
│   └── shared/         # Shared utilities
├── public/             # Static assets
├── manifest.json       # Extension manifest
└── dist/               # Built extension
```

## Manifest permissions

```json
{
  "permissions": [
    "[list required permissions]"
  ],
  "host_permissions": [
    "[list host patterns]"
  ]
}
```

## Code style

- [TypeScript strict mode: yes/no]
- [Component pattern for UI]
- [Message passing conventions]
- [Storage key naming]

## Message passing

```typescript
// Content -> Background
chrome.runtime.sendMessage({ type: 'ACTION_NAME', payload: data })

// Background -> Content
chrome.tabs.sendMessage(tabId, { type: 'ACTION_NAME', payload: data })
```

## Storage

- **sync:** [user preferences, synced across devices]
- **local:** [larger data, device-specific]
- [Storage key schema]

## Testing

- Unit tests for utilities
- Integration tests for message passing
- Manual testing checklist:
  - [ ] Fresh install
  - [ ] Extension update
  - [ ] All target sites
  - [ ] Incognito mode
  - [ ] Multiple tabs

## Store submission

**Chrome Web Store:**
- [Store listing URL]
- [Review requirements]
- [Screenshots needed]

**Firefox Add-ons:**
- [AMO listing URL]
- [Source code requirements]

## Security considerations

- [Content Security Policy]
- [Permissions justification]
- [Data handling practices]
- [External API calls]

## Things to avoid

- Don't request unnecessary permissions
- Avoid `externally_connectable` without good reason
- Don't use `eval()` or inline scripts
- Avoid `activeTab` when specific hosts work

---

*Keep this updated as browser APIs or store policies change.*
