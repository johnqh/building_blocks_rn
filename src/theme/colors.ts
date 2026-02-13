/**
 * Color palette for building_blocks_rn.
 * Matches the web app's Tailwind color tokens.
 */

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

export const lightColors: ThemeColors = {
  primary: palette.primary[600],
  background: palette.gray[50],
  card: palette.white,
  text: palette.gray[900],
  textSecondary: palette.gray[600],
  textMuted: palette.gray[400],
  border: palette.gray[200],
  notification: palette.error,
  surface: palette.white,
  surfaceSecondary: palette.gray[100],
  error: palette.error,
  errorBg: '#fef2f2',
  success: palette.success,
  successBg: '#dcfce7',
  successText: '#16a34a',
  warning: palette.warning,
  info: palette.info,
  invertedText: palette.white,
  invertedBackground: palette.black,
};

export const darkColors: ThemeColors = {
  primary: palette.primary[400],
  background: palette.gray[900],
  card: palette.gray[800],
  text: palette.gray[50],
  textSecondary: palette.gray[400],
  textMuted: palette.gray[500],
  border: palette.gray[700],
  notification: palette.error,
  surface: palette.gray[800],
  surfaceSecondary: palette.gray[700],
  error: palette.error,
  errorBg: '#451a1a',
  success: palette.success,
  successBg: '#052e16',
  successText: '#86efac',
  warning: palette.warning,
  info: palette.info,
  invertedText: palette.black,
  invertedBackground: palette.white,
};
