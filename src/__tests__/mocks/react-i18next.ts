/**
 * Mock implementation of react-i18next.
 */
import React from 'react';

export const I18nextProvider = (props: Record<string, unknown>) =>
  React.createElement(
    'I18nextProvider',
    null,
    props.children as React.ReactNode
  );

export const useTranslation = () => ({
  t: (key: string) => key,
  i18n: {
    language: 'en',
    changeLanguage: () => Promise.resolve(),
  },
});

export const initReactI18next = {
  type: '3rdParty',
  init: () => {},
};
