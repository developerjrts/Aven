import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { Platform, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Card } from "@/components/Card";
import { CodeBlock } from "@/components/CodeBlock";
import { Typography } from "@/components/Typography";
import { type Snippet, useSnippets } from "@/context/snippets";
import { useColors } from "@/hooks/useColors";

export const LANGUAGE_LABELS: Record<Snippet["language"], string> = {
  bash: "Bash",
  javascript: "JavaScript",
  json: "JSON",
  plaintext: "Plain text",
  python: "Python",
  typescript: "TypeScript",
};

export default function SnippetsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { snippets } = useSnippets();

  const orderedSnippets = useMemo(
    () =>
      [...snippets].sort(
        (firstSnippet, secondSnippet) =>
          Number(secondSnippet.pinned) - Number(firstSnippet.pinned),
      ),
    [snippets],
  );

  const openSnippet = (id: string) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    router.push({
      pathname: "/view-snippet",
      params: { id },
    });
  };

  const openNewSnippet = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/new-snippet");
  };

  return (
    <View
      className="flex-1 px-6"
      style={{
        backgroundColor: colors.background,
        paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0),
        paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 0),
      }}
    >
      <View className="pt-[14px]">
        <Typography variant="display">Snippets</Typography>

        <View
          className="mt-[10px] h-[3px] w-7 rounded-sm"
          style={{ backgroundColor: colors.accent }}
        />
      </View>

      {orderedSnippets.length === 0 ? (
        <View className="flex-1 items-center justify-center pb-12">
          <View
            className="mb-[18px] h-[68px] w-[68px] items-center justify-center rounded-[22px] border"
            style={{
              backgroundColor: colors.secondary,
              borderColor: colors.border,
            }}
          >
            <Feather name="code" size={28} color={colors.primary} />
          </View>

          <Typography variant="heading">No snippets yet</Typography>

          <Typography
            color="mutedForeground"
            variant="caption"
            className="mt-2 text-center"
          >
            Save useful code for later.
          </Typography>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingTop: 30,
            paddingBottom: 150,
            gap: 12,
          }}
          showsVerticalScrollIndicator={false}
        >
          {orderedSnippets.map((snippet) => {
            const languageLabel =
              LANGUAGE_LABELS[snippet.language] ?? snippet.language;

            return (
              <Card
                key={snippet.id}
                accessibilityLabel={`Edit ${snippet.title}`}
                onPress={() => openSnippet(snippet.id)}
                testID={`edit-snippet-${snippet.id}`}
              >
                <View className="flex-row items-center gap-[10px]">
                  <Typography
                    numberOfLines={1}
                    className="flex-1"
                    style={{ fontFamily: "Inter_600SemiBold" }}
                  >
                    {snippet.title}
                  </Typography>

                  {snippet.pinned && (
                    <Feather name="bookmark" size={17} color={colors.primary} />
                  )}
                </View>

                <Text
                  className="mt-2 text-xs uppercase tracking-[0.4px]"
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    color: colors.primary,
                  }}
                >
                  {languageLabel}
                </Text>

                <CodeBlock
                  code={snippet.code}
                  language={snippet.language}
                  languageLabel={languageLabel}
                  numberOfLines={6}
                />
              </Card>
            );
          })}
        </ScrollView>
      )}

      <Pressable
        accessibilityLabel="Add a new snippet"
        accessibilityRole="button"
        onPress={openNewSnippet}
        className="absolute right-6 bottom-[84px] h-[58px] w-[58px] items-center justify-center rounded-full active:opacity-[0.78] active:scale-[0.95]"
        style={{
          backgroundColor: colors.primary,
          elevation: 5,
        }}
        testID="new-snippet-button"
      >
        <Feather name="plus" size={28} color={colors.primaryForeground} />
      </Pressable>
    </View>
  );
}
