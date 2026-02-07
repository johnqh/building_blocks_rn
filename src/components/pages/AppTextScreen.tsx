import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import type { TextPageContent, TextSection } from '../../types';
import { createThemedStyles } from '../../utils/styles';

export interface AppTextScreenProps {
  /** Structured text content (same data type as web) */
  text: TextPageContent;
  /** Last updated date override */
  lastUpdatedDate?: string;
  /** Optional screen wrapper component */
  ScreenWrapper?: React.ComponentType<{ children: React.ReactNode }>;
  /** Custom style */
  style?: StyleProp<ViewStyle>;
}

function TextSectionView({
  section,
  level = 2,
}: {
  section: TextSection;
  level?: number;
}) {
  const styles = useStyles();

  return (
    <View style={styles.section}>
      <Text style={level === 2 ? styles.sectionTitle : styles.subsectionTitle}>
        {section.title}
      </Text>

      {section.content && (
        <Text style={styles.sectionContent}>{section.content}</Text>
      )}

      {section.items && section.items.length > 0 && (
        <View style={styles.list}>
          {section.items.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bullet}>{'\u2022'}</Text>
              <Text style={styles.listItemText}>{item}</Text>
            </View>
          ))}
        </View>
      )}

      {section.subsections?.map((sub, index) => (
        <TextSectionView key={index} section={sub} level={3} />
      ))}
    </View>
  );
}

export function AppTextScreen({
  text,
  lastUpdatedDate,
  ScreenWrapper,
  style,
}: AppTextScreenProps) {
  const styles = useStyles();

  const lastUpdated = text.lastUpdated
    ? text.lastUpdated.replace('{{date}}', lastUpdatedDate ?? '')
    : lastUpdatedDate
      ? `Last updated: ${lastUpdatedDate}`
      : undefined;

  const content = (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{text.title}</Text>

      {lastUpdated && <Text style={styles.lastUpdated}>{lastUpdated}</Text>}

      {text.sections.map((section, index) => (
        <TextSectionView key={index} section={section} />
      ))}

      {text.contact && (
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>{text.contact.title}</Text>
          <Text style={styles.sectionContent}>{text.contact.description}</Text>
          <Text style={styles.contactInfo}>{text.contact.info}</Text>
          {text.contact.gdprNotice && (
            <Text style={styles.gdprNotice}>{text.contact.gdprNotice}</Text>
          )}
        </View>
      )}
    </View>
  );

  if (ScreenWrapper) {
    return <ScreenWrapper>{content}</ScreenWrapper>;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      {content}
    </ScrollView>
  );
}

const useStyles = createThemedStyles(colors => ({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  subsectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  sectionContent: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  list: {
    marginTop: 8,
    gap: 6,
  },
  listItem: {
    flexDirection: 'row',
    paddingLeft: 8,
  },
  bullet: {
    fontSize: 15,
    color: colors.textSecondary,
    marginRight: 8,
    lineHeight: 22,
  },
  listItemText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    flex: 1,
  },
  contactSection: {
    marginTop: 16,
    padding: 16,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 12,
  },
  contactInfo: {
    fontSize: 15,
    color: colors.primary,
    marginTop: 8,
  },
  gdprNotice: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 12,
    fontStyle: 'italic',
  },
}));
