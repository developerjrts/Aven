import { Pressable, ScrollView, Text } from "react-native";

import { type SnippetLanguage } from "@/context/notes";
import { useColors } from "@/hooks/useColors";

export const LANGUAGE_OPTIONS: Array<{
  value: SnippetLanguage;
  label: string;
}> = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "jsx", label: "JSX" },
  { value: "tsx", label: "TSX" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "kotlin", label: "Kotlin" },
  { value: "c", label: "C" },
  { value: "cpp", label: "C++" },
  { value: "csharp", label: "C#" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
  { value: "swift", label: "Swift" },
  { value: "dart", label: "Dart" },
  { value: "sql", label: "SQL" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
  { value: "yaml", label: "YAML" },
  { value: "markdown", label: "Markdown" },
  { value: "bash", label: "Bash" },
  { value: "shell", label: "Shell" },
  { value: "toml", label: "TOML" },
  { value: "xml", label: "XML" },
  { value: "graphql", label: "GraphQL" },
  { value: "dockerfile", label: "Dockerfile" },
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
