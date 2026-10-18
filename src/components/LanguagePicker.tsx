import { Pressable, ScrollView, Text } from "react-native";

import { type SnippetLanguage } from "@/context/snippets";
import { useColors } from "@/hooks/useColors";

export const LANGUAGE_OPTIONS: Array<{
  value: SnippetLanguage;
  label: string;
}> = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "json", label: "JSON" },
  { value: "bash", label: "Bash" },
  { value: "plaintext", label: "Plain text" },
];

export function LanguagePicker({
  onChange,
  testIDPrefix = "language",
  value,
}: {
  onChange: (language: SnippetLanguage) => void;
  testIDPrefix?: string;
  value: SnippetLanguage;
}) {
  const colors = useColors();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2 pb-[26px]"
    >
      {LANGUAGE_OPTIONS.map((option) => {
        const isSelected = option.value === value;

        return (
          <Pressable
            key={option.value}
            accessibilityLabel={`Use ${option.label}`}
            accessibilityRole="button"
            onPress={() => onChange(option.value)}
            className="min-h-[38px] justify-center rounded-full border px-[14px]"
            style={{
              backgroundColor: isSelected ? colors.primary : colors.secondary,
              borderColor: isSelected ? colors.primary : colors.border,
            }}
            testID={`${testIDPrefix}-${option.value}`}
          >
            <Text
              className="text-[13px] font-semibold"
              style={{
                fontFamily: "Inter_600SemiBold",
                color: isSelected
                  ? colors.primaryForeground
                  : colors.secondaryForeground,
              }}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
