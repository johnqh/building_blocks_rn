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

const SPACING = 16;

export function BottomActionBar({ children, style }: BottomActionBarProps) {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useContext(BottomTabBarHeightContext);
  // Above a tab/tool bar: it already covers the home indicator, so just add
  // spacing above it. Otherwise: sit above the bottom safe-area inset with
  // spacing. (Inside a modal, reset BottomTabBarHeightContext so this takes
  // the no-tab-bar branch — the tab bar isn't actually below the modal.)
  const hasTabBar = (tabBarHeight ?? 0) > 0;
  const paddingBottom = hasTabBar ? SPACING : insets.bottom + SPACING;

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
