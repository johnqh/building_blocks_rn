/**
 * @fileoverview Tests for AppearanceSettings component.
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from './test-utils';
import { ThemeProvider } from '../theme/ThemeContext';
import { AppearanceSettings } from '../components/settings/AppearanceSettings';
import { Theme, FontSize } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('AppearanceSettings', () => {
  const defaultProps = {
    theme: Theme.SYSTEM as Theme | string,
    fontSize: FontSize.MEDIUM as FontSize | string,
    onThemeChange: vi.fn(),
    onFontSizeChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    AsyncStorage.getItem.mockResolvedValue(null);
  });

  it('should render theme options', async () => {
    const { getByText } = await render(
      <ThemeProvider>
        <AppearanceSettings {...defaultProps} />
      </ThemeProvider>
    );

    expect(getByText('Light')).toBeTruthy();
    expect(getByText('Dark')).toBeTruthy();
    expect(getByText('System')).toBeTruthy();
  });

  it('should render font size options', async () => {
    const { getByText } = await render(
      <ThemeProvider>
        <AppearanceSettings {...defaultProps} />
      </ThemeProvider>
    );

    expect(getByText('Small')).toBeTruthy();
    expect(getByText('Medium')).toBeTruthy();
    expect(getByText('Large')).toBeTruthy();
  });

  it('should render heading', async () => {
    const { getByText } = await render(
      <ThemeProvider>
        <AppearanceSettings {...defaultProps} />
      </ThemeProvider>
    );

    expect(getByText('Appearance')).toBeTruthy();
  });

  it('should use translation function when provided', async () => {
    const t = vi.fn((key: string, fallback?: string) => {
      if (key === 'appearance.title') return 'Aspetto';
      return fallback ?? key;
    });

    const { getByText } = await render(
      <ThemeProvider>
        <AppearanceSettings {...defaultProps} t={t} />
      </ThemeProvider>
    );

    expect(getByText('Aspetto')).toBeTruthy();
  });

  it('should show info box when showInfoBox is true', async () => {
    const { getByText } = await render(
      <ThemeProvider>
        <AppearanceSettings {...defaultProps} showInfoBox={true} />
      </ThemeProvider>
    );

    expect(
      getByText(
        'Your appearance preferences are stored locally on this device.'
      )
    ).toBeTruthy();
  });

  it('should not show info box by default', async () => {
    const { queryByText } = await render(
      <ThemeProvider>
        <AppearanceSettings {...defaultProps} />
      </ThemeProvider>
    );

    expect(
      queryByText(
        'Your appearance preferences are stored locally on this device.'
      )
    ).toBeNull();
  });
});
