import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Platform, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Card } from "@/components/Card";
import { CodeBlock } from "@/components/CodeBlock";
import { Typography } from "@/components/Typography";
import { type Snippet, useSnippets } from "@/context/snippets";
import { useColors } from "@/hooks/useColors";

const LANGUAGE_LABELS: Record<Snippet["language"], string> = {
  bash: "Bash",
  javascript: "JavaScript",
  json: "JSON",
  plaintext: "Plain text",
  python: "Python",
  typescript: "TypeScript",
};

export default function ViewSnippet() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { id } = useLocalSearchParams<{ id: string }>();
  const { snippets } = useSnippets();

  const [copied, setCopied] = useState(false);

  const snippet = useMemo(
    () => snippets.find((item) => item.id === id),
    [snippets, id],
  );

  useEffect(() => {
    if (!copied) return;

    const timeout = setTimeout(() => setCopied(false), 1500);

    return () => clearTimeout(timeout);
  }, [copied]);

  const goBack = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  }, [router]);

  const openEdit = useCallback(() => {
    if (!snippet) return;

    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    router.push({
      pathname: "/edit-snippet",
      params: { id: snippet.id },
    });
  }, [router, snippet]);

  const copySnippet = useCallback(async () => {
    if (!snippet) return;

    try {
      await Clipboard.setStringAsync(snippet.code);
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }, [snippet]);

  const safeAreaStyle = {
    backgroundColor: colors.background,
    paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0),
    paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 0),
  };

  const iconButtonStyle = {
    borderColor: colors.border,
    backgroundColor: colors.secondary,
  };

  if (!snippet) {
    return (
      <View className="flex-1 px-6" style={safeAreaStyle}>
        <View className="flex-row items-center justify-between pb-[22px] pt-[14px]">
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            onPress={goBack}
            className="h-10 w-10 items-center justify-center rounded-[10px] border active:opacity-70 active:scale-[0.96]"
            style={iconButtonStyle}
          >
            <Feather name="arrow-left" size={20} color={colors.foreground} />
          </Pressable>
        </View>

        <View className="flex-1 items-center justify-center pb-20">
          <View
            className="mb-[18px] h-16 w-16 items-center justify-center rounded-2xl border"
            style={{
              backgroundColor: colors.secondary,
              borderColor: colors.border,
            }}
          >
            <Feather name="code" size={28} color={colors.primary} />
          </View>

          <Typography variant="heading">Snippet not found</Typography>

          <Typography
            color="mutedForeground"
            variant="caption"
            className="mt-2 text-center"
          >
            This snippet may have been deleted.
          </Typography>
        </View>
      </View>
    );
  }

  const languageLabel = LANGUAGE_LABELS[snippet.language];

  return (
    <View className="flex-1 px-6" style={safeAreaStyle}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="flex-row items-center justify-between pb-[22px] pt-[14px]">
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            onPress={goBack}
            className="h-10 w-10 items-center justify-center rounded-[10px] border active:opacity-70 active:scale-[0.96]"
            style={iconButtonStyle}
          >
            <Feather name="arrow-left" size={20} color={colors.foreground} />
          </Pressable>

          <View className="flex-1 items-center">
            <Typography variant="heading">Snippet</Typography>
            <View
              className="mt-[7px] h-[3px] w-6 rounded-sm"
              style={{ backgroundColor: colors.accent }}
            />
          </View>

          <Pressable
            accessibilityLabel="Edit snippet"
            accessibilityRole="button"
            onPress={openEdit}
            className="h-10 flex-row items-center justify-center gap-[6px] rounded-[10px] border px-3 active:opacity-70 active:scale-[0.96]"
            style={iconButtonStyle}
          >
            <Feather name="edit-2" size={16} color={colors.primary} />
            <Text
              className="text-xs"
              style={{
                fontFamily: "Inter_600SemiBold",
                color: colors.primary,
              }}
            >
              Edit
            </Text>
          </Pressable>
        </View>

        <View className="pb-[22px]">
          <View className="flex-row items-start justify-between gap-3">
            <Typography variant="display" numberOfLines={3} className="flex-1">
              {snippet.title}
            </Typography>

            {snippet.pinned && (
              <View
                className="flex-row items-center gap-[5px] rounded-lg border px-2 py-[6px]"
                style={{
                  backgroundColor: colors.secondary,
                  borderColor: colors.border,
                }}
              >
                <Feather name="bookmark" size={15} color={colors.primary} />
                <Text
                  className="text-[10px]"
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    color: colors.primary,
                  }}
                >
                  Pinned
                </Text>
              </View>
            )}
          </View>

          <Text
            className="mt-[9px] text-[11px] uppercase tracking-[0.6px]"
            style={{
              fontFamily: "Inter_600SemiBold",
              color: colors.primary,
            }}
          >
            {languageLabel}
          </Text>
        </View>

        <Card>
          <View className="mb-3 flex-row items-center justify-between">
            <View className="flex-row items-center gap-[7px]">
              <Feather name="terminal" size={16} color={colors.primary} />
              <Text
                className="text-xs"
                style={{
                  fontFamily: "Inter_600SemiBold",
                  color: colors.foreground,
                }}
              >
                {languageLabel}
              </Text>
            </View>

            <Pressable
              accessibilityLabel={copied ? "Snippet copied" : "Copy snippet"}
              accessibilityRole="button"
              onPress={copySnippet}
              className="flex-row items-center gap-[6px] rounded-lg border px-[10px] py-[7px] active:opacity-70 active:scale-[0.96]"
              style={iconButtonStyle}
            >
              <Feather
                name={copied ? "check" : "copy"}
                size={15}
                color={copied ? colors.primary : colors.foreground}
              />
              <Text
                className="text-[11px]"
                style={{
                  fontFamily: "Inter_600SemiBold",
                  color: copied ? colors.primary : colors.foreground,
                }}
              >
                {copied ? "Copied" : "Copy"}
              </Text>
            </Pressable>
          </View>

          <CodeBlock
            code={snippet.code}
            language={snippet.language}
            languageLabel={languageLabel}
          />
        </Card>

        <View
          className="mt-[14px] rounded-[14px] border px-[14px]"
          style={{
            backgroundColor: colors.secondary,
            borderColor: colors.border,
          }}
        >
          <View className="min-h-12 flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Feather name="code" size={15} color={colors.mutedForeground} />
              <Text
                className="text-xs"
                style={{
                  fontFamily: "Inter_500Medium",
                  color: colors.mutedForeground,
                }}
              >
                Language
              </Text>
            </View>

            <Text
              className="text-xs"
              style={{
                fontFamily: "Inter_600SemiBold",
                color: colors.foreground,
              }}
            >
              {languageLabel}
            </Text>
          </View>

          <View
            className="h-px w-full"
            style={{ backgroundColor: colors.border }}
          />

          <View className="min-h-12 flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Feather
                name="bookmark"
                size={15}
                color={colors.mutedForeground}
              />
              <Text
                className="text-xs"
                style={{
                  fontFamily: "Inter_500Medium",
                  color: colors.mutedForeground,
                }}
              >
                Status
              </Text>
            </View>

            <Text
              className="text-xs"
              style={{
                fontFamily: "Inter_600SemiBold",
                color: colors.foreground,
              }}
            >
              {snippet.pinned ? "Pinned" : "Not pinned"}
            </Text>
          </View>
        </View>

        <Pressable
          accessibilityLabel="Edit this snippet"
          accessibilityRole="button"
          onPress={openEdit}
          className="mt-[18px] min-h-[50px] flex-row items-center justify-center gap-2 rounded-xl active:opacity-80 active:scale-[0.98]"
          style={{ backgroundColor: colors.primary }}
        >
          <Feather name="edit-2" size={17} color={colors.primaryForeground} />
          <Text
            className="text-[13px]"
            style={{
              fontFamily: "Inter_600SemiBold",
              color: colors.primaryForeground,
            }}
          >
            Edit Snippet
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
