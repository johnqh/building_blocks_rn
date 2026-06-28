/**
 * @fileoverview Color palette and theme color definitions for React Native.
 *
 * Defines the color palette (matching Tailwind CSS color tokens), the
 * `ThemeColors` interface (20 properties), and both light and dark theme
 * color objects. Light mode uses white/light-gray surfaces; dark mode uses
 * gray-800/900 surfaces with inverted text colors.
 */

import { defaultTheme } from '@sudobility/design/themes';

export const palette = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
} as const;

export interface ThemeColors {
  primary: string;
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  notification: string;
  surface: string;
  surfaceSecondary: string;
  error: string;
  errorBg: string;
  success: string;
  successBg: string;
  successText: string;
  warning: string;
  info: string;
  invertedText: string;
  invertedBackground: string;
}

/**
 * Convert a design-system HSL token ("H S% L%") to a hex string. React Native's
 * color parser cannot read space-separated `hsl()` (CSS Color 4) syntax, so the
 * theme is resolved to hex at module load. `lOverride` produces tint variants
 * (e.g. error/success backgrounds) from the same hue, keeping them theme-derived
 * rather than hardcoded.
 */
function hslToHex(token: string, lOverride?: number): string {
  const [h, s, l] = token.replace(/%/g, '').trim().split(/\s+/).map(Number);
  const L = (lOverride ?? l) / 100;
  const S = s / 100;
  const a = S * Math.min(L, 1 - L);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const c = L - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(255 * c)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// Theme colors are derived from @sudobility/design's default theme so the RN
// library follows the design system instead of a local hardcoded palette.
const L = defaultTheme.light;
const D = defaultTheme.dark;

export const lightColors: ThemeColors = {
  primary: hslToHex(L.primary),
  background: hslToHex(L.background),
  card: hslToHex(L.card),
  text: hslToHex(L.foreground),
  textSecondary: hslToHex(L.mutedForeground),
  textMuted: hslToHex(L.mutedForeground, 60),
  border: hslToHex(L.border),
  notification: hslToHex(L.destructive),
  surface: hslToHex(L.card),
  surfaceSecondary: hslToHex(L.muted),
  error: hslToHex(L.destructive),
  errorBg: hslToHex(L.destructive, 96),
  success: hslToHex(L.success),
  successBg: hslToHex(L.success, 92),
  successText: hslToHex(L.success),
  warning: hslToHex(L.warning),
  info: hslToHex(L.info),
  invertedText: hslToHex(D.foreground),
  invertedBackground: hslToHex(D.background),
};

export const darkColors: ThemeColors = {
  primary: hslToHex(D.primary),
  background: hslToHex(D.background),
  card: hslToHex(D.card),
  text: hslToHex(D.foreground),
  textSecondary: hslToHex(D.mutedForeground),
  textMuted: hslToHex(D.mutedForeground, 50),
  border: hslToHex(D.border),
  notification: hslToHex(D.destructive),
  surface: hslToHex(D.card),
  surfaceSecondary: hslToHex(D.muted),
  error: hslToHex(D.destructive),
  errorBg: hslToHex(D.destructive, 14),
  success: hslToHex(D.success),
  successBg: hslToHex(D.success, 14),
  successText: hslToHex(D.success, 70),
  warning: hslToHex(D.warning),
  info: hslToHex(D.info),
  invertedText: hslToHex(L.foreground),
  invertedBackground: hslToHex(L.background),
};
