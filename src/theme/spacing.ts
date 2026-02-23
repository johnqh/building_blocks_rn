/**
 * @fileoverview Spacing scale constants for React Native layout.
 *
 * Provides a consistent spacing scale (xs through 5xl) with values in
 * logical pixels, used throughout all building_blocks_rn components
 * for margins, paddings, and gaps.
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
} as const;

export type SpacingKey = keyof typeof spacing;
