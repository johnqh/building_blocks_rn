/**
 * @fileoverview Tests for ToastProvider and useToast.
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, render } from './test-utils';
import { ThemeProvider } from '../theme/ThemeContext';
import { ToastProvider, useToast } from '../components/toast/ToastProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

function createWrapper() {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <ThemeProvider>
        <ToastProvider>{children}</ToastProvider>
      </ThemeProvider>
    );
  };
}

describe('ToastProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    AsyncStorage.getItem.mockResolvedValue(null);
  });

  it('should provide addToast and removeToast functions', async () => {
    const { result } = await renderHook(() => useToast(), {
      wrapper: createWrapper(),
    });

    expect(result.current.addToast).toBeDefined();
    expect(result.current.removeToast).toBeDefined();
    expect(typeof result.current.addToast).toBe('function');
    expect(typeof result.current.removeToast).toBe('function');
  });

  it('should add a toast via addToast without throwing', async () => {
    const { result } = await renderHook(() => useToast(), {
      wrapper: createWrapper(),
    });

    expect(() => {
      result.current.addToast('Test message', 'success');
    }).not.toThrow();
  });

  it('should default to info type when not specified', async () => {
    const { result } = await renderHook(() => useToast(), {
      wrapper: createWrapper(),
    });

    expect(() => {
      result.current.addToast('Default type');
    }).not.toThrow();
  });

  it('should manually remove a toast via removeToast without throwing', async () => {
    const { result } = await renderHook(() => useToast(), {
      wrapper: createWrapper(),
    });

    result.current.addToast('To remove', 'error', 0);

    expect(() => {
      result.current.removeToast('toast-1');
    }).not.toThrow();
  });
});

describe('useToast', () => {
  it('should throw when not within a ToastProvider', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    let caughtError: Error | null = null;

    function ThrowCatcher() {
      try {
        useToast();
      } catch (e) {
        caughtError = e as Error;
      }
      return null;
    }

    await render(<ThrowCatcher />);

    expect(caughtError).not.toBeNull();
    expect(caughtError!.message).toBe(
      'useToast must be used within a ToastProvider'
    );

    consoleSpy.mockRestore();
  });
});
