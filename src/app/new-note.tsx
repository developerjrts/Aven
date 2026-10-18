import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { Button } from "@/components/Button";
import { FormLabel, FormScreen } from "@/components/FormScreen";
import { IconButton } from "@/components/IconButton";
import { Input } from "@/components/Input";
import { RichTextEditor } from "@/components/RichTextEditor";
import { getRichTextPlainText } from "@/components/RichTextPreview";
import { useNotes } from "@/context/notes";
import { useColors } from "@/hooks/useColors";
import { createAINote } from "@/service/createNote";

type CreatedNote = {
  title: string;
  content: string;
};

export default function NewNoteScreen() {
  const router = useRouter();
  const { addNote, addAiGeneratedNote, addPrivateNote } = useNotes();
  const colors = useColors();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [isPrivate, setIsPrivate] = useState(false);
  const [aiDrawerVisible, setAiDrawerVisible] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [generatedNote, setGeneratedNote] = useState<CreatedNote | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const plainTextContent = getRichTextPlainText(content);

  const canSave = title.trim().length > 0 && plainTextContent.trim().length > 0;

  const togglePrivate = () => {
    if (isSaving) return;

    setIsPrivate((current) => !current);
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const goBack = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const saveNote = async (makePrivate = isPrivate) => {
    if (!canSave || isSaving) return;

    setIsSaving(true);

    try {
      if (makePrivate) {
        await addPrivateNote(title.trim(), content.trim());
      } else {
        addNote(title.trim(), content.trim());
      }

      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      router.back();
    } catch (error) {
      console.error("Failed to save note:", error);

      Alert.alert(
        makePrivate ? "Private note not saved" : "Note not saved",
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const openAIDrawer = () => {
    setAiPrompt("");
    setGeneratedNote(null);
    setAiDrawerVisible(true);

    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const closeAIDrawer = () => {
    if (isGenerating || isSaving) return;

    setAiDrawerVisible(false);
    setAiPrompt("");
    setGeneratedNote(null);
  };

  const generateAINote = async () => {
    if (!aiPrompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setGeneratedNote(null);

    try {
      const result = await createAINote(aiPrompt);

      setGeneratedNote({
        title: result.title,
        content: result.content,
      });

      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error("AI note creation failed:", error);

      Alert.alert(
        "AI note creation failed",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const saveGeneratedNote = async () => {
    if (!generatedNote || isSaving) return;

    setIsSaving(true);

    try {
      if (isPrivate) {
        // Private notes remain encrypted.
        await addPrivateNote(
          generatedNote.title.trim(),
          generatedNote.content.trim(),
        );
      } else {
        // Mark this note as AI-generated.
        addAiGeneratedNote(
          generatedNote.title.trim(),
          generatedNote.content.trim(),
        );
      }

      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      setAiDrawerVisible(false);
      router.back();
    } catch (error) {
      console.error("Failed to save generated note:", error);

      Alert.alert(
        isPrivate ? "Private note not saved" : "Note not saved",
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <FormScreen title="New note" backTestID="back-button" onBack={goBack}>
        <FormLabel>Title</FormLabel>

        <Input
          autoCapitalize="sentences"
          onChangeText={setTitle}
          placeholder="Give your note a title"
          returnKeyType="next"
          testID="note-title-input"
          value={title}
          variant="title"
        />

        <FormLabel>Note</FormLabel>

        <RichTextEditor
          onChange={setContent}
          testID="note-content-input"
          value={content}
        />

        <View className="flex-row items-center gap-2.5">
          <View className="flex-1">
            <Button
              accessibilityLabel={isPrivate ? "Save private note" : "Save note"}
              disabled={!canSave || isSaving}
              onPress={() => void saveNote()}
              testID="save-note-button"
            >
              {isSaving
                ? "Saving..."
                : isPrivate
                  ? "Save private note"
                  : "Save"}
            </Button>
          </View>

          <IconButton
            icon={isPrivate ? "lock" : "unlock"}
            accessibilityLabel={
              isPrivate ? "Disable private mode" : "Enable private mode"
            }
            disabled={isSaving}
            onPress={togglePrivate}
          />

          <IconButton
            icon="zap"
            accessibilityLabel="Ask AI to create a note"
            onPress={openAIDrawer}
          />
        </View>

        <View className="mt-2 flex-row items-center gap-2">
          <View
            className={`h-2 w-2 rounded-full ${
              isPrivate ? "bg-emerald-500" : "bg-neutral-400"
            }`}
          />

          <Text className="text-xs" style={{ color: colors.mutedForeground }}>
            {isPrivate
              ? "Private mode enabled · Note will be encrypted"
              : "Not private · Regular note"}
          </Text>
        </View>
      </FormScreen>

      <Modal
        animationType="slide"
        transparent
        visible={aiDrawerVisible}
        onRequestClose={closeAIDrawer}
        statusBarTranslucent
      >
        <View className="flex-1 justify-end">
          <Pressable
            className="absolute inset-0 bg-black/50"
            onPress={closeAIDrawer}
            disabled={isGenerating || isSaving}
            accessibilityLabel="Close AI drawer"
          />

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 justify-end"
            keyboardVerticalOffset={0}
          >
            <View
              className="h-[82%] max-h-[90%] min-h-[320px] rounded-t-3xl px-5 pb-5 pt-3 dark:border-neutral-700"
              style={{ backgroundColor: colors.card }}
            >
              <View className="mb-4 h-1 w-10 self-center rounded-full bg-neutral-400" />

              <View className="mb-4 flex-row items-start justify-between">
                <View className="flex-1 gap-1">
                  <Text
                    className="text-[22px] font-bold"
                    style={{ color: colors.foreground }}
                  >
                    Ask AI
                  </Text>

                  <Text
                    className="text-sm leading-5"
                    style={{ color: colors.mutedForeground }}
                  >
                    Describe the note you want to create.
                  </Text>
                </View>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Close AI drawer"
                  disabled={isGenerating || isSaving}
                  onPress={closeAIDrawer}
                  className="p-2"
                >
                  <Text
                    className="text-xl"
                    style={{ color: colors.foreground }}
                  >
                    ✕
                  </Text>
                </Pressable>
              </View>

              {!generatedNote ? (
                <>
                  <ScrollView
                    className="flex-1"
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                    showsVerticalScrollIndicator={false}
                    contentContainerClassName="flex-grow"
                  >
                    <TextInput
                      multiline
                      editable={!isGenerating}
                      value={aiPrompt}
                      onChangeText={setAiPrompt}
                      placeholder="Example: Create a brief note on ion exchange, including definition, working, regeneration reactions, applications, and limitations."
                      placeholderTextColor={colors.mutedForeground}
                      textAlignVertical="top"
                      accessibilityLabel="Describe the note to create"
                      className="min-h-[140px] rounded-2xl border border-neutral-300 p-4 text-[15px] leading-6 dark:border-neutral-700"
                      style={{
                        backgroundColor: colors.background,
                        color: colors.foreground,
                      }}
                    />

                    {isGenerating && (
                      <View className="flex-row items-center justify-center gap-2 py-5">
                        <ActivityIndicator color={colors.foreground} />

                        <Text
                          className="text-sm"
                          style={{ color: colors.mutedForeground }}
                        >
                          AI is writing your note...
                        </Text>
                      </View>
                    )}
                  </ScrollView>

                  <View className="pt-3">
                    <Button
                      disabled={!aiPrompt.trim() || isGenerating}
                      onPress={() => void generateAINote()}
                    >
                      {isGenerating ? "Creating note..." : "Generate note"}
                    </Button>
                  </View>
                </>
              ) : (
                <>
                  <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                  >
                    <Text
                      className="mb-2 mt-1 text-[11px] font-bold tracking-widest"
                      style={{ color: colors.mutedForeground }}
                    >
                      GENERATED TITLE
                    </Text>

                    <Text
                      className="mb-5 text-xl font-bold"
                      style={{ color: colors.foreground }}
                    >
                      {generatedNote.title}
                    </Text>

                    <Text
                      className="mb-2 mt-1 text-[11px] font-bold tracking-widest"
                      style={{ color: colors.mutedForeground }}
                    >
                      NOTE CONTENT
                    </Text>

                    <Text
                      selectable
                      className="mb-5 text-[15px] leading-6"
                      style={{ color: colors.foreground }}
                    >
                      {generatedNote.content}
                    </Text>
                  </ScrollView>

                  <View className="gap-2 pt-3">
                    <Button
                      disabled={isSaving}
                      onPress={() => void saveGeneratedNote()}
                    >
                      {isSaving
                        ? "Saving..."
                        : isPrivate
                          ? "Save as private note"
                          : "Save note"}
                    </Button>

                    <Button disabled={isSaving} onPress={closeAIDrawer}>
                      Discard
                    </Button>

                    <Pressable
                      disabled={isSaving}
                      onPress={() => setGeneratedNote(null)}
                      className="items-center py-2"
                    >
                      <Text
                        className="text-sm"
                        style={{ color: colors.mutedForeground }}
                      >
                        Try a different prompt
                      </Text>
                    </Pressable>
                  </View>
                </>
              )}
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
