# CLAUDE.md - [Project Name]

> Template for: Mobile applications (React Native, Flutter, native iOS/Android)
> Copy to: `./CLAUDE.md` or `./.claude/CLAUDE.md` in your project root
>
> **What is this?** CLAUDE.md is a memory file that gives Claude Code persistent context about your project. It's automatically read at the start of every conversation, so Claude understands your codebase, conventions, and preferences without you having to re-explain them.
>
> **Official docs:** https://code.claude.com/docs/en/memory

## Project overview

[One sentence: What this app does and who uses it]

**Framework:** [React Native, Flutter, Swift/Kotlin native]
**Platforms:** [iOS, Android, both]
**Min versions:** [iOS 14+, Android API 26+, etc.]
**Language:** [TypeScript, Dart, Swift, Kotlin]

## Common commands

```bash
# Development
[command to start metro/dev server]

# Run on simulator
[command for iOS simulator]
[command for Android emulator]

# Run on device
[command for physical device]

# Build
[command to build release]

# Test
[command to run tests]
```

## Architecture

- **Navigation:** [React Navigation, GoRouter, etc.]
- **State:** [Redux, Zustand, Provider, Riverpod, etc.]
- **API:** [REST, GraphQL, Firebase, etc.]
- **Storage:** [AsyncStorage, Hive, SQLite, etc.]

## File structure

```
project-root/
├── src/
│   ├── screens/        # Screen components
│   ├── components/     # Reusable UI components
│   ├── navigation/     # Navigation setup
│   ├── services/       # API and external services
│   ├── store/          # State management
│   └── utils/          # Utilities and helpers
├── assets/             # Images, fonts
├── ios/                # iOS native code
└── android/            # Android native code
```

## Code style

- [Component naming: PascalCase]
- [File naming convention]
- [Style approach: StyleSheet, styled-components, etc.]
- [Import organization]

## Platform-specific code

```typescript
// Platform branching pattern
Platform.select({
  ios: () => /* iOS implementation */,
  android: () => /* Android implementation */,
})
```

- [When to use platform files: .ios.ts, .android.ts]
- [Native module locations]

## Navigation structure

```
App
├── Auth Stack
│   ├── Login
│   └── Register
└── Main Stack
    ├── Home
    ├── Profile
    └── Settings
```

## Testing approach

- Unit tests for utilities and logic
- Component tests with [Testing Library, etc.]
- E2E tests with [Detox, Maestro, etc.]
- Device testing matrix

## Build and release

**iOS:**
- [Xcode project location]
- [Provisioning profiles setup]
- [App Store Connect]

**Android:**
- [Gradle configuration]
- [Keystore location (don't commit!)]
- [Play Console]

**CI/CD:**
- [Fastlane, EAS, App Center, etc.]
- [Build triggers]

## Environment configuration

```
.env.development
.env.staging
.env.production
```

- [How env vars are accessed]
- [Build variants/schemes]

## Deep linking

- [URL scheme: myapp://]
- [Universal links setup]
- [Route handling]

## Push notifications

- [Provider: FCM, APNs, OneSignal, etc.]
- [Token storage]
- [Notification handling]

## Things to avoid

- Don't commit signing keys or keystores
- Avoid inline styles when reusable
- Don't ignore native warnings
- Avoid hardcoded dimensions

---

*Keep this updated as the app and platform requirements evolve.*
