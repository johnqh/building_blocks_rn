import { describe, expect, it } from 'vitest';
import { getDeviceLocaleTags } from '../i18n/deviceLocale';

describe('getDeviceLocaleTags', () => {
  it('falls back to an empty list when the native module is unavailable', () => {
    expect(getDeviceLocaleTags()).toEqual([]);
  });
});
