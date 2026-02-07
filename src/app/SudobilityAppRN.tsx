import React from 'react';
import type { ComponentType, ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { I18nextProvider } from 'react-i18next';
import type { i18n as I18nInstance } from 'i18next';
import { ThemeProvider } from '../theme/ThemeContext';
import { ToastProvider } from '../components/toast/ToastProvider';
import { Theme } from '../types';

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
}

export function SudobilityAppRN({
  children,
  i18n,
  ThemeProviderComponent,
  ToastProviderComponent,
  QueryClientProvider,
  AppProviders,
  initialTheme,
  storageKeyPrefix,
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

  return content;
}
