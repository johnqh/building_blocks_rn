/**
 * @fileoverview Responsive breakpoint detection hook for React Native.
 *
 * Provides window dimension info and boolean breakpoint flags
 * for adapting layouts to different screen sizes.
 */
import { useWindowDimensions } from 'react-native';

/**
 * Responsive dimension and breakpoint information.
 */
export interface ResponsiveInfo {
  /** Current window width in logical pixels */
  width: number;
  /** Current window height in logical pixels */
  height: number;
  /** true when width < 380 (small phones) */
  isSmall: boolean;
  /** true when width is 380-768 (standard phones) */
  isMedium: boolean;
  /** true when width > 768 (tablets and larger) */
  isLarge: boolean;
}

/**
 * Hook for responsive breakpoint detection.
 *
 * Uses `useWindowDimensions` to reactively track screen size
 * and provides boolean flags for common breakpoint ranges.
 *
 * @returns Responsive dimension info with breakpoint booleans
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isLarge, isSmall } = useResponsive();
 *   return (
 *     <View style={{ padding: isLarge ? 24 : isSmall ? 8 : 16 }}>
 *       <Text>Responsive content</Text>
 *     </View>
 *   );
 * }
 * ```
 */
export function useResponsive(): ResponsiveInfo {
  const { width, height } = useWindowDimensions();
  return {
    width,
    height,
    isSmall: width < 380,
    isMedium: width >= 380 && width <= 768,
    isLarge: width > 768,
  };
}
