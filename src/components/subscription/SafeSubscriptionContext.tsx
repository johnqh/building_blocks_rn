import React, { createContext, useContext } from 'react';

export interface SubscriptionContextValue {
  isSubscribed: boolean;
  subscriptionPlan: string | null;
  expirationDate: string | null;
  isLoading: boolean;
}

export const STUB_SUBSCRIPTION_VALUE: SubscriptionContextValue = {
  isSubscribed: false,
  subscriptionPlan: null,
  expirationDate: null,
  isLoading: false,
};

export const SafeSubscriptionContext = createContext<SubscriptionContextValue>(
  STUB_SUBSCRIPTION_VALUE,
);

/**
 * Hook to safely access subscription context.
 * Returns stub value when no provider is available.
 */
export function useSafeSubscription(): SubscriptionContextValue {
  return useContext(SafeSubscriptionContext);
}
