/**
 * Mock implementation of react-native-safe-area-context.
 */
import React from 'react';

export const SafeAreaProvider = (props: Record<string, unknown>) =>
  React.createElement(
    'SafeAreaProvider',
    null,
    props.children as React.ReactNode
  );

export const SafeAreaView = (props: Record<string, unknown>) =>
  React.createElement('SafeAreaView', props, props.children as React.ReactNode);

export const useSafeAreaInsets = () => ({
  top: 44,
  bottom: 34,
  left: 0,
  right: 0,
});
