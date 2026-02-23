/**
 * @fileoverview Typography scale and font utilities for React Native.
 *
 * Defines font sizes (xs through 4xl), font weights (normal through bold),
 * and a `getFontSizeMultiplier()` utility that maps the `FontSize` enum
 * to a numeric scale factor (0.875 for small, 1.0 for medium, 1.125 for large).
 */
import { FontSize } from '../types';

export const fontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
} as const;

export const fontWeights = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

/**
 * Get font size scale multiplier based on FontSize setting.
 */
export function getFontSizeMultiplier(fontSize: FontSize | string): number {
  switch (fontSize) {
    case FontSize.SMALL:
      return 0.875;
    case FontSize.LARGE:
      return 1.125;
    case FontSize.MEDIUM:
    default:
      return 1;
  }
}
