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
