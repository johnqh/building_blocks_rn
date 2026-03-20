/**
 * @fileoverview Empty state component for React Native.
 *
 * Displays a centered message with a primary action button. Useful for
 * screens or sections that have no data to show yet (e.g. empty lists).
 */
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { createThemedStyles } from '../../utils/styles';

export interface EmptyStateProps {
  /** Descriptive message shown above the action button */
  message: string;
  /** Label for the primary action button */
  buttonLabel: string;
  /** Callback fired when the action button is pressed */
  onPress: () => void;
}

export function EmptyState({ message, buttonLabel, onPress }: EmptyStateProps) {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      <Pressable
        style={styles.button}
        onPress={onPress}
        accessibilityRole='button'
        accessibilityLabel={buttonLabel}
      >
        <Text style={styles.buttonText}>{buttonLabel}</Text>
      </Pressable>
    </View>
  );
}

const useStyles = createThemedStyles(colors => ({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  message: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 6,
    minHeight: 44,
    paddingHorizontal: 24,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
}));
