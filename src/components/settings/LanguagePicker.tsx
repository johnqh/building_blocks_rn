import React, { useState } from 'react';
import { View, Text, Pressable, Modal, FlatList, SafeAreaView } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import type { LanguageConfig } from '../../constants/languages';
import { DEFAULT_LANGUAGES } from '../../constants/languages';
import { createThemedStyles } from '../../utils/styles';

export interface LanguagePickerProps {
  /** Available languages (default: DEFAULT_LANGUAGES) */
  languages?: LanguageConfig[];
  /** Currently selected language code */
  currentLanguage?: string;
  /** Called when a language is selected */
  onLanguageChange?: (languageCode: string) => void;
  /** Label displayed above the picker */
  label?: string;
  /** Custom style */
  style?: StyleProp<ViewStyle>;
}

export function LanguagePicker({
  languages = DEFAULT_LANGUAGES,
  currentLanguage = 'en',
  onLanguageChange,
  label,
  style,
}: LanguagePickerProps) {
  const styles = useStyles();
  const [modalVisible, setModalVisible] = useState(false);

  const currentLang = languages.find((l) => l.code === currentLanguage);

  const handleSelect = (code: string) => {
    onLanguageChange?.(code);
    setModalVisible(false);
  };

  return (
    <View style={style}>
      {label && <Text style={styles.label}>{label}</Text>}

      <Pressable style={styles.trigger} onPress={() => setModalVisible(true)}>
        <Text style={styles.triggerText}>
          {currentLang ? `${currentLang.flag} ${currentLang.name}` : currentLanguage}
        </Text>
        <Text style={styles.chevron}>{'\u25BC'}</Text>
      </Pressable>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{label ?? 'Select Language'}</Text>
            <Pressable onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButton}>Done</Text>
            </Pressable>
          </View>

          <FlatList
            data={languages}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <Pressable
                style={[
                  styles.languageRow,
                  item.code === currentLanguage && styles.languageRowActive,
                ]}
                onPress={() => handleSelect(item.code)}
              >
                <Text style={styles.flag}>{item.flag}</Text>
                <Text style={styles.languageName}>{item.name}</Text>
                {item.code === currentLanguage && (
                  <Text style={styles.checkmark}>{'\u2713'}</Text>
                )}
              </Pressable>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const useStyles = createThemedStyles((colors) => ({
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 44,
  },
  triggerText: {
    fontSize: 16,
    color: colors.text,
  },
  chevron: {
    fontSize: 10,
    color: colors.textMuted,
  },
  modal: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 48,
  },
  languageRowActive: {
    backgroundColor: colors.surfaceSecondary,
  },
  flag: {
    fontSize: 20,
    marginRight: 12,
  },
  languageName: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  checkmark: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 48,
  },
}));
