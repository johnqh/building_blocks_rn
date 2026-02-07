import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { createThemedStyles } from '../../utils/styles';

export interface LoginScreenProps {
  /** App name displayed in the header */
  appName: string;
  /** Logo image source */
  logo?: number | { uri: string };
  /** Called on successful login with email and password */
  onLogin: (email: string, password: string) => Promise<void>;
  /** Called on successful sign up with email and password */
  onSignUp?: (email: string, password: string) => Promise<void>;
  /** Called when Google sign-in is pressed */
  onGoogleSignIn?: () => Promise<void>;
  /** Called when Apple sign-in is pressed */
  onAppleSignIn?: () => Promise<void>;
  /** Whether to show Google sign-in button */
  showGoogleSignIn?: boolean;
  /** Whether to show Apple sign-in button */
  showAppleSignIn?: boolean;
  /** Whether to show sign-up option */
  showSignUp?: boolean;
  /** Custom style */
  style?: StyleProp<ViewStyle>;
}

export function LoginScreen({
  appName,
  logo,
  onLogin,
  onSignUp,
  onGoogleSignIn,
  onAppleSignIn,
  showGoogleSignIn = false,
  showAppleSignIn = false,
  showSignUp = true,
  style,
}: LoginScreenProps) {
  const styles = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter email and password.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      if (isSignUp && onSignUp) {
        await onSignUp(email.trim(), password);
      } else {
        await onLogin(email.trim(), password);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred.');
    } finally {
      setLoading(false);
    }
  }, [email, password, isSignUp, onLogin, onSignUp]);

  const handleSocialSignIn = useCallback(
    async (signIn: () => Promise<void>) => {
      setError(null);
      setLoading(true);
      try {
        await signIn();
      } catch (e) {
        setError(e instanceof Error ? e.message : 'An error occurred.');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, style]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.card}>
        {logo && (
          <Image source={logo} style={styles.logo} resizeMode='contain' />
        )}
        <Text style={styles.title}>
          {isSignUp ? `Sign up for ${appName}` : `Sign in to ${appName}`}
        </Text>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder='you@example.com'
            autoCapitalize='none'
            autoCorrect={false}
            keyboardType='email-address'
            textContentType='emailAddress'
            editable={!loading}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder='Password'
            secureTextEntry
            textContentType={isSignUp ? 'newPassword' : 'password'}
            editable={!loading}
            onSubmitEditing={handleSubmit}
          />

          <Pressable
            style={[
              styles.submitButton,
              loading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color='#ffffff' size='small' />
            ) : (
              <Text style={styles.submitButtonText}>
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </Text>
            )}
          </Pressable>
        </View>

        {(showGoogleSignIn || showAppleSignIn) && (
          <View style={styles.socialSection}>
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {showGoogleSignIn && onGoogleSignIn && (
              <Pressable
                style={styles.socialButton}
                onPress={() => handleSocialSignIn(onGoogleSignIn)}
                disabled={loading}
              >
                <Text style={styles.socialButtonText}>
                  Continue with Google
                </Text>
              </Pressable>
            )}

            {showAppleSignIn && onAppleSignIn && (
              <Pressable
                style={[styles.socialButton, styles.appleButton]}
                onPress={() => handleSocialSignIn(onAppleSignIn)}
                disabled={loading}
              >
                <Text style={[styles.socialButtonText, styles.appleButtonText]}>
                  Continue with Apple
                </Text>
              </Pressable>
            )}
          </View>
        )}

        {showSignUp && onSignUp && (
          <Pressable
            style={styles.toggleLink}
            onPress={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
          >
            <Text style={styles.toggleText}>
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </Text>
          </Pressable>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const useStyles = createThemedStyles(colors => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logo: {
    width: 48,
    height: 48,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
  },
  form: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
    minHeight: 44,
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  socialSection: {
    marginTop: 20,
    gap: 12,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 14,
    color: colors.textMuted,
  },
  socialButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  appleButton: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  appleButtonText: {
    color: '#ffffff',
  },
  toggleLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 14,
    color: colors.primary,
  },
}));
