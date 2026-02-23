/**
 * @fileoverview Tests for SafeSubscriptionContext and useSafeSubscription.
 */
import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderHook } from './test-utils';
import {
  SafeSubscriptionContext,
  STUB_SUBSCRIPTION_VALUE,
  useSafeSubscription,
} from '../components/subscription/SafeSubscriptionContext';

describe('SafeSubscriptionContext', () => {
  it('should return stub values when no provider is present', async () => {
    const { result } = await renderHook(() => useSafeSubscription());

    expect(result.current).toEqual(STUB_SUBSCRIPTION_VALUE);
    expect(result.current.isSubscribed).toBe(false);
    expect(result.current.subscriptionPlan).toBeNull();
    expect(result.current.expirationDate).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('should return provided values when provider is present', async () => {
    const customValue = {
      isSubscribed: true,
      subscriptionPlan: 'premium',
      expirationDate: '2025-12-31',
      isLoading: false,
    };

    const { result } = await renderHook(() => useSafeSubscription(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <SafeSubscriptionContext.Provider value={customValue}>
          {children}
        </SafeSubscriptionContext.Provider>
      ),
    });

    expect(result.current.isSubscribed).toBe(true);
    expect(result.current.subscriptionPlan).toBe('premium');
    expect(result.current.expirationDate).toBe('2025-12-31');
  });

  it('should never throw even without provider', async () => {
    await expect(
      renderHook(() => useSafeSubscription())
    ).resolves.not.toThrow();
  });
});

describe('STUB_SUBSCRIPTION_VALUE', () => {
  it('should have correct default values', () => {
    expect(STUB_SUBSCRIPTION_VALUE).toEqual({
      isSubscribed: false,
      subscriptionPlan: null,
      expirationDate: null,
      isLoading: false,
    });
  });
});
