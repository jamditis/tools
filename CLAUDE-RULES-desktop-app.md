# CLAUDE.md - [Project Name]

> Template for: Desktop applications (Electron, Tauri, native apps)
> Copy to: `./CLAUDE.md` or `./.claude/CLAUDE.md` in your project root
>
> **What is this?** CLAUDE.md is a memory file that gives Claude Code persistent context about your project. It's automatically read at the start of every conversation, so Claude understands your codebase, conventions, and preferences without you having to re-explain them.
>
> **Official docs:** https://code.claude.com/docs/en/memory

## Project overview

[One sentence: What this app does and who uses it]

**Framework:** [Electron, Tauri, Qt, native, etc.]
**Platforms:** [Windows, macOS, Linux]
**Language:** [TypeScript, Rust, C++, etc.]
**UI framework:** [React, Vue, native widgets, etc.]

## Common commands

```bash
# Development
[command to start dev mode with hot reload]

# Build
[command to build for current platform]
[command to build for all platforms]

# Test
[command to run tests]

# Package/distribute
[command to create installers]
```

## Architecture

- **Main process:** [what runs in main/backend]
- **Renderer:** [what runs in UI/frontend]
- **IPC:** [how processes communicate]
- **Native modules:** [any native dependencies]

## File structure

```
project-root/
├── src/
│   ├── main/       # Main process code
│   ├── renderer/   # UI code
│   ├── shared/     # Shared types/utilities
│   └── preload/    # Preload scripts (if Electron)
├── assets/         # Icons, images
├── build/          # Build configuration
└── dist/           # Built application
```

## Code style

- [Indentation and formatting]
- [Component naming conventions]
- [File naming conventions]
- [Import organization]

## Platform-specific notes

**Windows:**
- [Installer type: MSI, NSIS, etc.]
- [Code signing requirements]
- [Windows-specific features]

**macOS:**
- [Code signing and notarization]
- [App Store vs direct distribution]
- [macOS-specific features]

**Linux:**
- [Package formats: AppImage, deb, rpm, snap]
- [Desktop integration]

## Data storage

- [Where app stores user data]
- [Configuration file location]
- [Database if applicable]
- [Cache location]

## Security considerations

- [Sandbox settings]
- [Permission requirements]
- [Auto-update mechanism]
- [Secure storage for credentials]

## Testing approach

- Unit tests for business logic
- Integration tests for IPC
- E2E tests with [Playwright, Spectron, etc.]
- Manual testing checklist for releases

## Build and release

- [CI/CD setup]
- [Version numbering scheme]
- [Release notes format]
- [Distribution channels]

## Things to avoid

- [Don't use nodeIntegration in renderer]
- [Avoid synchronous IPC]
- [Don't bundle large unnecessary dependencies]

---

*Keep this updated as the app evolves.*
