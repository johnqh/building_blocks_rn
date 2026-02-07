import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import type {
  SettingsSectionConfig,
  AnalyticsTrackingParams,
} from '../../types';
import { createThemedStyles } from '../../utils/styles';

export interface SettingsListScreenProps {
  /** Settings sections to display */
  sections: SettingsSectionConfig[];
  /** Called when a section is pressed */
  onSectionPress: (sectionId: string) => void;
  /** Title displayed at the top */
  title?: string;
  /** Custom style */
  style?: StyleProp<ViewStyle>;
  /** Analytics tracking */
  onTrack?: (params: AnalyticsTrackingParams) => void;
}

export function SettingsListScreen({
  sections,
  onSectionPress,
  title = 'Settings',
  style,
  onTrack,
}: SettingsListScreenProps) {
  const styles = useStyles();

  const handlePress = (section: SettingsSectionConfig) => {
    onTrack?.({
      eventType: 'navigation',
      componentName: 'SettingsListScreen',
      label: 'settings_section_tapped',
      params: { section_id: section.id },
    });
    onSectionPress(section.id);
  };

  return (
    <ScrollView
      style={[styles.container, style]}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>{title}</Text>

      <View style={styles.sectionList}>
        {sections.map((section, index) => {
          const IconComponent = section.icon;
          return (
            <Pressable
              key={section.id}
              style={[
                styles.sectionRow,
                index < sections.length - 1 && styles.sectionRowBorder,
              ]}
              onPress={() => handlePress(section)}
            >
              {IconComponent && (
                <View style={styles.iconContainer}>
                  <IconComponent size={20} color={styles.iconColor.color} />
                </View>
              )}
              <View style={styles.sectionInfo}>
                <Text style={styles.sectionLabel}>{section.label}</Text>
                {section.description && (
                  <Text style={styles.sectionDescription}>
                    {section.description}
                  </Text>
                )}
              </View>
              <Text style={styles.chevron}>{'\u203A'}</Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const useStyles = createThemedStyles(colors => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
  },
  sectionList: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    minHeight: 56,
  },
  sectionRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconColor: {
    color: colors.primary,
  },
  sectionInfo: {
    flex: 1,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  sectionDescription: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  chevron: {
    fontSize: 22,
    color: colors.textMuted,
    marginLeft: 8,
  },
}));
