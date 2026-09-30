import { describe, expect, it } from 'vitest';
import {
  notchPositionFor,
  orientationFromInterface,
  orientationFromWindow,
  sizeClassFromInterface,
  sizeClassesFromWindow,
} from '../hooks/device-layout';

const insets = (
  patch: Partial<Record<'top' | 'bottom' | 'left' | 'right', number>>
) => ({
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  ...patch,
});

describe('orientation from UIKit', () => {
  it('names the side the notch is on', () => {
    expect(orientationFromInterface(1)).toBe('portrait');
    expect(orientationFromInterface(2)).toBe('portraitUpsideDown');
    // UIInterfaceOrientationLandscapeLeft: the island on the left. Measured
    // on an iPhone; the mapping the other way padded the wrong side.
    expect(orientationFromInterface(3)).toBe('landscapeLeft');
    expect(orientationFromInterface(4)).toBe('landscapeRight');
    expect(orientationFromInterface(0)).toBeNull();
  });
});

describe('orientation from the window', () => {
  it('reads a landscape phone from which side the cutout insets', () => {
    expect(orientationFromWindow(900, 400, insets({ left: 54 }))).toBe(
      'landscapeLeft'
    );
    expect(orientationFromWindow(900, 400, insets({ right: 54 }))).toBe(
      'landscapeRight'
    );
  });

  it('says landscapeLeft when the insets cannot tell', () => {
    expect(
      orientationFromWindow(900, 400, insets({ left: 44, right: 44 }))
    ).toBe('landscapeLeft');
  });

  it('reads portrait from the window being taller than wide', () => {
    expect(orientationFromWindow(400, 900, insets({ top: 47 }))).toBe(
      'portrait'
    );
    expect(orientationFromWindow(400, 900, insets({ bottom: 47 }))).toBe(
      'portraitUpsideDown'
    );
  });
});

describe('where the notch is', () => {
  it('is the side the phone is held with its top to', () => {
    expect(notchPositionFor('landscapeLeft', insets({ left: 54 }), 20)).toBe(
      'left'
    );
    expect(
      notchPositionFor('landscapeRight', insets({ left: 44, right: 44 }), 20)
    ).toBe('right');
    expect(notchPositionFor('portrait', insets({ top: 59 }), 20)).toBe('top');
    expect(
      notchPositionFor('portraitUpsideDown', insets({ bottom: 59 }), 20)
    ).toBe('bottom');
  });

  it('is nowhere on a device without one', () => {
    expect(notchPositionFor('landscapeLeft', insets({}), 20)).toBeNull();
    // A status bar alone is not a notch.
    expect(notchPositionFor('portrait', insets({ top: 20 }), 20)).toBeNull();
    expect(notchPositionFor('portrait', insets({ top: 24 }), 28)).toBeNull();
  });
});

describe('size classes', () => {
  it('reads UIKit’s numbering', () => {
    expect(sizeClassFromInterface(1)).toBe('compact');
    expect(sizeClassFromInterface(2)).toBe('regular');
    expect(sizeClassFromInterface(0)).toBeNull();
  });

  it('estimates from the window where nothing reports them', () => {
    // A phone upright, a phone on its side, a tablet.
    expect(sizeClassesFromWindow(390, 844)).toEqual({
      horizontal: 'compact',
      vertical: 'regular',
    });
    expect(sizeClassesFromWindow(844, 390)).toEqual({
      horizontal: 'regular',
      vertical: 'compact',
    });
    expect(sizeClassesFromWindow(1024, 768)).toEqual({
      horizontal: 'regular',
      vertical: 'regular',
    });
  });
});
