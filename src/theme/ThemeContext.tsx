/**
 * @fileoverview Theme context and provider for React Native.
 *
 * Manages light/dark mode with automatic system detection via `useColorScheme()`.
 * Persists user preference to AsyncStorage and delays rendering until the
 * persisted theme is loaded (prevents theme flash on startup).
 *
 * Includes a subtle fade animation (250ms) when switching between light and dark
 * modes to provide a smooth visual transition.
 *
 * Provides dual hooks:
 * - `useTheme()` - throws if no ThemeProvider is present
 * - `useThemeSafe()` - returns null if no ThemeProvider is present
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Animated, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme } from '../types';
import { type ThemeColors, lightColors, darkColors } from './colors';

const THEME_STORAGE_KEY = '@building_blocks/theme';

export interface ThemeContextValue {
  /** User's theme preference */
  theme: Theme;
  /** Resolved theme (light or dark) based on preference + system */
  resolvedTheme: 'light' | 'dark';
  /** Resolved color palette */
  colors: ThemeColors;
  /** Whether the resolved theme is dark */
  isDark: boolean;
  /** Update the theme preference */
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: React.ReactNode;
  /** Initial theme override (default: system) */
  initialTheme?: Theme;
  /** Custom storage key prefix */
  storageKeyPrefix?: string;
}

export function ThemeProvider({
  children,
  initialTheme,
  storageKeyPrefix,
}: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<Theme>(initialTheme ?? Theme.SYSTEM);
  const [loaded, setLoaded] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const storageKey = storageKeyPrefix
    ? `${storageKeyPrefix}/${THEME_STORAGE_KEY}`
    : THEME_STORAGE_KEY;

  // Load persisted theme on mount
  useEffect(() => {
    AsyncStorage.getItem(storageKey).then(stored => {
      if (stored && Object.values(Theme).includes(stored as Theme)) {
        setThemeState(stored as Theme);
      }
      setLoaded(true);
    });
  }, [storageKey]);

  const resolvedTheme = useMemo((): 'light' | 'dark' => {
    if (theme === Theme.SYSTEM) {
      return systemColorScheme === 'dark' ? 'dark' : 'light';
    }
    return theme === Theme.DARK ? 'dark' : 'light';
  }, [theme, systemColorScheme]);

  // Track previous resolved theme for animation
  const prevResolvedThemeRef = useRef(resolvedTheme);

  useEffect(() => {
    if (loaded && prevResolvedThemeRef.current !== resolvedTheme) {
      prevResolvedThemeRef.current = resolvedTheme;
      fadeAnim.setValue(0.7);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [resolvedTheme, loaded, fadeAnim]);

  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);
      AsyncStorage.setItem(storageKey, newTheme);
    },
    [storageKey]
  );

  const colors = useMemo(
    () => (resolvedTheme === 'dark' ? darkColors : lightColors),
    [resolvedTheme]
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      colors,
      isDark: resolvedTheme === 'dark',
      setTheme,
    }),
    [theme, resolvedTheme, colors, setTheme]
  );

  // Don't render children until we've loaded the persisted theme
  if (!loaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {children}
      </Animated.View>
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access theme context.
 * Must be used within a ThemeProvider.
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

/**
 * Safely access theme context.
 * Returns null if not within a ThemeProvider.
 */
export function useThemeSafe(): ThemeContextValue | null {
  return useContext(ThemeContext);
}
