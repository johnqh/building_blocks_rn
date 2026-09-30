/**
 * How the device is being held, and what that means for a layout: the
 * vocabulary and the rules, as pure functions. The hooks beside this file
 * feed them what the platform reports.
 *
 * **Orientation names the notch's side.** `landscapeLeft` is the phone held
 * with its top edge — the notch, the island, the camera cutout — on the
 * left; `landscapeRight` with it on the right. That is the fact a layout
 * needs (which edge to clear). UIKit's `UIInterfaceOrientationLandscapeLeft`
 * turns out to be the same side — measured on an iPhone, against its own
 * documentation's talk of home buttons, which reads the other way — so the
 * names agree, and the mapping from UIKit is here and nowhere else.
 *
 * **Size classes are iOS's.** `compact` and `regular`, per axis, as
 * `UITraitCollection` reports them; where nothing reports them they are
 * estimated from the window.
 */

export const ORIENTATIONS = [
  'portrait',
  'portraitUpsideDown',
  'landscapeLeft',
  'landscapeRight',
] as const;
export type Orientation = (typeof ORIENTATIONS)[number];

export const SIZE_CLASSES = ['compact', 'regular'] as const;
export type SizeClass = (typeof SIZE_CLASSES)[number];

export interface SizeClasses {
  horizontal: SizeClass;
  vertical: SizeClass;
}

export const NOTCH_POSITIONS = ['top', 'bottom', 'left', 'right'] as const;
/** Which edge the notch is at; `null` where the device has none. */
export type NotchPosition = (typeof NOTCH_POSITIONS)[number] | null;

export interface EdgeInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

/**
 * What the native side reports, where there is one (iOS).
 * UIKit's own numbering, translated by `orientationFromInterface`.
 */
export interface NativeDeviceLayout {
  /** `UIInterfaceOrientation`: 1 portrait, 2 upside down, 3 landscape left (home button left), 4 landscape right. */
  interfaceOrientation: number;
  /** `UIUserInterfaceSizeClass`: 1 compact, 2 regular; 0 unspecified. */
  horizontalSizeClass: number;
  verticalSizeClass: number;
}

/** UIKit's orientation, as the notch's side. */
export function orientationFromInterface(
  interfaceOrientation: number
): Orientation | null {
  switch (interfaceOrientation) {
    case 1:
      return 'portrait';
    case 2:
      return 'portraitUpsideDown';
    // Measured, not read off the docs: with `UIInterfaceOrientationLandscapeLeft`
    // the island is on the left, and a layout that padded the right there
    // was backwards on every iPhone.
    case 3:
      return 'landscapeLeft';
    case 4:
      return 'landscapeRight';
    default:
      return null;
  }
}

/**
 * The orientation from what every platform has: the window's shape, and
 * which edges the safe area clears.
 *
 * Android reports a cutout on the one side it is on, so the insets say
 * which way round a landscape phone is. iOS reports the same inset on both
 * sides in landscape, which is why iOS answers natively instead; asked
 * here with equal insets, this says `landscapeLeft`, and a caller that
 * needs better on iOS gets it from `orientationFromInterface`.
 */
export function orientationFromWindow(
  width: number,
  height: number,
  insets: EdgeInsets
): Orientation {
  if (width > height) {
    return insets.right > insets.left ? 'landscapeRight' : 'landscapeLeft';
  }
  return insets.bottom > insets.top && insets.top === 0
    ? 'portraitUpsideDown'
    : 'portrait';
}

/**
 * Where the notch is, from the orientation — and whether there is one at
 * all, from the insets.
 *
 * A phone with no notch has no side to clear, and a layout that cleared the
 * "notch side" of one would indent for nothing. Whether there is one is
 * read off the insets: in landscape the notch's side has an inset and a
 * plain edge has none; in portrait the notch pushes the top inset past the
 * status bar's own height, which `statusBarHeight` states — 20 on iOS,
 * and about 24 on Android, where the bar can be a little taller, so a
 * little more is asked for there.
 */
export function notchPositionFor(
  orientation: Orientation,
  insets: EdgeInsets,
  statusBarHeight: number
): NotchPosition {
  switch (orientation) {
    case 'landscapeLeft':
      return insets.left > 0 || insets.right > 0 ? 'left' : null;
    case 'landscapeRight':
      return insets.left > 0 || insets.right > 0 ? 'right' : null;
    case 'portraitUpsideDown':
      return insets.bottom > statusBarHeight ? 'bottom' : null;
    case 'portrait':
      return insets.top > statusBarHeight ? 'top' : null;
  }
}

/** UIKit's size class numbering, or `null` for unspecified. */
export function sizeClassFromInterface(sizeClass: number): SizeClass | null {
  if (sizeClass === 1) return 'compact';
  if (sizeClass === 2) return 'regular';
  return null;
}

/**
 * Size classes estimated from the window, where nothing reports them.
 *
 * The lines are where iOS draws its own, near enough: a phone is compact
 * across in portrait and, but for the largest, in landscape; a tablet is
 * regular both ways; a phone on its side is compact in height.
 */
export const REGULAR_WIDTH = 700;
export const REGULAR_HEIGHT = 500;

export function sizeClassesFromWindow(
  width: number,
  height: number
): SizeClasses {
  return {
    horizontal: width >= REGULAR_WIDTH ? 'regular' : 'compact',
    vertical: height >= REGULAR_HEIGHT ? 'regular' : 'compact',
  };
}
