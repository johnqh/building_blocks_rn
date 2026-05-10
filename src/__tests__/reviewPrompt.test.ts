import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('react-native-in-app-review', () => ({
  default: {
    isAvailable: vi.fn(() => true),
    RequestInAppReview: vi.fn(() => Promise.resolve()),
  },
}));

vi.mock('../native/InAppReview', () => ({
  isNativeDesktopReviewAvailable: vi.fn(() => Promise.resolve(true)),
  requestNativeDesktopReview: vi.fn(() => Promise.resolve(true)),
}));

import InAppReview from 'react-native-in-app-review';
import { recordSuccessfulActionAndPromptForReview } from '../review';

describe('recordSuccessfulActionAndPromptForReview', () => {
  beforeEach(async () => {
    Platform.OS = 'ios';
    vi.clearAllMocks();
    await AsyncStorage.clear();
  });

  it('prompts after the configured success threshold', async () => {
    const options = {
      storagePrefix: '@tests.review',
      minSuccessCount: 2,
      cooldownDays: 30,
    };

    const first = await recordSuccessfulActionAndPromptForReview(options);
    const second = await recordSuccessfulActionAndPromptForReview(options);

    expect(first.prompted).toBe(false);
    expect(second.prompted).toBe(true);
    expect(InAppReview.RequestInAppReview).toHaveBeenCalledTimes(1);
  });

  it('respects the cooldown after a successful prompt', async () => {
    const options = {
      storagePrefix: '@tests.review',
      minSuccessCount: 1,
      cooldownDays: 30,
    };

    const first = await recordSuccessfulActionAndPromptForReview(options);
    const second = await recordSuccessfulActionAndPromptForReview(options);

    expect(first.prompted).toBe(true);
    expect(second.prompted).toBe(false);
    expect(InAppReview.RequestInAppReview).toHaveBeenCalledTimes(1);
  });
});
