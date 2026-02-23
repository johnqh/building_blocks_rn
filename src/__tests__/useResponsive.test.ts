/**
 * @fileoverview Tests for useResponsive hook.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from './test-utils';
import { useResponsive } from '../hooks/useResponsive';
import { __setWindowDimensions } from 'react-native';

describe('useResponsive', () => {
  beforeEach(() => {
    // Reset to default dimensions
    __setWindowDimensions({ width: 400, height: 800 });
  });

  it('should detect small screen (width < 380)', async () => {
    __setWindowDimensions({ width: 320, height: 568 });

    const { result } = await renderHook(() => useResponsive());

    expect(result.current.width).toBe(320);
    expect(result.current.height).toBe(568);
    expect(result.current.isSmall).toBe(true);
    expect(result.current.isMedium).toBe(false);
    expect(result.current.isLarge).toBe(false);
  });

  it('should detect medium screen (380-768)', async () => {
    __setWindowDimensions({ width: 400, height: 800 });

    const { result } = await renderHook(() => useResponsive());

    expect(result.current.isSmall).toBe(false);
    expect(result.current.isMedium).toBe(true);
    expect(result.current.isLarge).toBe(false);
  });

  it('should detect large screen (width > 768)', async () => {
    __setWindowDimensions({ width: 1024, height: 768 });

    const { result } = await renderHook(() => useResponsive());

    expect(result.current.isSmall).toBe(false);
    expect(result.current.isMedium).toBe(false);
    expect(result.current.isLarge).toBe(true);
  });

  it('should detect boundary at 380 as medium', async () => {
    __setWindowDimensions({ width: 380, height: 800 });

    const { result } = await renderHook(() => useResponsive());

    expect(result.current.isSmall).toBe(false);
    expect(result.current.isMedium).toBe(true);
    expect(result.current.isLarge).toBe(false);
  });

  it('should detect boundary at 768 as medium', async () => {
    __setWindowDimensions({ width: 768, height: 1024 });

    const { result } = await renderHook(() => useResponsive());

    expect(result.current.isSmall).toBe(false);
    expect(result.current.isMedium).toBe(true);
    expect(result.current.isLarge).toBe(false);
  });
});
