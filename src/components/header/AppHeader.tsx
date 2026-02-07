import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import type { MenuItemConfig, LogoConfig } from '../../types';
import { useTheme } from '../../theme/ThemeContext';

export interface AppHeaderProps {
  /** Logo configuration */
  logo: LogoConfig;
  /** Menu items (shown as icon buttons on the right) */
  menuItems?: MenuItemConfig[];
  /** Optional left section (e.g., back button) */
  renderLeft?: () => React.ReactNode;
  /** Optional right section (e.g., profile icon, account button) */
  renderRight?: () => React.ReactNode;
  /** Custom style */
  style?: StyleProp<ViewStyle>;
}

export function AppHeader({
  logo,
  menuItems,
  renderLeft,
  renderRight,
  style,
}: AppHeaderProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.card, borderBottomColor: colors.border },
        style,
      ]}
    >
      <View style={styles.leftSection}>
        {renderLeft ? (
          renderLeft()
        ) : (
          <Pressable onPress={logo.onPress} style={styles.logoContainer}>
            {logo.source && (
              <Image
                source={logo.source}
                style={styles.logoImage}
                resizeMode='contain'
              />
            )}
            <Text style={[styles.appName, { color: colors.text }]}>
              {logo.appName}
            </Text>
          </Pressable>
        )}
      </View>

      <View style={styles.rightSection}>
        {menuItems
          ?.filter(item => item.show !== false)
          .map(item => {
            const IconComponent = item.icon;
            return (
              <Pressable
                key={item.id}
                onPress={item.onPress}
                style={styles.menuButton}
                accessibilityLabel={item.label}
              >
                <IconComponent size={22} color={colors.textSecondary} />
              </Pressable>
            );
          })}
        {renderRight?.()}
      </View>
    </View>
  );
}

/**
 * Create React Navigation screen options from header config.
 * Useful for integrating AppHeader into a navigation stack.
 */
export function createAppHeaderOptions(config: {
  logo: LogoConfig;
  menuItems?: MenuItemConfig[];
  renderRight?: () => React.ReactNode;
}) {
  return {
    headerTitle: () => (
      <View style={styles.logoContainer}>
        {config.logo.source && (
          <Image
            source={config.logo.source}
            style={styles.logoImage}
            resizeMode='contain'
          />
        )}
        <Text style={styles.headerTitle}>{config.logo.appName}</Text>
      </View>
    ),
    headerRight: config.renderRight
      ? () => <View style={styles.headerRightNav}>{config.renderRight!()}</View>
      : undefined,
  };
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoImage: {
    width: 28,
    height: 28,
  },
  appName: {
    fontSize: 18,
    fontWeight: '600',
  },
  menuButton: {
    padding: 8,
    borderRadius: 8,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerRightNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: 8,
  },
});
