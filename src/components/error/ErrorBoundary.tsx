/**
 * @fileoverview Reusable error boundary component for React Native.
 *
 * Catches JavaScript errors in its child component tree, logs them,
 * and displays a user-friendly fallback screen with an error message
 * and a retry button. Must be a class component since React does not
 * support error boundary hooks.
 *
 * @example
 * ```tsx
 * <ErrorBoundary fallbackMessage="Something went wrong.">
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  /** Custom fallback component. Receives error and reset function. */
  FallbackComponent?: React.ComponentType<{
    error: Error;
    resetError: () => void;
  }>;
  /** Fallback message displayed in the default fallback UI. */
  fallbackMessage?: string;
  /** Called when an error is caught. Useful for logging. */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.props.onError?.(error, errorInfo);
  }

  resetError = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): React.ReactNode {
    if (this.state.hasError && this.state.error) {
      if (this.props.FallbackComponent) {
        return (
          <this.props.FallbackComponent
            error={this.state.error}
            resetError={this.resetError}
          />
        );
      }

      return (
        <View
          style={styles.container}
          accessibilityRole='summary'
          accessibilityLabel='An error has occurred'
        >
          <Text style={styles.title}>Oops!</Text>
          <Text style={styles.message}>
            {this.props.fallbackMessage ??
              'Something went wrong. Please try again.'}
          </Text>
          <Text style={styles.errorDetail}>{this.state.error.message}</Text>
          <Pressable
            style={styles.retryButton}
            onPress={this.resetError}
            accessibilityRole='button'
            accessibilityLabel='Try again'
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f9fafb',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 12,
  },
  errorDetail: {
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  retryButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
