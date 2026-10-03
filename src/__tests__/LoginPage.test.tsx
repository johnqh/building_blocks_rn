/**
 * @fileoverview LoginPage: the page around components-rn's `LoginView`.
 *
 * The form is the library's and is tested there; what is pinned here is what
 * the page adds and what it passes on — as the web `LoginPage` does.
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act } from 'react';
import { render } from './test-utils';

type ViewProps = Record<string, unknown> & {
  onModeChange: (mode: string) => void;
};
const viewProps: { current: ViewProps | null } = { current: null };

vi.mock('@sudobility/components-rn', () => ({
  DEFAULT_LOGIN_VIEW_TEXT: { signIn: 'Sign in', signUp: 'Sign up' },
  LOGIN_VIEW_MAX_WIDTH: 448,
  PageContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='page-container'>{children}</div>
  ),
  Heading: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <h1 className={className}>{children}</h1>,
  LoginView: (props: ViewProps) => {
    viewProps.current = props;
    return <div data-testid='login-view' />;
  },
}));

import { LoginPage } from '../components/pages/LoginPage';

const handler = () => vi.fn(async () => {});

describe('LoginPage', () => {
  beforeEach(() => {
    viewProps.current = null;
  });

  it('shows the app name and a heading that follows the form', async () => {
    const { getByText } = await render(
      <LoginPage
        appName='TestApp'
        onEmailSignIn={handler()}
        onEmailSignUp={handler()}
        onPasswordReset={handler()}
        onSuccess={vi.fn()}
      />
    );
    expect(getByText('TestApp')).toBeTruthy();
    expect(getByText('Sign in to your account')).toBeTruthy();

    await act(async () => viewProps.current!.onModeChange('signUp'));
    expect(getByText('Create your account')).toBeTruthy();

    await act(async () => viewProps.current!.onModeChange('resetPassword'));
    expect(getByText('Reset your password')).toBeTruthy();
  });

  it('hands the form only what it is configured to offer', async () => {
    await render(
      <LoginPage
        appName='TestApp'
        onEmailSignIn={handler()}
        onEmailSignUp={handler()}
        onPasswordReset={handler()}
        onGoogleSignIn={handler()}
        onAppleSignIn={handler()}
        showSignUp={false}
        onSuccess={vi.fn()}
      />
    );
    const props = viewProps.current!;
    expect(props.onEmailSignUp).toBeUndefined();
    expect(props.onPasswordReset).toBeDefined();
    expect(props.onGoogleSignIn).toBeDefined();
    // Apple is off unless asked for, as on the web.
    expect(props.onAppleSignIn).toBeUndefined();
  });

  it('colours the title and the links by variant', async () => {
    const { getByText } = await render(
      <LoginPage
        appName='TestApp'
        onEmailSignIn={handler()}
        onSuccess={vi.fn()}
        colorVariant='emerald'
      />
    );
    expect(getByText('TestApp').className).toContain('text-success');
    expect(viewProps.current!.linkClassName).toBe('text-success');
  });

  it('localises the headings and the form through one text object', async () => {
    const { getByText } = await render(
      <LoginPage
        appName='TestApp'
        onEmailSignIn={handler()}
        onSuccess={vi.fn()}
        text={{ signInToAccount: '登录您的账户', signIn: '登录' }}
      />
    );
    expect(getByText('登录您的账户')).toBeTruthy();
    expect((viewProps.current!.text as { signIn: string }).signIn).toBe('登录');
  });
});
