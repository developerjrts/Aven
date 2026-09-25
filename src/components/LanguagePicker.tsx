import { Pressable, ScrollView, Text } from 'react-native';

import { type SnippetLanguage } from '@/context/notes';
import { useColors } from '@/hooks/useColors';
import { commonStyles } from '@/styles/common';

export const LANGUAGE_OPTIONS: Array<{
  value: SnippetLanguage;
  label: string;
}> = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'json', label: 'JSON' },
  { value: 'bash', label: 'Bash' },
  { value: 'plaintext', label: 'Plain text' },
];

export function LanguagePicker({
  onChange,
  testIDPrefix = 'language',
  value,
}: {
  onChange: (language: SnippetLanguage) => void;
  testIDPrefix?: string;
  value: SnippetLanguage;
}) {
  const colors = useColors();

  return (
    <ScrollView
      contentContainerStyle={commonStyles.languageOptions}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {LANGUAGE_OPTIONS.map((option) => {
        const isSelected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityLabel={`Use ${option.label}`}
            accessibilityRole="button"
            onPress={() => onChange(option.value)}
            style={[
              commonStyles.languageOption,
              {
                backgroundColor: isSelected
                  ? colors.primary
                  : colors.secondary,
                borderColor: isSelected ? colors.primary : colors.border,
              },
            ]}
            testID={`${testIDPrefix}-${option.value}`}
          >
            <Text
              style={[
                commonStyles.languageOptionText,
                {
                  color: isSelected
                    ? colors.primaryForeground
                    : colors.secondaryForeground,
                },
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}