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

import { Button } from "@/components/Button";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { FormLabel, FormScreen } from "@/components/FormScreen";
import { Input } from "@/components/Input";
import { RichTextEditor } from "@/components/RichTextEditor";
import { getRichTextPlainText } from "@/components/RichTextPreview";
import { Typography } from "@/components/Typography";
import { type Note, useNotes } from "@/context/notes";
import { useColors } from "@/hooks/useColors";
import { summarizeNote, type SummaryResult } from "@/service/aiSummarize";
import { Ionicons } from "@expo/vector-icons";

export default function EditNoteScreen() {
  const colors = useColors();

  const { notes, isLoaded, updateNote, toggleNotePinned, deleteNote } =
    useNotes();

  const { id } = useLocalSearchParams<{ id?: string }>();
  const note = notes.find((item) => item.id === id);

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
    return <MissingNoteScreen />;
  }

  return (
    <EditNoteForm
      note={note}
      onDelete={deleteNote}
      onSave={updateNote}
      onTogglePin={toggleNotePinned}
    />
  );
}

function MissingNoteScreen() {
  const colors = useColors();
  const router = useRouter();

  return (
    <View
      className="flex-1 items-center justify-center px-6"
      style={{ backgroundColor: colors.background }}
    >
      <View
        className="mb-5 h-[76px] w-[76px] items-center justify-center rounded-[24px] border"
        style={{
          backgroundColor: colors.secondary,
          borderColor: colors.border,
        }}
      >
        <Typography color="mutedForeground">
          <Text className="text-3xl">?</Text>
        </Typography>
      </View>

      <Typography variant="heading" className="text-center">
        Note not found
      </Typography>

      <Typography color="mutedForeground" className="mt-2 text-center">
        This note may have been deleted or is no longer available.
      </Typography>

      <Pressable
        accessibilityLabel="Go back"
        accessibilityRole="button"
        onPress={() => router.back()}
        className="mt-6 min-h-[46px] flex-row items-center justify-center gap-2 rounded-[13px] border px-5 active:opacity-80"
        style={{ borderColor: colors.border }}
      >
        <Typography color="foreground" variant="button">
          Go back
        </Typography>
      </Pressable>
    </View>
  );
}

function EditNoteForm({
  note,
  onDelete,
  onSave,
  onTogglePin,
}: {
  note: Note;
  onDelete: (id: string) => void;
  onSave: (id: string, title: string, content: string) => void;
  onTogglePin: (id: string) => void;
}) {
  const router = useRouter();
  const colors = useColors();

  const [title, setTitle] = useState<string>(note.title);
  const [content, setContent] = useState<string>(note.content);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  const plainText = getRichTextPlainText(content).trim();

  const canSave = title.trim().length > 0 && plainText.length > 0;

  const goBack = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const saveNote = () => {
    if (!canSave) return;

    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    onSave(note.id, title.trim(), content.trim());
    router.back();
  };

  const togglePin = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onTogglePin(note.id);
  };

  const deleteCurrentNote = () => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

    onDelete(note.id);
    router.back();
  };

  const confirmDelete = () => {
    if (process.env.EXPO_OS === "web") {
      setShowDeleteDialog(true);
      return;
    }

    Alert.alert(
      "Delete note?",
      "This note will be removed from Aven.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: deleteCurrentNote,
        },
      ],
      { cancelable: true },
    );
  };

  const handleSummarize = async () => {
    if (isSummarizing) return;

    const text = getRichTextPlainText(content).trim();

    if (!text) {
      Alert.alert("Empty note", "Add some text before generating a summary.");
      return;
    }

    if (text.length > 12000) {
      Alert.alert(
        "Note too long",
        "Please shorten the note to 12,000 characters or fewer.",
      );
      return;
    }

    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsSummarizing(true);

    try {
      const result = await summarizeNote(title.trim(), text);

      setSummary(result);
      setShowSummary(true);

      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      Alert.alert(
        "Summarization failed",
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSummarizing(false);
    }
  };

  const copySummary = async () => {
    if (!summary) return;

    const textToCopy = [
      "Summary",
      summary.summary,
      "",
      "Key points",
      ...summary.keyPoints.map((point) => `• ${point}`),
      "",
      "Action items",
      ...(summary.actionItems.length > 0
        ? summary.actionItems.map((item) => `• ${item}`)
        : ["No action items identified."]),
    ].join("\n");

    try {
      await Clipboard.setStringAsync(textToCopy);
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Copied", "AI summary copied to clipboard.");
    } catch {
      Alert.alert("Copy failed", "Unable to copy the summary.");
    }
  };

  return (
    <>
      <FormScreen
        title="Edit note"
        backTestID="edit-back-button"
        onBack={goBack}
      >
        <FormLabel>Title</FormLabel>

        <Input
          autoCapitalize="sentences"
          onChangeText={setTitle}
          placeholder="Give your note a title"
          testID="edit-note-title-input"
          value={title}
          variant="title"
        />

        <View className="mb-2 flex-row items-center justify-between">
          <FormLabel>Note</FormLabel>

          {/* Icon-only AI summarizer action */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              isSummarizing ? "Summarizing note" : "Summarize note with AI"
            }
            accessibilityHint="Creates a summary, key points, and action items"
            disabled={isSummarizing || !plainText}
            onPress={() => void handleSummarize()}
            testID="summarize-note-icon-button"
            className="h-11 w-11 items-center justify-center rounded-2xl border active:opacity-70"
            style={{
              backgroundColor: colors.secondary,
              borderColor: colors.border,
              opacity: isSummarizing || !plainText ? 0.6 : 1,
            }}
          >
            {isSummarizing ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              // <Text
              //   style={{
              //     fontSize: 24,
              //     color: colors.primary,
              //   }}
              // >
              //   ✨
              // </Text>
              <Ionicons name="sparkles" size={22} color={colors.foreground} />
            )}
          </Pressable>
        </View>

        <RichTextEditor
          onChange={setContent}
          testID="edit-note-content-input"
          value={content}
        />

        {isSummarizing && (
          <View className="flex-row items-center justify-center gap-2 py-3">
            <ActivityIndicator color={colors.primary} />
            <Typography color="mutedForeground">
              Generating your summary...
            </Typography>
          </View>
        )}

        <Button
          accessibilityLabel="Save note changes"
          disabled={!canSave}
          onPress={saveNote}
          testID="save-edited-note-button"
        >
          Save
        </Button>

        <Button
          accessibilityLabel={note.pinned ? "Unpin note" : "Pin note"}
          icon="bookmark"
          onPress={togglePin}
          className="min-h-[52px]"
          testID="toggle-pin-button"
          variant="secondary"
        >
          {note.pinned ? "Unpin note" : "Pin note"}
        </Button>

        <Button
          accessibilityLabel="Delete note"
          icon="trash-2"
          onPress={confirmDelete}
          className="min-h-[52px]"
          testID="delete-note-button"
          variant="destructive"
        >
          Delete note
        </Button>
      </FormScreen>

      {/* AI summary modal */}
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
                <Text style={{ fontSize: 23 }}>✨</Text>
                <Typography variant="heading">AI Summary</Typography>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close summary"
                onPress={() => setShowSummary(false)}
                className="h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: colors.secondary }}
              >
                <Typography>✕</Typography>
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

                {summary.keyPoints.length > 0 ? (
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

                {summary.actionItems.length > 0 ? (
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
              <Button
                onPress={() => void copySummary()}
                disabled={!summary}
                variant="secondary"
              >
                Copy summary
              </Button>

              <Button onPress={() => setShowSummary(false)}>Done</Button>
            </View>
          </View>
        </View>
      </Modal>

      <ConfirmDialog
        cancelTestID="cancel-delete-button"
        confirmTestID="confirm-delete-button"
        message="This note will be removed from Aven."
        onCancel={() => setShowDeleteDialog(false)}
        onConfirm={deleteCurrentNote}
        title="Delete note?"
        visible={showDeleteDialog}
      />
    </>
  );
}
