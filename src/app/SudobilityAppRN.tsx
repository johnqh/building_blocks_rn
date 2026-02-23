/**
 * @fileoverview Base app wrapper for Sudobility React Native apps.
 *
 * Composes essential providers (SafeArea, i18n, Theme, QueryClient, Toast)
 * in a deterministic order. Each provider slot is optional and replaceable via props.
 * The entire provider stack is wrapped in an ErrorBoundary to catch initialization
 * errors and display a user-friendly fallback screen.
 */
import React from 'react';
import type { ComponentType, ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { I18nextProvider } from 'react-i18next';
import type { i18n as I18nInstance } from 'i18next';
import { ThemeProvider } from '../theme/ThemeContext';
import { ToastProvider } from '../components/toast/ToastProvider';
import { ErrorBoundary } from '../components/error/ErrorBoundary';
import type { ErrorBoundaryProps } from '../components/error/ErrorBoundary';
import { Theme } from '../types';

/**
 * Props for the SudobilityAppRN base app wrapper.
 */
export interface SudobilityAppRNProps {
  children: ReactNode;
  /** Pre-configured i18n instance */
  i18n?: I18nInstance;
  /** Optional custom ThemeProvider wrapper */
  ThemeProviderComponent?: ComponentType<{ children: ReactNode }>;
  /** Optional custom ToastProvider wrapper */
  ToastProviderComponent?: ComponentType<{ children: ReactNode }>;
  /** Query client provider (e.g., from @tanstack/react-query) */
  QueryClientProvider?: ComponentType<{ children: ReactNode }>;
  /** Optional additional providers to wrap around children */
  AppProviders?: ComponentType<{ children: ReactNode }>;
  /** Initial theme */
  initialTheme?: Theme;
  /** Storage key prefix for persisted settings */
  storageKeyPrefix?: string;
  /** Custom error boundary fallback component */
  ErrorFallbackComponent?: ErrorBoundaryProps['FallbackComponent'];
  /** Called when the error boundary catches an error */
  onError?: ErrorBoundaryProps['onError'];
}

/**
 * Base app wrapper that composes providers in a specific order (outermost to innermost):
 *
 * 1. ErrorBoundary (outermost, catches provider initialization errors)
 * 2. SafeAreaProvider (always present)
 * 3. I18nextProvider (if `i18n` provided)
 * 4. ThemeProvider (or custom `ThemeProviderComponent`)
 * 5. QueryClientProvider (if provided)
 * 6. ToastProvider (or custom `ToastProviderComponent`)
 * 7. AppProviders (custom additional providers, innermost)
 *
 * @example
 * ```tsx
 * import { SudobilityAppRN } from '@sudobility/building_blocks_rn';
 *
 * function App() {
 *   return (
 *     <SudobilityAppRN i18n={i18n} initialTheme={Theme.SYSTEM}>
 *       <NavigationContainer>
 *         <RootNavigator />
 *       </NavigationContainer>
 *     </SudobilityAppRN>
 *   );
 * }
 * ```
 */
export function SudobilityAppRN({
  children,
  i18n,
  ThemeProviderComponent,
  ToastProviderComponent,
  QueryClientProvider,
  AppProviders,
  initialTheme,
  storageKeyPrefix,
  ErrorFallbackComponent,
  onError,
}: SudobilityAppRNProps) {
  let content = <>{children}</>;

  // Wrap with additional providers (innermost)
  if (AppProviders) {
    content = <AppProviders>{content}</AppProviders>;
  }

  // Toast
  if (ToastProviderComponent) {
    content = <ToastProviderComponent>{content}</ToastProviderComponent>;
  } else {
    content = <ToastProvider>{content}</ToastProvider>;
  }

  // Query client
  if (QueryClientProvider) {
    content = <QueryClientProvider>{content}</QueryClientProvider>;
  }

  // Theme
  if (ThemeProviderComponent) {
    content = <ThemeProviderComponent>{content}</ThemeProviderComponent>;
  } else {
    content = (
      <ThemeProvider
        initialTheme={initialTheme}
        storageKeyPrefix={storageKeyPrefix}
      >
        {content}
      </ThemeProvider>
    );
  }

  // i18n
  if (i18n) {
    content = <I18nextProvider i18n={i18n}>{content}</I18nextProvider>;
  }

  // SafeArea (outermost)
  content = <SafeAreaProvider>{content}</SafeAreaProvider>;

  // ErrorBoundary (very outermost)
  return (
    <ErrorBoundary FallbackComponent={ErrorFallbackComponent} onError={onError}>
      {content}
    </ErrorBoundary>
  );
}
