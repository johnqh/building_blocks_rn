import AsyncStorage from '@react-native-async-storage/async-storage';
import InAppReview from 'react-native-in-app-review';
import { Platform } from 'react-native';
import {
  isNativeDesktopReviewAvailable,
  requestNativeDesktopReview,
} from '../native/InAppReview';

const DEFAULT_STORAGE_PREFIX = '@sudobility.review_prompt';
const DEFAULT_MIN_SUCCESS_COUNT = 3;
const DEFAULT_COOLDOWN_DAYS = 30;

export interface ReviewPromptOptions {
  storagePrefix?: string;
  minSuccessCount?: number;
  cooldownDays?: number;
}

export interface ReviewPromptResult {
  prompted: boolean;
  available: boolean;
  successCount: number;
}

function getStorageKeys(storagePrefix: string) {
  return {
    successCount: `${storagePrefix}.success_count`,
    lastPromptedAt: `${storagePrefix}.last_prompted_at`,
  };
}

async function isPackageReviewAvailable(): Promise<boolean> {
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
    return false;
  }

  try {
    return Boolean(InAppReview.isAvailable());
  } catch {
    return false;
  }
}

export async function isInAppReviewAvailable(): Promise<boolean> {
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    return isPackageReviewAvailable();
  }

  if (Platform.OS === 'macos') {
    return isNativeDesktopReviewAvailable();
  }

  return false;
}

export async function requestInAppReview(): Promise<boolean> {
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    if (!(await isPackageReviewAvailable())) {
      return false;
    }

    try {
      await InAppReview.RequestInAppReview();
      return true;
    } catch {
      return false;
    }
  }

  if (Platform.OS === 'macos') {
    return requestNativeDesktopReview();
  }

  return false;
}

export async function recordSuccessfulActionAndPromptForReview(
  options: ReviewPromptOptions = {}
): Promise<ReviewPromptResult> {
  const storagePrefix = options.storagePrefix ?? DEFAULT_STORAGE_PREFIX;
  const minSuccessCount = options.minSuccessCount ?? DEFAULT_MIN_SUCCESS_COUNT;
  const cooldownDays = options.cooldownDays ?? DEFAULT_COOLDOWN_DAYS;
  const cooldownMs = cooldownDays * 24 * 60 * 60 * 1000;
  const keys = getStorageKeys(storagePrefix);

  const storedCount = await AsyncStorage.getItem(keys.successCount);
  const successCount = (Number.parseInt(storedCount ?? '0', 10) || 0) + 1;
  await AsyncStorage.setItem(keys.successCount, String(successCount));

  const available = await isInAppReviewAvailable();
  if (!available || successCount < minSuccessCount) {
    return { prompted: false, available, successCount };
  }

  const lastPromptedAt = await AsyncStorage.getItem(keys.lastPromptedAt);
  if (lastPromptedAt) {
    const elapsedMs = Date.now() - Number.parseInt(lastPromptedAt, 10);
    if (Number.isFinite(elapsedMs) && elapsedMs < cooldownMs) {
      return { prompted: false, available, successCount };
    }
  }

  const prompted = await requestInAppReview();
  if (prompted) {
    await AsyncStorage.setItem(keys.lastPromptedAt, String(Date.now()));
  }

  return { prompted, available, successCount };
}
