import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";

import { Button } from "@/components/Button";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { FormLabel, FormScreen } from "@/components/FormScreen";
import { Input } from "@/components/Input";
import { RichTextEditor } from "@/components/RichTextEditor";
import { getRichTextPlainText } from "@/components/RichTextPreview";
import { Typography } from "@/components/Typography";
import { type Note, useNotes } from "@/context/notes";
import { useColors } from "@/hooks/useColors";

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
        <Text>
          <Typography color="mutedForeground"> </Typography>
        </Text>
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

  const [title, setTitle] = useState<string>(note.title);
  const [content, setContent] = useState<string>(note.content);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);

  const canSave =
    title.trim().length > 0 && getRichTextPlainText(content).trim().length > 0;

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

        <FormLabel>Note</FormLabel>

        <RichTextEditor
          onChange={setContent}
          testID="edit-note-content-input"
          value={content}
        />

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
