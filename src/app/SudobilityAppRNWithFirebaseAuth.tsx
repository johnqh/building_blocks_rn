import React from 'react';
import type { ComponentType, ReactNode } from 'react';
import { SudobilityAppRN } from './SudobilityAppRN';
import type { SudobilityAppRNProps } from './SudobilityAppRN';

export interface SudobilityAppRNWithFirebaseAuthProps extends SudobilityAppRNProps {
  /** Firebase auth provider component */
  AuthProvider: ComponentType<{ children: ReactNode }>;
  /** API provider component (wraps children with auth-aware API context) */
  ApiProviderComponent?: ComponentType<{ children: ReactNode }>;
}

export function SudobilityAppRNWithFirebaseAuth({
  children,
  AuthProvider,
  ApiProviderComponent,
  ...appProps
}: SudobilityAppRNWithFirebaseAuthProps) {
  let content = <>{children}</>;

  // API provider (innermost of auth stack)
  if (ApiProviderComponent) {
    content = <ApiProviderComponent>{content}</ApiProviderComponent>;
  }

  // Auth provider
  content = <AuthProvider>{content}</AuthProvider>;

  return <SudobilityAppRN {...appProps}>{content}</SudobilityAppRN>;
}
