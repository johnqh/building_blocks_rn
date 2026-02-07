import React from 'react';
import { View, ScrollView } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createThemedStyles } from '../../utils/styles';

export interface AppScreenLayoutProps {
  children: React.ReactNode;
  /** Optional header component (rendered above scroll content) */
  header?: React.ReactNode;
  /** Optional footer component (rendered below scroll content) */
  footer?: React.ReactNode;
  /** Whether to wrap content in a ScrollView (default: true) */
  scrollable?: boolean;
  /** Content padding */
  contentPadding?: 'none' | 'sm' | 'md' | 'lg';
  /** Background variant */
  background?: 'default' | 'white';
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
  /** Custom content style */
  contentStyle?: StyleProp<ViewStyle>;
}

const paddingMap = {
  none: 0,
  sm: 8,
  md: 16,
  lg: 24,
};

export function AppScreenLayout({
  children,
  header,
  footer,
  scrollable = true,
  contentPadding = 'md',
  background = 'default',
  style,
  contentStyle,
}: AppScreenLayoutProps) {
  const styles = useStyles();

  const backgroundStyle = background === 'white' ? styles.bgWhite : styles.bgDefault;
  const padding = paddingMap[contentPadding];

  const content = (
    <View style={[{ paddingHorizontal: padding, flex: scrollable ? undefined : 1 }, contentStyle]}>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, backgroundStyle, style]} edges={['top', 'left', 'right']}>
      {header}
      {scrollable ? (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {content}
        </ScrollView>
      ) : (
        <View style={styles.fixedContent}>{content}</View>
      )}
      {footer}
    </SafeAreaView>
  );
}

const useStyles = createThemedStyles((colors) => ({
  container: {
    flex: 1,
  },
  bgDefault: {
    backgroundColor: colors.background,
  },
  bgWhite: {
    backgroundColor: colors.card,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  fixedContent: {
    flex: 1,
  },
}));
