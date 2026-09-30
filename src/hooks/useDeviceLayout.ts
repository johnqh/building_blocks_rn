/**
 * How the device is held, as three hooks: the orientation, the size classes
 * and where the notch is. Each answers the platform's own fact where there
 * is one — iOS reports orientation and size classes natively — and estimates
 * from the window and the safe area otherwise. See `device-layout.ts` for the
 * rules; this file only feeds them.
 */
import { useEffect, useState } from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  notchPositionFor,
  orientationFromInterface,
  orientationFromWindow,
  sizeClassFromInterface,
  sizeClassesFromWindow,
} from './device-layout';
import type {
  NativeDeviceLayout,
  NotchPosition,
  Orientation,
  SizeClasses,
} from './device-layout';
import {
  initialNativeDeviceLayout,
  subscribeNativeDeviceLayout,
} from '../native/DeviceLayout';

/** The status bar's own height, past which a top inset means a notch. */
const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? 28 : 20;

/** What iOS reports, kept current; `null` on every other platform. */
function useNativeDeviceLayout(): NativeDeviceLayout | null {
  const [layout, setLayout] = useState<NativeDeviceLayout | null>(
    initialNativeDeviceLayout
  );
  useEffect(() => subscribeNativeDeviceLayout(setLayout), []);
  return layout;
}

/**
 * Which way up the device is: `portrait`, `portraitUpsideDown`,
 * `landscapeLeft` (notch on the left) or `landscapeRight` (notch on the
 * right).
 */
export function useOrientation(): Orientation {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const native = useNativeDeviceLayout();
  const reported = native
    ? orientationFromInterface(native.interfaceOrientation)
    : null;
  return reported ?? orientationFromWindow(width, height, insets);
}

/** iOS's size classes, `compact` or `regular` per axis, on every platform. */
export function useSizeClasses(): SizeClasses {
  const { width, height } = useWindowDimensions();
  const native = useNativeDeviceLayout();
  const estimated = sizeClassesFromWindow(width, height);
  if (!native) return estimated;
  return {
    horizontal:
      sizeClassFromInterface(native.horizontalSizeClass) ??
      estimated.horizontal,
    vertical:
      sizeClassFromInterface(native.verticalSizeClass) ?? estimated.vertical,
  };
}

/** Which edge the notch is at as the device is held now, or `null` without one. */
export function useNotchPosition(): NotchPosition {
  const orientation = useOrientation();
  const insets = useSafeAreaInsets();
  return notchPositionFor(orientation, insets, STATUS_BAR_HEIGHT);
}
