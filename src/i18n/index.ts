/**
 * React Native i18n initialization.
 *
 * Uses react-native-localize for device language detection
 * and bundled translations (no HTTP backend).
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const DEFAULT_SUPPORTED_LANGUAGES = ['en'];

const DEFAULT_NAMESPACES = [
  'common',
  'home',
  'settings',
  'auth',
  'privacy',
  'terms',
];

/**
 * Detect device language using react-native-localize (if available).
 */
function detectDeviceLanguage(supportedLanguages: string[]): string {
  try {
    // Try react-native-localize if available
    const RNLocalize = require('react-native-localize');
    const locales = RNLocalize.getLocales();
    if (locales && locales.length > 0) {
      const deviceLang = locales[0].languageCode;
      if (supportedLanguages.includes(deviceLang)) {
        return deviceLang;
      }
    }
  } catch {
    // react-native-localize not installed, fall back to 'en'
  }
  return 'en';
}

export interface I18nConfig {
  /** Supported language codes. Defaults to ["en"]. */
  supportedLanguages?: string[];
  /** Translation namespaces. */
  namespaces?: string[];
  /** Default namespace. Defaults to "common". */
  defaultNamespace?: string;
  /** Bundled translation resources. */
  resources?: Record<string, Record<string, Record<string, string>>>;
  /** Enable debug logging. Defaults to false. */
  debug?: boolean;
}

let initialized = false;

/**
 * Initialize the i18n instance for React Native.
 * Safe to call multiple times - only initializes once.
 */
export function initializeI18nRN(config: I18nConfig = {}): typeof i18n {
  if (initialized) {
    return i18n;
  }
  initialized = true;

  const {
    supportedLanguages = DEFAULT_SUPPORTED_LANGUAGES,
    namespaces = DEFAULT_NAMESPACES,
    defaultNamespace = 'common',
    resources,
    debug = false,
  } = config;

  i18n.use(initReactI18next).init({
    lng: detectDeviceLanguage(supportedLanguages),
    fallbackLng: {
      zh: ['zh', 'en'],
      'zh-hant': ['zh-hant', 'zh', 'en'],
      default: ['en'],
    },
    supportedLngs: supportedLanguages,
    debug,
    interpolation: {
      escapeValue: false,
    },
    resources,
    defaultNS: defaultNamespace,
    ns: namespaces,
  });

  return i18n;
}

/**
 * Get the i18n instance.
 * Initializes with defaults if not already initialized.
 */
export function getI18n(): typeof i18n {
  if (!initialized) {
    initializeI18nRN();
  }
  return i18n;
}

export { i18n };
export default i18n;
