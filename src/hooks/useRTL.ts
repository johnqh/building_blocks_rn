import { useMemo } from 'react';
import { I18nManager, type TextStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { isRTL as isRTLLanguage } from '../constants/languages';

/**
 * Returns whether the current language is RTL.
 * Checks both I18nManager (native layout) and the current i18n language
 * (covers the session before a restart applies forceRTL).
 */
export function useIsRTL(): boolean {
  const { i18n } = useTranslation();
  return I18nManager.isRTL || isRTLLanguage(i18n.language);
}

/**
 * Returns a text style object that sets the correct text alignment
 * for the current language direction.
 */
export function useRTLTextStyle(): TextStyle {
  const isRTL = useIsRTL();
  return useMemo(
    () => ({
      textAlign: isRTL ? 'right' : 'left',
      writingDirection: isRTL ? 'rtl' : 'ltr',
    }),
    [isRTL]
  );
}
