import { NativeModules, Platform } from 'react-native';

interface InAppReviewModuleInterface {
  isAvailable(): Promise<boolean>;
  requestReview(): Promise<boolean>;
}

const { InAppReviewModule } = NativeModules;

export async function isNativeDesktopReviewAvailable(): Promise<boolean> {
  if (Platform.OS !== 'macos' || !InAppReviewModule) {
    return false;
  }

  return (InAppReviewModule as InAppReviewModuleInterface).isAvailable();
}

export async function requestNativeDesktopReview(): Promise<boolean> {
  if (Platform.OS !== 'macos' || !InAppReviewModule) {
    return false;
  }

  return (InAppReviewModule as InAppReviewModuleInterface).requestReview();
}
