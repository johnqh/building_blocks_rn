import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import type { ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import type { ThemeColors } from '../theme/colors';

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

/**
 * Create a hook that generates themed styles.
 *
 * @example
 * ```tsx
 * const useStyles = createThemedStyles((colors) => ({
 *   container: { backgroundColor: colors.background },
 *   text: { color: colors.text },
 * }));
 *
 * function MyComponent() {
 *   const styles = useStyles();
 *   return <View style={styles.container}><Text style={styles.text}>Hello</Text></View>;
 * }
 * ```
 */
export function createThemedStyles<T extends NamedStyles<T>>(
  factory: (colors: ThemeColors) => T,
) {
  return function useStyles(): T {
    const { colors } = useTheme();
    return useMemo(() => StyleSheet.create(factory(colors)), [colors]);
  };
}
