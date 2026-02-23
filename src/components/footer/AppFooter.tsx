/**
 * @fileoverview App footer component for React Native.
 *
 * Displays a copyright line with company name/link, version string, and
 * configurable rights text. Below the copyright, it renders a row of
 * footer links (e.g., Privacy, Terms) with dot separators. Links can use
 * `url` (Linking.openURL), `routeName`, or `onPress`. Analytics tracking
 * for link clicks is supported via the `onTrack` prop.
 */
import React from 'react';
import { View, Text, Pressable, Linking } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import type { FooterLinkItem, AnalyticsTrackingParams } from '../../types';
import { createThemedStyles } from '../../utils/styles';

export interface AppFooterProps {
  /** App version string */
  version?: string;
  /** Copyright year */
  copyrightYear?: string;
  /** Company name */
  companyName: string;
  /** Company URL (opened via Linking) */
  companyUrl?: string;
  /** Rights text (default: "All rights reserved.") */
  rightsText?: string;
  /** Footer links (Privacy, Terms, etc.) */
  links?: FooterLinkItem[];
  /** Custom style */
  style?: StyleProp<ViewStyle>;
  /** Analytics tracking */
  onTrack?: (params: AnalyticsTrackingParams) => void;
}

export function AppFooter({
  version,
  copyrightYear,
  companyName,
  companyUrl,
  rightsText = 'All rights reserved.',
  links,
  style,
  onTrack,
}: AppFooterProps) {
  const styles = useStyles();

  const handleLinkPress = (link: FooterLinkItem) => {
    onTrack?.({
      eventType: 'link_click',
      componentName: 'AppFooter',
      label: 'footer_link_clicked',
      params: { link_label: link.label },
    });

    if (link.onPress) {
      link.onPress();
    } else if (link.url) {
      Linking.openURL(link.url);
    }
  };

  const handleCompanyPress = () => {
    if (companyUrl) {
      Linking.openURL(companyUrl);
    }
  };

  return (
    <View style={[styles.container, style]} accessibilityLabel='App footer'>
      <View style={styles.topRow}>
        {version && <Text style={styles.versionText}>v{version}</Text>}
        <Text style={styles.copyrightText}>
          {copyrightYear ? `\u00A9 ${copyrightYear} ` : ''}
          {companyUrl ? (
            <Text
              style={styles.companyLink}
              onPress={handleCompanyPress}
              accessibilityRole='link'
              accessibilityLabel={`${companyName} website`}
            >
              {companyName}
            </Text>
          ) : (
            companyName
          )}
          {'. '}
          {rightsText}
        </Text>
      </View>

      {links && links.length > 0 && (
        <View style={styles.linksRow} accessibilityRole='list'>
          {links.map((link, index) => (
            <React.Fragment key={link.label}>
              {index > 0 && <Text style={styles.separator}>{'\u00B7'}</Text>}
              <Pressable
                onPress={() => handleLinkPress(link)}
                accessibilityRole='link'
                accessibilityLabel={link.label}
              >
                <Text style={styles.linkText}>{link.label}</Text>
              </Pressable>
            </React.Fragment>
          ))}
        </View>
      )}
    </View>
  );
}

const useStyles = createThemedStyles(colors => ({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  versionText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  copyrightText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  companyLink: {
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  linksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    gap: 8,
    flexWrap: 'wrap',
  },
  separator: {
    color: colors.textMuted,
    fontSize: 12,
  },
  linkText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
}));
