/**
 * The iOS side of the device-layout hooks: `UIInterfaceOrientation` and the
 * window's size classes, from `DeviceLayoutModule` (`ios/`), with a change
 * event whenever either moves.
 *
 * iOS only, and read defensively: every other platform has no module here
 * and answers from the window instead (`device-layout.ts`). A consumer that
 * has not run `pod install` since this module arrived is treated the same
 * way — not as an error, since the window's answer is right for everything
 * but which side of an iPhone the notch is on.
 */
import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import type { NativeDeviceLayout } from '../hooks/device-layout';

interface DeviceLayoutModuleInterface {
  getConstants?: () => Partial<NativeDeviceLayout>;
  getLayout(): Promise<NativeDeviceLayout>;
  addListener(event: string): void;
  removeListeners(count: number): void;
}

export const DEVICE_LAYOUT_EVENT = 'deviceLayoutChanged';

function nativeModule(): DeviceLayoutModuleInterface | null {
  if (Platform.OS !== 'ios') return null;
  const module = (
    NativeModules as { DeviceLayoutModule?: DeviceLayoutModuleInterface }
  ).DeviceLayoutModule;
  return module ?? null;
}

/** What the module reported at start-up, or `null` without one. */
export function initialNativeDeviceLayout(): NativeDeviceLayout | null {
  const module = nativeModule();
  if (!module) return null;
  const constants =
    module.getConstants?.() ??
    (module as unknown as Partial<NativeDeviceLayout>);
  if (typeof constants.interfaceOrientation !== 'number') return null;
  return {
    interfaceOrientation: constants.interfaceOrientation,
    horizontalSizeClass: constants.horizontalSizeClass ?? 0,
    verticalSizeClass: constants.verticalSizeClass ?? 0,
  };
}

/**
 * Calls `listener` with each change the module reports, and once with the
 * current state as soon as it can be read. Returns the unsubscribe.
 */
export function subscribeNativeDeviceLayout(
  listener: (layout: NativeDeviceLayout) => void
): () => void {
  const module = nativeModule();
  if (!module) return () => undefined;
  const emitter = new NativeEventEmitter(
    module as unknown as ConstructorParameters<typeof NativeEventEmitter>[0]
  );
  const subscription = emitter.addListener(DEVICE_LAYOUT_EVENT, listener);
  let live = true;
  module
    .getLayout()
    .then(layout => {
      if (live) listener(layout);
    })
    .catch(() => undefined);
  return () => {
    live = false;
    subscription.remove();
  };
}
