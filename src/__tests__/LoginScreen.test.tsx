/**
 * @fileoverview Tests for LoginScreen component.
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from './test-utils';
import { ThemeProvider } from '../theme/ThemeContext';
import { LoginScreen } from '../components/pages/LoginScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('LoginScreen', () => {
  const defaultProps = {
    appName: 'TestApp',
    onLogin: vi.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    AsyncStorage.getItem.mockResolvedValue(null);
  });

  it('should render sign in title with app name', async () => {
    const { getByText } = await render(
      <ThemeProvider>
        <LoginScreen {...defaultProps} />
      </ThemeProvider>
    );

    expect(getByText('Sign in to TestApp')).toBeTruthy();
  });

  it('should render email and password labels', async () => {
    const { getByText } = await render(
      <ThemeProvider>
        <LoginScreen {...defaultProps} />
      </ThemeProvider>
    );

    expect(getByText('Email')).toBeTruthy();
    expect(getByText('Password')).toBeTruthy();
  });

  it('should render sign in button', async () => {
    const { getByText } = await render(
      <ThemeProvider>
        <LoginScreen {...defaultProps} />
      </ThemeProvider>
    );

    expect(getByText('Sign In')).toBeTruthy();
  });

  it('should show Google sign-in button when enabled', async () => {
    const { getByText } = await render(
      <ThemeProvider>
        <LoginScreen
          {...defaultProps}
          showGoogleSignIn
          onGoogleSignIn={vi.fn()}
        />
      </ThemeProvider>
    );

    expect(getByText('Continue with Google')).toBeTruthy();
  });

  it('should show Apple sign-in button when enabled', async () => {
    const { getByText } = await render(
      <ThemeProvider>
        <LoginScreen
          {...defaultProps}
          showAppleSignIn
          onAppleSignIn={vi.fn()}
        />
      </ThemeProvider>
    );

    expect(getByText('Continue with Apple')).toBeTruthy();
  });

  it('should show sign up toggle when showSignUp is true and onSignUp provided', async () => {
    const { getByText } = await render(
      <ThemeProvider>
        <LoginScreen {...defaultProps} showSignUp={true} onSignUp={vi.fn()} />
      </ThemeProvider>
    );

    expect(getByText("Don't have an account? Sign up")).toBeTruthy();
  });

  it('should not show sign up toggle when showSignUp is false', async () => {
    const { queryByText } = await render(
      <ThemeProvider>
        <LoginScreen {...defaultProps} showSignUp={false} />
      </ThemeProvider>
    );

    expect(queryByText("Don't have an account? Sign up")).toBeNull();
  });

  it('should not show social buttons by default', async () => {
    const { queryByText } = await render(
      <ThemeProvider>
        <LoginScreen {...defaultProps} />
      </ThemeProvider>
    );

    expect(queryByText('Continue with Google')).toBeNull();
    expect(queryByText('Continue with Apple')).toBeNull();
  });
});
