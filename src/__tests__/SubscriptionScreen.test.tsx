/**
 * @fileoverview Tests for SubscriptionScreen component.
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from './test-utils';
import { ThemeProvider } from '../theme/ThemeContext';
import { SubscriptionScreen } from '../components/subscription/SubscriptionScreen';
import type { SubscriptionPackage } from '../components/subscription/SubscriptionScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mockPackages: SubscriptionPackage[] = [
  {
    id: 'monthly',
    title: 'Monthly',
    price: 4.99,
    currency: 'USD',
    period: 'monthly',
    features: ['Feature A', 'Feature B'],
  },
  {
    id: 'yearly',
    title: 'Yearly',
    price: 39.99,
    currency: 'USD',
    period: 'yearly',
    isMostPopular: true,
    features: ['Feature A', 'Feature B', 'Feature C'],
  },
];

describe('SubscriptionScreen', () => {
  const defaultProps = {
    packages: mockPackages,
    onPurchase: vi.fn().mockResolvedValue(true),
    onRestore: vi.fn().mockResolvedValue(true),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    AsyncStorage.getItem.mockResolvedValue(null);
  });

  it('should render title', async () => {
    const { getByText } = await render(
      <ThemeProvider>
        <SubscriptionScreen {...defaultProps} />
      </ThemeProvider>
    );

    expect(getByText('Subscription')).toBeTruthy();
  });

  it('should render package titles', async () => {
    const { getByText } = await render(
      <ThemeProvider>
        <SubscriptionScreen {...defaultProps} />
      </ThemeProvider>
    );

    expect(getByText('Monthly')).toBeTruthy();
    expect(getByText('Yearly')).toBeTruthy();
  });

  it('should render package prices', async () => {
    const { getByText } = await render(
      <ThemeProvider>
        <SubscriptionScreen {...defaultProps} />
      </ThemeProvider>
    );

    expect(getByText('USD 4.99')).toBeTruthy();
    expect(getByText('USD 39.99')).toBeTruthy();
  });

  it('should render Most Popular badge', async () => {
    const { getByText } = await render(
      <ThemeProvider>
        <SubscriptionScreen {...defaultProps} />
      </ThemeProvider>
    );

    expect(getByText('Most Popular')).toBeTruthy();
  });

  it('should render restore button', async () => {
    const { getByText } = await render(
      <ThemeProvider>
        <SubscriptionScreen {...defaultProps} />
      </ThemeProvider>
    );

    expect(getByText('Restore Purchases')).toBeTruthy();
  });

  it('should show Current Plan badge for current package', async () => {
    const packagesWithCurrent = [
      ...mockPackages,
      {
        id: 'lifetime',
        title: 'Lifetime',
        price: 99.99,
        currency: 'USD',
        period: 'lifetime' as const,
        isCurrent: true,
      },
    ];

    const { getByText } = await render(
      <ThemeProvider>
        <SubscriptionScreen {...defaultProps} packages={packagesWithCurrent} />
      </ThemeProvider>
    );

    expect(getByText('Current Plan')).toBeTruthy();
  });

  it('should use custom labels', async () => {
    const { getByText } = await render(
      <ThemeProvider>
        <SubscriptionScreen
          {...defaultProps}
          labels={{
            title: 'Premium Plans',
            restore: 'Restore',
          }}
        />
      </ThemeProvider>
    );

    expect(getByText('Premium Plans')).toBeTruthy();
    expect(getByText('Restore')).toBeTruthy();
  });

  it('should render subscribe buttons', async () => {
    const { getAllByText } = await render(
      <ThemeProvider>
        <SubscriptionScreen {...defaultProps} />
      </ThemeProvider>
    );

    const subscribeButtons = getAllByText('Subscribe');
    expect(subscribeButtons.length).toBe(2);
  });
});
