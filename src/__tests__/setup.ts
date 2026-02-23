/**
 * @fileoverview Vitest setup file.
 *
 * Most mocks are handled via Vitest aliases in vitest.config.ts
 * to avoid Flow/TypeScript parsing issues with react-native.
 * This file only needs to mock modules that don't have alias entries.
 */
import { vi } from 'vitest';

// Mock i18next
vi.mock('i18next', () => {
  const i18nMock = {
    use: vi.fn().mockReturnThis(),
    init: vi.fn().mockResolvedValue(undefined),
    t: (key: string) => key,
    language: 'en',
    changeLanguage: vi.fn(),
  };
  return {
    default: i18nMock,
    ...i18nMock,
  };
});

// Mock react-native-localize
vi.mock('react-native-localize', () => ({
  getLocales: () => [
    { languageCode: 'en', countryCode: 'US', languageTag: 'en-US' },
  ],
}));
