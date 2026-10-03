# @sudobility/building_blocks_rn

Higher-level shared UI building blocks for Sudobility React Native apps. Provides pre-built screens (login, settings, subscriptions), theming, i18n, and app shell components.

## Installation

```bash
bun add @sudobility/building_blocks_rn
```

## Usage

```tsx
import {
  SudobilityAppRN,
  ThemeProvider,
  useTheme,
  LoginPage,
  AppScreenLayout,
  ToastProvider,
  useToast,
  createThemedStyles,
  initializeI18nRN,
} from '@sudobility/building_blocks_rn';

// Firebase-dependent imports (separate entry point)
import {
  SudobilityAppRNWithFirebaseAuth,
  ApiProvider,
  useApi,
} from '@sudobility/building_blocks_rn/firebase';
```

## API

### Main Entry (`@sudobility/building_blocks_rn`)

| Export | Description |
|--------|-------------|
| `SudobilityAppRN` | Base app wrapper composing providers (SafeArea, Theme, Toast, i18n, Query) |
| `LoginPage` | Full-screen sign-in page: app name, a heading that follows the mode, and `LoginView` from `@sudobility/components-rn` (email, sign-up, password reset, Google, Apple). For sign-in in the middle of a flow use components-rn's `LoginModal`. Mirrors the web `LoginPage` |
| `AppScreenLayout` | SafeAreaView wrapper with optional header/footer |
| `AppSubscriptionPage` | Subscription management with status and packages |
| `SettingsListScreen` | Settings menu with icon rows |
| `AppearanceSettings` | Theme and font size segmented controls |
| `LanguagePicker` | Modal language selector (16 languages) |
| `ThemeProvider` / `useTheme` | Light/dark theme with AsyncStorage persistence |
| `ToastProvider` / `useToast` | Animated toast notifications |
| `createThemedStyles` | Memoized StyleSheet factory from theme colors |
| `initializeI18nRN` | i18next setup with RN locale detection |
| `getDeviceLocaleTags` | Ordered device locale tags, including Windows `Intl` detection |
| `useResponsive` | Window dimension breakpoints (isSmall, isMedium, isLarge) |

## Native desktop bridges

- macOS native modules live in `macos/` and are included by the package's
  CocoaPods specification. `WebAuthModule` is already shared here.
- Windows native sources live in `windows/`. React Native Windows apps that use
  these bridges manually include the relevant source files in their `.vcxproj`
  and register attributed modules with `AddAttributedModules`. `WebAuthModule`
  provides the PKCE/system-browser bridge; `FileSystemUtils.h` provides shared
  Windows base64 encoding for app-specific file-system modules.

### Firebase Entry (`@sudobility/building_blocks_rn/firebase`)

| Export | Description |
|--------|-------------|
| `SudobilityAppRNWithFirebaseAuth` | App wrapper with Firebase auth + API layers |
| `ApiProvider` / `useApi` | Network client context with auth token management |

## Development

```bash
bun run build          # Build TypeScript to dist/
bun run dev            # Watch mode build
bun run typecheck      # Type-check (no emit)
bun run lint           # ESLint check
bun run lint:fix       # Auto-fix ESLint issues
bun run format         # Prettier format
```

## License

BUSL-1.1
