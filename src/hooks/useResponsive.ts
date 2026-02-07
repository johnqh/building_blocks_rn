import { useWindowDimensions } from 'react-native';

export interface ResponsiveInfo {
  width: number;
  height: number;
  isSmall: boolean; // < 380
  isMedium: boolean; // 380-768
  isLarge: boolean; // > 768 (tablet)
}

/**
 * Hook for responsive breakpoint detection.
 */
export function useResponsive(): ResponsiveInfo {
  const { width, height } = useWindowDimensions();
  return {
    width,
    height,
    isSmall: width < 380,
    isMedium: width >= 380 && width <= 768,
    isLarge: width > 768,
  };
}
