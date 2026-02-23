# Improvement Plans for @sudobility/building_blocks_rn

## Priority 1 - High Impact

### 1. Add Test Coverage
- **Current state**: Zero tests configured (`"test": "echo 'No tests configured yet'"`)
- **Impact**: No automated verification of any component behavior, theme logic, or provider composition
- **Recommendation**: Set up Vitest or Jest with React Native Testing Library. Start with ThemeProvider (persistence + system detection), ToastProvider (add/remove/auto-dismiss), and SudobilityAppRN (provider composition order). Then add tests for LoginScreen, AppearanceSettings, and SubscriptionScreen.
- **Effort**: High

### 2. Add Accessibility Support
- **Current state**: Components lack `accessibilityLabel`, `accessibilityRole`, and `accessibilityState` props. LoginScreen has no screen reader hints for form fields. SubscriptionScreen package cards have no accessibility grouping.
- **Recommendation**: Add `accessibilityLabel` and `accessibilityRole` to all interactive components. Test with VoiceOver (iOS) and TalkBack (Android). Support dynamic font scaling via `allowFontScaling` and `maxFontSizeMultiplier`.
- **Effort**: Medium-high

### 3. Verify RTL Layout Support
- **Current state**: `RTL_LANGUAGES` constant exists and `isRTL()` helper is exported, but no components appear to apply RTL-specific layout adjustments (e.g., `I18nManager.forceRTL()`, `flexDirection: 'row-reverse'`)
- **Recommendation**: Audit all components for RTL correctness. Add RTL-aware styling (margins, paddings, icons) and test with Arabic locale.
- **Effort**: Medium

## Priority 2 - Medium Impact

### 4. Add @fileoverview JSDoc to All Source Files
- **Current state**: Some files have `@fileoverview` (types.ts, styles.ts, useResponsive.ts, SudobilityAppRN.tsx) but most component files (AppHeader, AppFooter, AppScreenLayout, LoginScreen, AppTextScreen, AppSubscriptionPage, etc.) lack file-level documentation
- **Recommendation**: Add `@fileoverview` comments describing purpose and usage to all source files
- **Effort**: Low

### 5. Add Error Boundaries
- **Current state**: SudobilityAppRN composes providers but has no error boundary. If a provider throws during initialization (e.g., AsyncStorage fails), the entire app crashes with an unhandled error.
- **Recommendation**: Add a React error boundary around the provider stack with a user-friendly fallback screen
- **Effort**: Low-medium

### 6. Improve Toast Animation Cleanup
- **Current state**: ToastProvider uses `setTimeout` for auto-dismiss but does not clean up the timeout on unmount. The global `toastCounter` increments indefinitely.
- **Recommendation**: Use `useEffect` cleanup for timeout cancellation. Consider using `useRef` for the counter instead of a module-level variable.
- **Effort**: Low

### 7. Add Theme Transition Animation
- **Current state**: Theme switching is instant -- colors change with no transition, which can be jarring
- **Recommendation**: Add a brief fade or cross-dissolve animation when switching between light and dark mode
- **Effort**: Medium

## Priority 3 - Architecture

### 8. Add Navigation Type Safety
- **Current state**: `MenuItemConfig.routeName` is a plain `string`. There is no type-level connection to the app's navigation route names.
- **Recommendation**: Make `MenuItemConfig` generic over the navigation param list type (e.g., `MenuItemConfig<RootStackParamList>`) so route names are validated at compile time
- **Effort**: Medium

### 9. Consider Splitting Toast into Standalone Package
- **Current state**: `ToastProvider` and `useToast` are self-contained with no dependencies on other building_blocks_rn modules beyond `createThemedStyles`
- **Recommendation**: Extract toast into a standalone package for reuse in apps that don't need the full building_blocks_rn
- **Effort**: Medium

### 10. Add Support for Custom Fonts
- **Current state**: Typography scale defines sizes and weights but does not support custom font families. All components use the system default font.
- **Recommendation**: Add `fontFamily` to the `ThemeColors` or typography system, allowing consumers to pass custom fonts (e.g., Inter, SF Pro) via the ThemeProvider
- **Effort**: Medium

## Priority 4 - Developer Experience

### 11. Add Component Catalog / Demo App
- **Current state**: No visual development environment; developers must test components in consuming Expo/RN apps
- **Recommendation**: Create a minimal Expo app in `example/` that renders all screens and components with mock data
- **Effort**: Medium

### 12. Document Platform-Specific Behavior
- **Current state**: LoginScreen uses `KeyboardAvoidingView` with platform-aware behavior (`behavior="padding"` on iOS, `behavior="height"` on Android) but this is not documented
- **Recommendation**: Add platform-specific notes to JSDoc and CLAUDE.md for all components with iOS/Android behavioral differences
- **Effort**: Low

### 13. Add Changelog
- **Current state**: No CHANGELOG.md -- version history is only visible in git log
- **Recommendation**: Add a changelog (manual or auto-generated via conventional commits) to help downstream consumers understand what changed between versions
- **Effort**: Low
