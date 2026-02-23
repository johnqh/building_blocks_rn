// Core components (no auth dependency)
export * from './src/components/header';
export * from './src/components/footer';
export * from './src/components/layout';
export * from './src/components/settings';
export * from './src/components/pages';

// App wrapper without auth dependency
export { SudobilityAppRN } from './src/app/SudobilityAppRN';
export type { SudobilityAppRNProps } from './src/app/SudobilityAppRN';

// Subscription components without auth dependency
export {
  SafeSubscriptionContext,
  STUB_SUBSCRIPTION_VALUE,
  useSafeSubscription,
} from './src/components/subscription/SafeSubscriptionContext';
export type { SubscriptionContextValue } from './src/components/subscription/SafeSubscriptionContext';
export { SubscriptionScreen } from './src/components/subscription/SubscriptionScreen';
export type {
  SubscriptionScreenProps,
  SubscriptionPackage,
} from './src/components/subscription/SubscriptionScreen';

// Theme
export * from './src/theme';

// Constants
export * from './src/constants';

// Types
export * from './src/types';

// Utils
export { createThemedStyles } from './src/utils';

// Hooks
export { useResponsive } from './src/hooks';
export type { ResponsiveInfo } from './src/hooks';

// Toast
export { ToastProvider, useToast } from './src/components/toast';
export type { Toast, ToastType } from './src/components/toast';

// Error Boundary
export { ErrorBoundary } from './src/components/error';
export type { ErrorBoundaryProps } from './src/components/error';

// i18n
export { initializeI18nRN, getI18n, i18n } from './src/i18n';
export type { I18nConfig } from './src/i18n';

// Native modules (desktop only)
export {
  authenticate as webAuthAuthenticate,
  generateCodeVerifier as webAuthGenerateCodeVerifier,
  sha256Base64Url as webAuthSha256Base64Url,
} from './src/native/WebAuth';
