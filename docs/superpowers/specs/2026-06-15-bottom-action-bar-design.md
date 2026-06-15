# Shared sticky bottom action bar

**Date:** 2026-06-15
**Repos:** `building_blocks_rn` (new component) + `tapayoka_buyer_app_rn` + `tapayoka_vendor_app_rn` (adoption)
**Status:** Approved design

## Problem

The two tapayoka RN apps place primary action buttons inconsistently: the buyer app has buttons inside scrolling content (they scroll away) or in static layouts; only `HomeScreen` pins a CTA bar to the bottom — and even that adds `useSafeAreaInsets().bottom` while a tab bar is present, so it floats slightly high. The vendor app mixes header buttons, a `FormModal` sticky footer, and a few in-content buttons. We want one consistent pattern: **primary action buttons pinned to the bottom of the screen, just above the tab bar when present, never scrolling with content.**

## Goal

Add one shared `BottomActionBar` component to `@sudobility/building_blocks_rn` (both apps already depend on it) and adopt it on the screens whose primary action buttons currently live in-content or in static layouts.

## Scope (agreed)

- Component lives in `building_blocks_rn` (shared, single source of truth).
- Convert **only** screens with in-content/static primary action buttons. **Not** in scope: vendor header buttons (`Save`/`+` in `headerRight`), the `FormModal` footer (already sticky-bottom), selection-card screens (`SlotSelection`/`ServiceSelection` — their cards are the action), read-only screens.

## Design

### 1. `BottomActionBar` component — `building_blocks_rn`

Files:
- `src/components/bottom-action-bar/BottomActionBar.tsx`
- `src/components/bottom-action-bar/index.ts` (barrel)
- `index.ts` (root): add `export * from './src/components/bottom-action-bar';`
- `package.json`: add `@react-navigation/bottom-tabs` to `peerDependencies` (`>=7.0.0`) and `devDependencies` (`^7.x`) — both apps already ship it.

API:
```ts
export interface BottomActionBarProps {
  children: React.ReactNode;          // the button(s)
  style?: StyleProp<ViewStyle>;        // optional container override
}
```

Behavior:
- Renders a themed container (top hairline border + `colors.background`) intended to be the **last child of a flex-column screen root**, after the scroll/list region, so it is always pinned to the bottom and never scrolls.
- Horizontal padding 16, top padding 12.
- **Tab-bar aware** via `useContext(BottomTabBarHeightContext)` from `@react-navigation/bottom-tabs` (returns `number | undefined`, never throws — safe for rules-of-hooks):
  - tab bar present (`!= null`) → bottom padding = `12` (the tab bar already covers the home indicator; the bar sits directly above it).
  - tab bar absent (pushed/modal screens that cover the tab bar) → bottom padding = `Math.max(useSafeAreaInsets().bottom, 12)`.
- Theming via the lib's `createThemedStyles` (matches `AppScreenLayout`).

Reference implementation:
```tsx
import React, { useContext } from 'react';
import { View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';
import { createThemedStyles } from '../../utils/styles';

export interface BottomActionBarProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function BottomActionBar({ children, style }: BottomActionBarProps) {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useContext(BottomTabBarHeightContext);
  const paddingBottom = tabBarHeight != null ? 12 : Math.max(insets.bottom, 12);
  return <View style={[styles.bar, { paddingBottom }, style]}>{children}</View>;
}

const useStyles = createThemedStyles(colors => ({
  bar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
}));
```
(Exact `createThemedStyles` colors usage to match the lib; `StyleSheet` imported from `react-native`.)

### 2. Buyer app adoption — `tapayoka_buyer_app_rn`

Bump `@sudobility/building_blocks_rn`, then per screen: ensure content is in a `ScrollView`/`FlatList` (so it scrolls under the bar), and move the primary button(s) into `<BottomActionBar>` as the root's last child.

| Screen | Button(s) | Change |
|---|---|---|
| `HomeScreen` | Scan / Disconnect | replace local `ctaBar` View with `BottomActionBar` (drops the manual `insets.bottom`, fixing the tab-bar double-pad) |
| `PaymentScreen` | Confirm & Pay | wrap card+method content in `ScrollView`; button → `BottomActionBar` |
| `DurationAdjustScreen` | Continue | stepper content above (scroll if needed); Continue → `BottomActionBar` |
| `ActiveServiceScreen` | Done (only when complete) | render `BottomActionBar` with Done only when `isComplete` |
| `PaymentMethodsScreen` | + Add Card | remove `position:'absolute'`; `BottomActionBar` after the `FlatList` |
| `AddPaymentMethodScreen` | Save | keep `KeyboardAvoidingView`; Save → `BottomActionBar` |

Left unchanged: `ScanScreen`, `SlotSelectionScreen`, `ServiceSelectionScreen`, `OrderHistoryScreen`, `SettingsScreen`, `SplashScreen`.

### 3. Vendor app adoption — `tapayoka_vendor_app_rn`

Bump `@sudobility/building_blocks_rn`, then convert the in-content/static-button screens:

| Screen | Button(s) | Change |
|---|---|---|
| `LoginScreen` | Continue with Google / Sign In (primary auth) | move the auth action button(s) into `BottomActionBar` at the bottom (keep `KeyboardAvoidingView`; the email/password fields + mode toggle stay in the scroll body) |
| `DevicesScreen` | Scan for Devices / Setup Server Wallet | content in a scroll body; the active primary button → `BottomActionBar` |
| `SettingsScreen` | Sign Out | nav rows stay in the body; Sign Out → `BottomActionBar` |

Left unchanged (per scope): all `headerRight` button screens (lists, `ModelSettingsScreen`, offerings), `FormModal` (footer already sticky), `SlotManagementScreen`, `OfferingDetailScreen` info bar, `OrdersScreen`, `SplashScreen`.

### 4. Tab-bar / safe-area correctness

- Buyer tab screens (`HomeScreen`) and any pushed screen still under a tab navigator get the tab-bar branch → bar sits just above the tab bar, no extra inset.
- Pushed/modal screens that cover the tab bar get the safe-area branch → bar respects the home indicator.
- This is handled entirely inside `BottomActionBar`; screens just drop it in.

### 5. Shipping

1. **building_blocks_rn**: add component + export + peer dep; `bun run build` + `vitest` + lint; bump version; **publish** (`npm publish`, or via `building_blocks/scripts/push_all.sh` — confirm in the plan; prefer a targeted publish to avoid churning the whole building_blocks family).
2. **Both apps**: bump `@sudobility/building_blocks_rn` to the new version, `bun install`, adopt the component, `bun run verify`.
3. **Deploy apps**: tapayoka `push_all.sh` (or `git push` per app) — apps are leaf consumers, no further cascade.

### 6. Testing

- **building_blocks_rn**: a vitest render test for `BottomActionBar` — renders children; with no tab-bar context uses the safe-area inset; with a `BottomTabBarHeightContext.Provider value={56}` uses the constant. (Use the existing `__tests__/mocks/safe-area-context.ts`.)
- **Apps**: `bun run typecheck` + `bun run lint` each; run the **buyer app on the iOS sim** (already running) and screenshot `Payment`, `DurationAdjust`, `PaymentMethods` to confirm the bar is sticky above the tab bar and content scrolls under it; spot-check the **vendor app** `Login`, `Devices`, `Settings` similarly.

## Out of scope

- Vendor header action buttons (`Save`/`+`) and the `FormModal` footer (already bottom-sticky).
- Selection-card screens (`SlotSelection`/`ServiceSelection`) — no discrete action button.
- Adopting `AppScreenLayout` wholesale (bigger refactor; `BottomActionBar` is the minimal drop-in).
