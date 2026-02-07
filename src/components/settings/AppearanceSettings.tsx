import React from 'react';
import { View, Text, Pressable } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { Theme, FontSize } from '../../types';
import { createThemedStyles } from '../../utils/styles';

export interface AppearanceSettingsProps {
  theme: Theme | string;
  fontSize: FontSize | string;
  onThemeChange: (theme: Theme) => void;
  onFontSizeChange: (fontSize: FontSize) => void;
  /** Optional translation function */
  t?: (key: string, fallback?: string) => string;
  style?: StyleProp<ViewStyle>;
  showInfoBox?: boolean;
}

const THEME_OPTIONS = [
  { value: Theme.LIGHT, labelKey: 'appearance.theme.light', fallback: 'Light' },
  { value: Theme.DARK, labelKey: 'appearance.theme.dark', fallback: 'Dark' },
  {
    value: Theme.SYSTEM,
    labelKey: 'appearance.theme.system',
    fallback: 'System',
  },
];

const FONT_SIZE_OPTIONS = [
  {
    value: FontSize.SMALL,
    labelKey: 'appearance.fontSize.small',
    fallback: 'Small',
  },
  {
    value: FontSize.MEDIUM,
    labelKey: 'appearance.fontSize.medium',
    fallback: 'Medium',
  },
  {
    value: FontSize.LARGE,
    labelKey: 'appearance.fontSize.large',
    fallback: 'Large',
  },
];

export function AppearanceSettings({
  theme,
  fontSize,
  onThemeChange,
  onFontSizeChange,
  t,
  style,
  showInfoBox = false,
}: AppearanceSettingsProps) {
  const styles = useStyles();
  const translate = (key: string, fallback: string) =>
    t?.(key, fallback) ?? fallback;

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.heading}>
        {translate('appearance.title', 'Appearance')}
      </Text>

      {/* Theme selector */}
      <Text style={styles.label}>
        {translate('appearance.theme.label', 'Theme')}
      </Text>
      <View style={styles.segmentedControl}>
        {THEME_OPTIONS.map(option => (
          <Pressable
            key={option.value}
            style={[
              styles.segment,
              theme === option.value && styles.segmentActive,
            ]}
            onPress={() => onThemeChange(option.value)}
          >
            <Text
              style={[
                styles.segmentText,
                theme === option.value && styles.segmentTextActive,
              ]}
            >
              {translate(option.labelKey, option.fallback)}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Font size selector */}
      <Text style={[styles.label, { marginTop: 20 }]}>
        {translate('appearance.fontSize.label', 'Font Size')}
      </Text>
      <View style={styles.segmentedControl}>
        {FONT_SIZE_OPTIONS.map(option => (
          <Pressable
            key={option.value}
            style={[
              styles.segment,
              fontSize === option.value && styles.segmentActive,
            ]}
            onPress={() => onFontSizeChange(option.value)}
          >
            <Text
              style={[
                styles.segmentText,
                fontSize === option.value && styles.segmentTextActive,
              ]}
            >
              {translate(option.labelKey, option.fallback)}
            </Text>
          </Pressable>
        ))}
      </View>

      {showInfoBox && (
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            {translate(
              'appearance.infoBox',
              'Your appearance preferences are stored locally on this device.'
            )}
          </Text>
        </View>
      )}
    </View>
  );
}

const useStyles = createThemedStyles(colors => ({
  container: {
    padding: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 10,
    padding: 3,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  segmentActive: {
    backgroundColor: colors.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  segmentTextActive: {
    color: colors.text,
    fontWeight: '600',
  },
  infoBox: {
    marginTop: 20,
    padding: 12,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 8,
  },
  infoText: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
}));
