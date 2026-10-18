import { Feather, Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import {
  RichTextPreview,
  getRichTextPlainText,
} from "@/components/RichTextPreview";
import { Typography } from "@/components/Typography";
import { useNotes } from "@/context/notes";
import { useColors } from "@/hooks/useColors";
import { summarizeNote, type SummaryResult } from "@/service/aiSummarize";

export default function ViewNoteScreen() {
  const colors = useColors();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const { notes, isLoaded, toggleNotePinned, deleteNote } = useNotes();

  const note = notes.find((item) => item.id === id && !item.private);

  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  const isAiGenerated = note?.aiGenerated === true;

  const copyNote = async () => {
    if (!note) return;

    try {
      await Clipboard.setStringAsync(
        [
          note.title || "Untitled note",
          "",
          getRichTextPlainText(note.content ?? ""),
        ].join("\n"),
      );

      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Copied", "Note content copied to clipboard.");
    } catch {
      Alert.alert("Copy failed", "Unable to copy this note.");
    }
  };

  const togglePin = () => {
    if (!note) return;

    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleNotePinned(note.id);
  };

  const editNote = () => {
    if (!note || isAiGenerated) return;

    router.push({
      pathname: "/edit-note",
      params: { id: note.id },
    });
  };

  const handleSummarize = async () => {
    if (!note || isSummarizing) return;

    const plainText = getRichTextPlainText(note.content ?? "").trim();

    if (!plainText) {
      Alert.alert("Empty note", "There is no content to summarize.");
      return;
    }

    if (plainText.length > 12000) {
      Alert.alert(
        "Note too long",
        "Please shorten the note to 12,000 characters or fewer.",
      );
      return;
    }

    setIsSummarizing(true);
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const result = await summarizeNote(note.title ?? "", plainText);
      setSummary(result);
      setShowSummary(true);

      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      Alert.alert(
        "Summarization failed",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setIsSummarizing(false);
    }
  };

  const copySummary = async () => {
    if (!summary) return;

    const text = [
      "Summary",
      summary.summary,
      "",
      "Key points",
      ...summary.keyPoints.map((point) => `• ${point}`),
      "",
      "Action items",
      ...(summary.actionItems.length
        ? summary.actionItems.map((item) => `• ${item}`)
        : ["No action items identified."]),
    ].join("\n");

    try {
      await Clipboard.setStringAsync(text);
      Alert.alert("Copied", "AI summary copied to clipboard.");
    } catch {
      Alert.alert("Copy failed", "Unable to copy the summary.");
    }
  };

  const confirmDeleteAiNote = () => {
    if (!note || !isAiGenerated) return;

    Alert.alert(
      "Delete AI-generated note?",
      "This note will be permanently removed from Aven Notes.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            void Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Warning,
            );
            deleteNote(note.id);
            router.back();
          },
        },
      ],
      { cancelable: true },
    );
  };

  if (!isLoaded) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!note) {
    return (
      <View
        className="flex-1 items-center justify-center px-6"
        style={{ backgroundColor: colors.background }}
      >
        <Feather name="file-text" size={42} color={colors.mutedForeground} />

        <Typography variant="heading" className="mt-4 text-center">
          Note not found
        </Typography>

        <Typography color="mutedForeground" className="mt-2 text-center">
          This note may have been deleted or moved to Private Notes.
        </Typography>

        <Pressable
          onPress={() => router.back()}
          className="mt-5 rounded-xl border px-5 py-3"
          style={{ borderColor: colors.border }}
          accessibilityRole="button"
        >
          <Typography variant="button">Go back</Typography>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <View
        className="flex-row items-center justify-between border-b px-4 py-3"
        style={{ borderColor: colors.border }}
      >
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          className="h-11 w-11 items-center justify-center rounded-full"
          style={{ backgroundColor: colors.card }}
        >
          <Feather name="arrow-left" size={21} color={colors.foreground} />
        </Pressable>

        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={() => void copyNote()}
            accessibilityRole="button"
            accessibilityLabel="Copy note"
            className="h-11 w-11 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.card }}
          >
            <Feather name="copy" size={19} color={colors.foreground} />
          </Pressable>

          <Pressable
            onPress={togglePin}
            accessibilityRole="button"
            accessibilityLabel={note.pinned ? "Unpin note" : "Pin note"}
            className="h-11 w-11 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.card }}
          >
            <Feather
              name="bookmark"
              size={19}
              color={note.pinned ? colors.primary : colors.foreground}
            />
          </Pressable>

          {!isAiGenerated && (
            <Pressable
              onPress={editNote}
              accessibilityRole="button"
              accessibilityLabel="Edit note"
              className="h-11 flex-row items-center justify-center gap-2 rounded-full px-4"
              style={{ backgroundColor: colors.primary }}
            >
              <Feather
                name="edit-2"
                size={16}
                color={colors.primaryForeground}
              />
              <Typography
                variant="button"
                style={{ color: colors.primaryForeground }}
              >
                Edit
              </Typography>
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 28,
          paddingBottom: 60,
        }}
        showsVerticalScrollIndicator={false}
      >
        {note.pinned && (
          <View className="mb-4 flex-row items-center gap-2">
            <Feather name="bookmark" size={14} color={colors.primary} />
            <Typography color="mutedForeground" className="text-sm">
              Pinned note
            </Typography>
          </View>
        )}

        {isAiGenerated && (
          <View className="mb-4 flex-row items-center gap-2">
            <Ionicons name="sparkles" size={16} color={colors.primary} />
            <Typography color="mutedForeground" className="text-sm">
              AI-generated note
            </Typography>
          </View>
        )}

        <Typography variant="display" style={{ color: colors.foreground }}>
          {note.title || "Untitled note"}
        </Typography>

        <View
          className="mb-6 mt-4 h-[3px] w-8 rounded-full"
          style={{ backgroundColor: colors.accent }}
        />

        <RichTextPreview
          value={note.content ?? ""}
          style={{
            color: colors.foreground,
            fontSize: 16,
            lineHeight: 27,
          }}
        />

        <View className="mt-8 gap-3">
          <Pressable
            onPress={() => void handleSummarize()}
            disabled={isSummarizing}
            accessibilityRole="button"
            accessibilityLabel="Summarize note with AI"
            className="min-h-[52px] flex-row items-center justify-center gap-2 rounded-2xl border px-4"
            style={{
              backgroundColor: colors.secondary,
              borderColor: colors.border,
              opacity: isSummarizing ? 0.6 : 1,
            }}
          >
            {isSummarizing ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <Ionicons name="sparkles" size={21} color={colors.foreground} />
            )}

            <Typography variant="button">
              {isSummarizing ? "Generating summary..." : "AI Summary"}
            </Typography>
          </Pressable>

          {isAiGenerated && (
            <Pressable
              onPress={confirmDeleteAiNote}
              accessibilityRole="button"
              accessibilityLabel="Delete AI-generated note"
              className="min-h-[52px] flex-row items-center justify-center gap-2 rounded-2xl border px-4"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.card,
              }}
            >
              <Feather name="trash-2" size={19} color="#DC2626" />
              <Typography style={{ color: "#DC2626" }} variant="button">
                Delete AI note
              </Typography>
            </Pressable>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={showSummary}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setShowSummary(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View
            className="max-h-[85%] rounded-t-3xl border-t p-5"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.border,
            }}
          >
            <View className="mb-4 flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <Ionicons name="sparkles" size={23} color={colors.foreground} />
                <Typography variant="heading">AI Summary</Typography>
              </View>

              <Pressable
                onPress={() => setShowSummary(false)}
                accessibilityRole="button"
                accessibilityLabel="Close summary"
                className="h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: colors.secondary }}
              >
                <Ionicons name="close" size={22} color={colors.foreground} />
              </Pressable>
            </View>

            {summary && (
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 12 }}
              >
                <Typography variant="heading" className="mb-2">
                  Summary
                </Typography>
                <Typography>{summary.summary}</Typography>

                <Typography variant="heading" className="mb-3 mt-5">
                  Key points
                </Typography>

                {summary.keyPoints.length ? (
                  summary.keyPoints.map((point, index) => (
                    <View
                      key={`${index}-${point}`}
                      className="mb-3 flex-row items-start gap-2"
                    >
                      <Typography color="mutedForeground">•</Typography>
                      <View className="flex-1">
                        <Typography>{point}</Typography>
                      </View>
                    </View>
                  ))
                ) : (
                  <Typography color="mutedForeground">
                    No key points identified.
                  </Typography>
                )}

                <Typography variant="heading" className="mb-3 mt-4">
                  Action items
                </Typography>

                {summary.actionItems.length ? (
                  summary.actionItems.map((item, index) => (
                    <View
                      key={`${index}-${item}`}
                      className="mb-3 flex-row items-start gap-2"
                    >
                      <Typography color="mutedForeground">✓</Typography>
                      <View className="flex-1">
                        <Typography>{item}</Typography>
                      </View>
                    </View>
                  ))
                ) : (
                  <Typography color="mutedForeground">
                    No action items identified.
                  </Typography>
                )}
              </ScrollView>
            )}

            <View className="mt-4 gap-3">
              <Pressable
                onPress={copySummary}
                className="min-h-[48px] items-center justify-center rounded-xl px-5 py-3"
                style={{ backgroundColor: colors.primary }}
              >
                <Text
                  className="text-sm font-semibold"
                  style={{ color: colors.background }}
                >
                  Copy Summary
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setShowSummary(false)}
                className="min-h-[48px] items-center justify-center rounded-xl border border-neutral-300 px-5 py-3 dark:border-neutral-700"
              >
                <Text
                  className="text-sm font-semibold"
                  style={{ color: colors.foreground }}
                >
                  Done
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
