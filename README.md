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
  LoginScreen,
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
| `LoginScreen` | Email/password + OAuth login screen |
| `AppScreenLayout` | SafeAreaView wrapper with optional header/footer |
| `AppSubscriptionPage` | Subscription management with status and packages |
| `SettingsListScreen` | Settings menu with icon rows |
| `AppearanceSettings` | Theme and font size segmented controls |
| `LanguagePicker` | Modal language selector (16 languages) |
| `ThemeProvider` / `useTheme` | Light/dark theme with AsyncStorage persistence |
| `ToastProvider` / `useToast` | Animated toast notifications |
| `createThemedStyles` | Memoized StyleSheet factory from theme colors |
| `initializeI18nRN` | i18next setup with RN locale detection |
| `useResponsive` | Window dimension breakpoints (isSmall, isMedium, isLarge) |

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
