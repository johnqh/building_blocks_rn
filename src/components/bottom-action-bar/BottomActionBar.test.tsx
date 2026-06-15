/**
 * @fileoverview Tests for BottomActionBar.
 */
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@react-navigation/bottom-tabs', () => ({
  BottomTabBarHeightContext: React.createContext<number | undefined>(undefined),
}));

import { Text } from 'react-native';
import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';
import { render } from '../../__tests__/test-utils';
import { ThemeProvider } from '../../theme/ThemeContext';
import { BottomActionBar } from './BottomActionBar';

describe('BottomActionBar', () => {
  it('renders its children when there is no tab bar', async () => {
    const { getByText } = await render(
      <ThemeProvider>
        <BottomActionBar>
          <Text>Pay</Text>
        </BottomActionBar>
      </ThemeProvider>
    );
    expect(getByText('Pay')).toBeTruthy();
  });

  it('renders its children inside a tab navigator', async () => {
    const { getByText } = await render(
      <ThemeProvider>
        <BottomTabBarHeightContext.Provider value={56}>
          <BottomActionBar>
            <Text>Continue</Text>
          </BottomActionBar>
        </BottomTabBarHeightContext.Provider>
      </ThemeProvider>
    );
    expect(getByText('Continue')).toBeTruthy();
  });
});
