/**
 * @fileoverview Tests for ErrorBoundary component.
 */
import React from 'react';
import { Text, View, Pressable } from 'react-native';
import { describe, it, expect, vi } from 'vitest';
import { render } from './test-utils';
import { ErrorBoundary } from '../components/error/ErrorBoundary';

function ThrowError({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <Text>No Error</Text>;
}

describe('ErrorBoundary', () => {
  it('should render children when no error occurs', async () => {
    const { getByText } = await render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(getByText('No Error')).toBeTruthy();
  });

  it('should render fallback UI when error occurs', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { getByText } = await render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(getByText('Oops!')).toBeTruthy();
    expect(getByText('Test error message')).toBeTruthy();
    expect(getByText('Something went wrong. Please try again.')).toBeTruthy();
    expect(getByText('Try Again')).toBeTruthy();

    consoleSpy.mockRestore();
  });

  it('should show custom fallback message', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { getByText } = await render(
      <ErrorBoundary fallbackMessage='Custom error message'>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(getByText('Custom error message')).toBeTruthy();

    consoleSpy.mockRestore();
  });

  it('should call onError callback when error occurs', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const onError = vi.fn();

    await render(
      <ErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Test error message' }),
      expect.objectContaining({ componentStack: expect.any(String) })
    );

    consoleSpy.mockRestore();
  });

  it('should render custom FallbackComponent', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const CustomFallback = ({
      error,
      resetError,
    }: {
      error: Error;
      resetError: () => void;
    }) => (
      <View>
        <Text>Custom: {error.message}</Text>
        <Pressable onPress={resetError}>
          <Text>Reset</Text>
        </Pressable>
      </View>
    );

    const { getByText } = await render(
      <ErrorBoundary FallbackComponent={CustomFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(getByText('Custom: Test error message')).toBeTruthy();
    expect(getByText('Reset')).toBeTruthy();

    consoleSpy.mockRestore();
  });
});
