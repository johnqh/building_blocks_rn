# Sticky Bottom Action Bar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a shared `BottomActionBar` to `@sudobility/building_blocks_rn` and adopt it on the buyer + vendor RN screens whose primary action buttons currently sit in-content or static, pinning them above the tab bar and out of the scroll.

**Architecture:** One themed, tab-bar-aware `BottomActionBar` (generalizes HomeScreen's `ctaBar`) published from `building_blocks_rn`; each target screen wraps its body in a scroll/list region and drops its primary button(s) into `<BottomActionBar>` as the root's last child.

**Tech Stack:** React Native 0.81 + Expo 54, React Navigation 7 (bottom-tabs `BottomTabBarHeightContext`), `react-native-safe-area-context`, building_blocks_rn (`createThemedStyles`, vitest), Bun.

---

## File Structure

**building_blocks_rn** (branch `feature/bottom-action-bar`)
- Create `src/components/bottom-action-bar/BottomActionBar.tsx`
- Create `src/components/bottom-action-bar/index.ts`
- Create `src/components/bottom-action-bar/BottomActionBar.test.tsx`
- Modify `index.ts` (root barrel) — export the new component
- Modify `package.json` — add `@react-navigation/bottom-tabs` peer + dev dep

**tapayoka_buyer_app_rn** (branch `feature/bottom-action-bar`)
- Modify `package.json` (bump dep) + Home/Payment/DurationAdjust/ActiveService/PaymentMethods/AddPaymentMethod screens

**tapayoka_vendor_app_rn** (branch `feature/bottom-action-bar`)
- Modify `package.json` (bump dep) + Login/Devices/Settings screens

---

## Phase 1 — building_blocks_rn component

### Task 1: Add `@react-navigation/bottom-tabs` dependency

**Files:** Modify `/Users/johnhuang/projects/building_blocks_rn/package.json`

- [ ] **Step 1: Add peer + dev dependency**

In `peerDependencies`, alongside `"@react-navigation/native": ">=7.0.0"`, add:
```json
    "@react-navigation/bottom-tabs": ">=7.0.0",
```
In `devDependencies`, alongside `"@react-navigation/native": "^7.1.28"`, add:
```json
    "@react-navigation/bottom-tabs": "^7.4.0",
```

- [ ] **Step 2: Install**

Run: `cd /Users/johnhuang/projects/building_blocks_rn && bun install`
Expected: `@react-navigation/bottom-tabs` resolved in devDependencies.

- [ ] **Step 3: Commit**

```bash
cd /Users/johnhuang/projects/building_blocks_rn
git add package.json bun.lock 2>/dev/null
git commit -m "chore: add @react-navigation/bottom-tabs peer dep for BottomActionBar"
```

---

### Task 2: `BottomActionBar` component (TDD)

**Files:**
- Create `src/components/bottom-action-bar/BottomActionBar.tsx`
- Create `src/components/bottom-action-bar/index.ts`
- Test `src/components/bottom-action-bar/BottomActionBar.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/bottom-action-bar/BottomActionBar.test.tsx`:

```tsx
/**
 * @fileoverview Tests for BottomActionBar.
 */
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@react-navigation/bottom-tabs', () => ({
  BottomTabBarHeightContext: React.createContext<number | undefined>(undefined),
}));

import { Text } from 'react-native';
import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';
import { render } from '../../__tests__/test-utils';
import { ThemeProvider } from '../../theme/ThemeContext';
import { BottomActionBar } from './BottomActionBar';

describe('BottomActionBar', () => {
  it('renders its children when there is no tab bar', async () => {
    const { getByText } = await render(
      <ThemeProvider>
        <BottomActionBar>
          <Text>Pay</Text>
        </BottomActionBar>
      </ThemeProvider>
    );
    expect(getByText('Pay')).toBeTruthy();
  });

  it('renders its children inside a tab navigator', async () => {
    const { getByText } = await render(
      <ThemeProvider>
        <BottomTabBarHeightContext.Provider value={56}>
          <BottomActionBar>
            <Text>Continue</Text>
          </BottomActionBar>
        </BottomTabBarHeightContext.Provider>
      </ThemeProvider>
    );
    expect(getByText('Continue')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd /Users/johnhuang/projects/building_blocks_rn && bun run test -- bottom-action-bar`
Expected: FAIL — cannot resolve `./BottomActionBar`.

- [ ] **Step 3: Implement the component**

Create `src/components/bottom-action-bar/BottomActionBar.tsx`:

```tsx
/**
 * @fileoverview Sticky bottom action bar.
 *
 * Pins primary action buttons to the bottom of a screen, just above the
 * bottom tab bar when present, otherwise respecting the home-indicator inset.
 * Place it as the last child of a flex-column screen root, after the scroll
 * or list region, so it never scrolls with content.
 */
import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';
import { createThemedStyles } from '../../utils/styles';

export interface BottomActionBarProps {
  /** The button(s) to pin to the bottom. */
  children: React.ReactNode;
  /** Optional container style override. */
  style?: StyleProp<ViewStyle>;
}

export function BottomActionBar({ children, style }: BottomActionBarProps) {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useContext(BottomTabBarHeightContext);
  // Under a tab bar, the tab bar already covers the home indicator, so the
  // bar sits directly above it with a small constant. Otherwise (pushed/modal
  // screens that cover the tab bar) honor the bottom safe-area inset.
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

Create `src/components/bottom-action-bar/index.ts`:

```ts
export { BottomActionBar } from './BottomActionBar';
export type { BottomActionBarProps } from './BottomActionBar';
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd /Users/johnhuang/projects/building_blocks_rn && bun run test -- bottom-action-bar`
Expected: PASS (2 tests).

- [ ] **Step 5: Export from the root barrel**

In `/Users/johnhuang/projects/building_blocks_rn/index.ts`, after the line `export * from './src/components/footer';`, add:
```ts
export * from './src/components/bottom-action-bar';
```

- [ ] **Step 6: Typecheck + lint + build**

Run: `cd /Users/johnhuang/projects/building_blocks_rn && bun run typecheck && bun run lint && bun run build`
Expected: all pass; `dist/index.d.ts` exports `BottomActionBar`.

- [ ] **Step 7: Commit**

```bash
cd /Users/johnhuang/projects/building_blocks_rn
git add src/components/bottom-action-bar index.ts
git commit -m "feat: add BottomActionBar (tab-bar-aware sticky footer)"
```

---

### Task 3: Publish building_blocks_rn

**Files:** Modify `/Users/johnhuang/projects/building_blocks_rn/package.json` (version)

- [ ] **Step 1: Bump the patch version**

In `package.json` bump `"version"` (e.g. `0.0.43` → `0.0.44`).

- [ ] **Step 2: Build + publish**

Run: `cd /Users/johnhuang/projects/building_blocks_rn && bun run build && npm publish --access public`
Expected: `@sudobility/building_blocks_rn@<new>` published (a targeted publish; avoids the full `building_blocks/scripts/push_all.sh` family cascade).

- [ ] **Step 3: Commit + merge to main**

```bash
cd /Users/johnhuang/projects/building_blocks_rn
git add package.json
git commit -m "chore: release BottomActionBar"
git checkout main && git merge --no-ff feature/bottom-action-bar -m "Merge: BottomActionBar"
git branch -d feature/bottom-action-bar
git push origin main
```
Expected: published version available on npm; record it as `<BB_VER>` for the app bumps below.

---

## Phase 2 — buyer app adoption

> Branch: `cd /Users/johnhuang/projects/tapayoka_buyer_app_rn && git checkout -b feature/bottom-action-bar`. Bump the dep first (Task 4), then one screen per task.

### Task 4: Bump building_blocks_rn in buyer app

**Files:** Modify `tapayoka_buyer_app_rn/package.json`

- [ ] **Step 1: Bump + install**

Set `"@sudobility/building_blocks_rn"` to `^<BB_VER>` in `package.json`, then:
Run: `cd /Users/johnhuang/projects/tapayoka_buyer_app_rn && bun install`
Expected: new version installed; `node_modules/@sudobility/building_blocks_rn/dist/index.d.ts` exports `BottomActionBar`.

- [ ] **Step 2: Smoke-check the import compiles**

Run: `cd /Users/johnhuang/projects/tapayoka_buyer_app_rn && node -e "process.exit(0)"` then `bun run typecheck`
Expected: typecheck passes (no usage yet).

- [ ] **Step 3: Commit**

```bash
cd /Users/johnhuang/projects/tapayoka_buyer_app_rn
git add package.json bun.lock 2>/dev/null
git commit -m "chore: bump building_blocks_rn for BottomActionBar"
```

### Task 5: HomeScreen → BottomActionBar

**Files:** Modify `src/screens/scan/HomeScreen.tsx`

- [ ] **Step 1: Import the component**

Add to the imports:
```tsx
import { BottomActionBar } from '@sudobility/building_blocks_rn';
```

- [ ] **Step 2: Replace the local `ctaBar` View with `BottomActionBar`**

Replace the JSX block:
```tsx
      <View style={[styles.ctaBar, { paddingBottom: insets.bottom || 16 }]}>
        <TouchableOpacity
          style={[
            styles.ctaButton,
            isConnected
              ? { ...styles.ctaButtonDisconnect, borderColor: colors.error }
              : { backgroundColor: colors.primary },
          ]}
          onPress={isConnected ? handleDisconnect : () => navigation.navigate('Scan')}
          activeOpacity={0.8}
        >
          <Text style={[styles.ctaButtonText, isConnected && { color: colors.error }]}>
            {isConnected ? t('home.disconnect') : t('home.scanButton')}
          </Text>
        </TouchableOpacity>
      </View>
```
with:
```tsx
      <BottomActionBar>
        <TouchableOpacity
          style={[
            styles.ctaButton,
            isConnected
              ? { ...styles.ctaButtonDisconnect, borderColor: colors.error }
              : { backgroundColor: colors.primary },
          ]}
          onPress={isConnected ? handleDisconnect : () => navigation.navigate('Scan')}
          activeOpacity={0.8}
        >
          <Text style={[styles.ctaButtonText, isConnected && { color: colors.error }]}>
            {isConnected ? t('home.disconnect') : t('home.scanButton')}
          </Text>
        </TouchableOpacity>
      </BottomActionBar>
```
Then remove the now-unused `ctaBar` style entry and, if `insets`/`useSafeAreaInsets` is otherwise unused, remove its import and the `const insets = useSafeAreaInsets();` line.

- [ ] **Step 3: Typecheck + commit**

Run: `cd /Users/johnhuang/projects/tapayoka_buyer_app_rn && bun run typecheck`
Expected: PASS.
```bash
git add src/screens/scan/HomeScreen.tsx && git commit -m "refactor: HomeScreen uses shared BottomActionBar"
```

### Task 6: PaymentScreen → scroll body + BottomActionBar

**Files:** Modify `src/screens/scan/PaymentScreen.tsx`

- [ ] **Step 1: Import**
```tsx
import { ScrollView } from 'react-native';
import { BottomActionBar } from '@sudobility/building_blocks_rn';
```
(Add `ScrollView` to the existing `react-native` import if not present.)

- [ ] **Step 2: Restructure the return**

Wrap the existing card + method-row content in a `ScrollView` and move the pay `TouchableOpacity` into `BottomActionBar` as the root's last child:
```tsx
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: colors.text }]}>{t('payment.title')}</Text>
        {/* ...the existing card View and methodRow View, unchanged... */}
      </ScrollView>
      <BottomActionBar>
        <TouchableOpacity
          style={[styles.payButton, { backgroundColor: colors.primary }]}
          onPress={handlePay}
          disabled={paying}
        >
          {paying ? (
            <View style={styles.payingRow}>
              <ActivityIndicator color="#fff" />
              {!!status && <Text style={styles.statusText}>{status}</Text>}
            </View>
          ) : (
            <Text style={styles.payButtonText}>{`${t('payment.confirmAndPay')} ${formatPrice(amountCents)}`}</Text>
          )}
        </TouchableOpacity>
      </BottomActionBar>
    </View>
  );
```
Update styles: change `container` to `{ flex: 1 }` (remove its `padding: 16`), and add `scrollContent: { padding: 16 }`. Keep `payButton`/`payButtonText` as-is.

- [ ] **Step 3: Typecheck + commit**

Run: `bun run typecheck`  (Expected: PASS)
```bash
git add src/screens/scan/PaymentScreen.tsx && git commit -m "refactor: PaymentScreen sticky pay button via BottomActionBar"
```

### Task 7: DurationAdjustScreen → BottomActionBar

**Files:** Modify `src/screens/scan/DurationAdjustScreen.tsx`

- [ ] **Step 1: Import** `import { BottomActionBar } from '@sudobility/building_blocks_rn';`

- [ ] **Step 2: Move the Continue button into the bar**

Change the root so the stepper/total stay in the body and Continue is pinned:
```tsx
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.body}>
        <Text style={[styles.title, { color: colors.text }]}>{t('duration.title')}</Text>
        <Text style={[styles.serviceName, { color: colors.textMuted }]}>{pricingTier.name}</Text>
        {/* ...the existing stepperRow View and total Text, unchanged... */}
      </View>
      <BottomActionBar>
        <TouchableOpacity
          style={[styles.continueBtn, { backgroundColor: colors.primary }]}
          onPress={handleContinue}
        >
          <Text style={styles.continueText}>{t('duration.continue')}</Text>
        </TouchableOpacity>
      </BottomActionBar>
    </View>
  );
```
Update styles: `container: { flex: 1 }` (remove padding/alignItems); add `body: { flex: 1, padding: 16, alignItems: 'center' }`. Keep `continueBtn`/`continueText`.

- [ ] **Step 3: Typecheck + commit**

Run: `bun run typecheck`  (Expected: PASS)
```bash
git add src/screens/scan/DurationAdjustScreen.tsx && git commit -m "refactor: DurationAdjust sticky Continue via BottomActionBar"
```

### Task 8: ActiveServiceScreen → BottomActionBar (conditional)

**Files:** Modify `src/screens/scan/ActiveServiceScreen.tsx`

- [ ] **Step 1: Import** `import { BottomActionBar } from '@sudobility/building_blocks_rn';`

- [ ] **Step 2: Move the Done button into a conditional bar**

Keep the centered countdown content in the body; render the Done button in `BottomActionBar` only when complete. Replace the existing conditional Done `TouchableOpacity` so it sits at the root bottom:
```tsx
      {isComplete && (
        <BottomActionBar>
          <TouchableOpacity
            style={[styles.doneButton, { backgroundColor: colors.primary }]}
            onPress={() => {
              trackButtonClick('active_service_done', { serviceName });
              navigation.popToTop();
            }}
          >
            <Text style={styles.doneButtonText}>{t('activeService.done')}</Text>
          </TouchableOpacity>
        </BottomActionBar>
      )}
```
Ensure the root is a flex-column `View` (`flex: 1`) with the centered content in a `body` View above the conditional bar. Adjust `doneButton` to `{ paddingVertical: 16, borderRadius: 12, alignItems: 'center' }` (drop the `marginTop: 48` / horizontal padding now that it's full-width in the bar).

- [ ] **Step 3: Typecheck + commit**

Run: `bun run typecheck`  (Expected: PASS)
```bash
git add src/screens/scan/ActiveServiceScreen.tsx && git commit -m "refactor: ActiveService sticky Done via BottomActionBar"
```

### Task 9: PaymentMethodsScreen → BottomActionBar

**Files:** Modify `src/screens/settings/PaymentMethodsScreen.tsx`

- [ ] **Step 1: Import** `import { BottomActionBar } from '@sudobility/building_blocks_rn';`

- [ ] **Step 2: Replace the absolutely-positioned Add button**

Move the Add-card `TouchableOpacity` out of its `position:'absolute'` placement into a `BottomActionBar` as the last child of the container `View` (after the `FlatList`):
```tsx
      <BottomActionBar>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('AddPaymentMethod')}
        >
          <Text style={styles.addButtonText}>{t('paymentMethods.addCard')}</Text>
        </TouchableOpacity>
      </BottomActionBar>
```
Update styles: change `addButton` to `{ padding: 16, borderRadius: 12, alignItems: 'center' }` (remove `position:'absolute'`, `bottom`, `left`, `right`); change `list` `paddingBottom` from `100` to `16` (the bar no longer overlaps).

- [ ] **Step 3: Typecheck + commit**

Run: `bun run typecheck`  (Expected: PASS)
```bash
git add src/screens/settings/PaymentMethodsScreen.tsx && git commit -m "refactor: PaymentMethods sticky Add button via BottomActionBar"
```

### Task 10: AddPaymentMethodScreen → BottomActionBar

**Files:** Modify `src/screens/settings/AddPaymentMethodScreen.tsx`

- [ ] **Step 1: Import** `import { BottomActionBar } from '@sudobility/building_blocks_rn';`

- [ ] **Step 2: Move Save into the bar (inside the KeyboardAvoidingView)**

Keep the label + `CardForm` in the KAV body; move the Save `TouchableOpacity` into `BottomActionBar` as the last child of the `KeyboardAvoidingView`:
```tsx
      <BottomActionBar>
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: cardComplete ? colors.primary : colors.border }]}
          onPress={handleSave}
          disabled={!cardComplete || saving}
        >
          {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>{t('paymentMethods.save')}</Text>}
        </TouchableOpacity>
      </BottomActionBar>
```
Change `container` padding so only the body is padded: set `container: { flex: 1 }` and wrap the label + CardForm in a `<View style={styles.body}>` with `body: { flex: 1, padding: 16 }`.

- [ ] **Step 3: Typecheck + commit**

Run: `bun run typecheck`  (Expected: PASS)
```bash
git add src/screens/settings/AddPaymentMethodScreen.tsx && git commit -m "refactor: AddPaymentMethod sticky Save via BottomActionBar"
```

### Task 11: Buyer verify + visual check

- [ ] **Step 1: Full verify**

Run: `cd /Users/johnhuang/projects/tapayoka_buyer_app_rn && bun run verify`
Expected: typecheck + lint + tests pass.

- [ ] **Step 2: Visual check on the running sim (Fast Refresh)**

The buyer app is running on the iPhone 16 sim with Metro on 8086. Navigate to Payment / PaymentMethods, screenshot:
Run: `xcrun simctl io C9CAEC4A-86FC-4BC2-AB62-0E6344EEC80F screenshot /tmp/bar_payment.png`
Expected: the action button is pinned at the bottom (above the tab bar on tab screens), content scrolls beneath it.

---

## Phase 3 — vendor app adoption

> Branch: `cd /Users/johnhuang/projects/tapayoka_vendor_app_rn && git checkout -b feature/bottom-action-bar`. Bump dep (Task 12), then one screen per task. For each, read the file first, then move the named primary button(s) into `<BottomActionBar>` as the screen root's last child, wrapping the remaining body in a `ScrollView`/`View` above it.

### Task 12: Bump building_blocks_rn in vendor app

**Files:** Modify `tapayoka_vendor_app_rn/package.json`

- [ ] **Step 1: Bump + install + typecheck**

Set `"@sudobility/building_blocks_rn"` to `^<BB_VER>`, then:
Run: `cd /Users/johnhuang/projects/tapayoka_vendor_app_rn && bun install && bun run typecheck`
Expected: installed; typecheck passes.

- [ ] **Step 2: Commit**
```bash
git add package.json bun.lock 2>/dev/null && git commit -m "chore: bump building_blocks_rn for BottomActionBar"
```

### Task 13: DevicesScreen → BottomActionBar

**Files:** Modify `src/screens/devices/DevicesScreen.tsx`

- [ ] **Step 1: Read the file** to see the exact current layout of the "Scan for Devices" / "Setup Server Wallet" buttons.

- [ ] **Step 2: Import + restructure**

Add `import { BottomActionBar } from '@sudobility/building_blocks_rn';`. Make the screen root a flex-column `View` (`flex: 1`); put the device-info/status content in a `ScrollView` body; move the primary action `TouchableOpacity` (the contextual Scan or Setup button) into `<BottomActionBar>` as the last child. Keep the button's existing styles/labels (`t('devices.setupBle')`, "Setup Server Wallet").

- [ ] **Step 3: Typecheck + commit**

Run: `bun run typecheck` (Expected: PASS)
```bash
git add src/screens/devices/DevicesScreen.tsx && git commit -m "refactor: DevicesScreen sticky action via BottomActionBar"
```

### Task 14: SettingsScreen → BottomActionBar

**Files:** Modify `src/screens/settings/SettingsScreen.tsx`

- [ ] **Step 1: Read the file** to locate the nav rows and the `signOutButton` `TouchableOpacity`.

- [ ] **Step 2: Import + restructure**

Add the import. Keep the Organizations/Invitations/Currency nav rows in the body (wrap them in a `ScrollView` if not already), and move the Sign Out `TouchableOpacity` into `<BottomActionBar>` as the root's last child. Keep its label `t('settings.signOut', 'Sign Out')` and styles.

- [ ] **Step 3: Typecheck + commit**

Run: `bun run typecheck` (Expected: PASS)
```bash
git add src/screens/settings/SettingsScreen.tsx && git commit -m "refactor: vendor Settings sticky Sign Out via BottomActionBar"
```

### Task 15: LoginScreen → BottomActionBar

**Files:** Modify `src/screens/LoginScreen.tsx`

- [ ] **Step 1: Read the file** to locate the `KeyboardAvoidingView`/`SafeAreaView`, the email/password fields, the Google `Pressable`, the submit `Pressable`, and the mode-toggle.

- [ ] **Step 2: Import + restructure**

Add the import. Keep the logo, email/password inputs, and the sign-in/sign-up mode toggle in the scrollable body. Move the primary auth action(s) — the "Continue with Google" `Pressable` and the Sign In/Sign Up submit `Pressable` — into a single `<BottomActionBar>` as the last child (stack them; keep their existing styles and handlers). Keep `KeyboardAvoidingView`.

- [ ] **Step 3: Typecheck + commit**

Run: `bun run typecheck` (Expected: PASS)
```bash
git add src/screens/LoginScreen.tsx && git commit -m "refactor: vendor Login sticky auth buttons via BottomActionBar"
```

### Task 16: Vendor verify

- [ ] **Step 1: Full verify**

Run: `cd /Users/johnhuang/projects/tapayoka_vendor_app_rn && bun run verify`
Expected: typecheck + lint + tests pass (or the repo's verify equivalent; if no `verify` script, run `bun run typecheck && bun run lint`).

---

## Phase 4 — merge + deploy apps

### Task 17: Merge + deploy both apps

- [ ] **Step 1: Merge each app branch to main**

For each of `tapayoka_buyer_app_rn` and `tapayoka_vendor_app_rn`:
```bash
cd /Users/johnhuang/projects/<app>
bun run verify || (bun run typecheck && bun run lint)
git checkout main && git merge --no-ff feature/bottom-action-bar -m "Merge: BottomActionBar adoption"
git branch -d feature/bottom-action-bar
```

- [ ] **Step 2: Deploy**

Run the tapayoka cascade so the apps version-bump + publish + pick up the new building_blocks_rn:
Run: `cd /Users/johnhuang/projects/tapayoka_vendor_app && bash scripts/push_all.sh`
(Leave any final dep bump uncommitted if relying on the cascade; otherwise `git push origin main` each app.) Verify both apps end clean and pushed.

---

## Self-Review

**Spec coverage:**
- Shared `BottomActionBar` with tab-bar/safe-area logic → Tasks 1–2. ✔
- Export from root barrel + peer dep → Tasks 1, 2 (Step 5). ✔
- Publish building_blocks_rn → Task 3. ✔
- Buyer screens (Home, Payment, DurationAdjust, ActiveService, PaymentMethods, AddPaymentMethod) → Tasks 5–10. ✔
- Vendor screens (Devices, Settings, Login) → Tasks 13–15. ✔
- Verify + visual check + deploy → Tasks 11, 16, 17. ✔

**Placeholder scan:** vendor Tasks 13–15 intentionally say "read the file first, then move the named button into BottomActionBar" rather than reproducing unseen full-screen source — the *change* (import + wrap the named primary button as the root's last child) is fully specified; the surrounding body markup is the file's existing content, not invented. No `TODO`/`TBD`.

**Type/name consistency:** `BottomActionBar` / `BottomActionBarProps`, import path `@sudobility/building_blocks_rn`, the `BottomTabBarHeightContext` usage, and `createThemedStyles(colors => …)` match across Tasks 2, 5–10, 13–15. `<BB_VER>` is the version published in Task 3 and consumed in Tasks 4, 12.
