import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { SyntaxHighlightedCode } from "@/components/SyntaxHighlightedCode";
import { type SnippetLanguage } from "@/context/snippets";
import { useColors } from "@/hooks/useColors";

interface CodeBlockProps {
  code: string;
  language: SnippetLanguage;
  numberOfLines?: number;
  languageLabel?: string;
  onCopy?: () => void;
}

export function CodeBlock({
  code,
  language,
  numberOfLines,
  languageLabel,
  onCopy,
}: CodeBlockProps) {
  const colors = useColors();

  return (
    <View
      className="overflow-hidden rounded-[10px] border"
      style={{
        backgroundColor: colors.secondary,
        borderColor: colors.border,
        width: "100%",
        minWidth: 0,
      }}
    >
      <View
        className="min-h-[34px] flex-row items-center justify-between border-b px-3"
        style={{
          backgroundColor: colors.secondary,
          borderBottomColor: colors.border,
        }}
      >
        <View className="flex-row items-center gap-[7px]">
          <View
            className="h-[6px] w-[6px] rounded-full"
            style={{ backgroundColor: colors.primary }}
          />

          <Text
            className="text-[11px] uppercase"
            style={{
              fontFamily: "Inter_500Medium",
              color: colors.mutedForeground,
              letterSpacing: 0.4,
            }}
          >
            {languageLabel ?? language}
          </Text>
        </View>

        {onCopy && (
          <Pressable
            accessibilityLabel="Copy code"
            accessibilityRole="button"
            hitSlop={8}
            onPress={onCopy}
            className="h-7 w-7 items-center justify-center rounded-md active:opacity-50"
          >
            <Feather name="copy" size={15} color={colors.mutedForeground} />
          </Pressable>
        )}
      </View>

      <SyntaxHighlightedCode
        code={code}
        language={language}
        numberOfLines={numberOfLines}
      />
    </View>
  );
}
