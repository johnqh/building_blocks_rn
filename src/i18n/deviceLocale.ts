/**
 * Return the device's preferred locale tags in priority order.
 * `react-native-localize` is an optional peer so apps can use the shared i18n
 * helpers without requiring the native module in every environment.
 */
export function getDeviceLocaleTags(): string[] {
  try {
    const localize = require('react-native-localize');
    const locales = localize.getLocales();
    return locales.map((locale: { languageTag: string }) => locale.languageTag);
  } catch {
    return [];
  }
}
