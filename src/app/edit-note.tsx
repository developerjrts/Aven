import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { FormLabel, FormScreen } from '@/components/FormScreen';
import { Input } from '@/components/Input';
import { RichTextEditor } from '@/components/RichTextEditor';
import { getRichTextPlainText } from '@/components/RichTextPreview';
import { type Note, useNotes } from '@/context/notes';
import { useColors } from '@/hooks/useColors';
import { commonStyles } from '@/styles/common';

export default function EditNoteScreen() {
  const colors = useColors();
  const { notes, isLoaded, updateNote, toggleNotePinned, deleteNote } = useNotes();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const note = notes.find((item) => item.id === id);

  if (!isLoaded) {
    return (
      <View style={[commonStyles.screen, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!note) return <MissingNoteScreen />;

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
    <View style={[commonStyles.screen, styles.missingScreen, { backgroundColor: colors.background }]}>
      <Text style={[styles.missingText, { color: colors.foreground }]}>Note not found</Text>
      <Pressable
        accessibilityLabel="Go back"
        accessibilityRole="button"
        onPress={() => router.back()}
        style={[commonStyles.dialogAction, commonStyles.dialogCancelAction, { borderColor: colors.border }]}
      >
        <Text style={{ color: colors.foreground }}>Go back</Text>
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
    if (process.env.EXPO_OS === 'web') {
      setShowDeleteDialog(true);
      return;
    }

    Alert.alert(
      'Delete note?',
      'This note will be removed from Aven.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: deleteCurrentNote },
      ],
      { cancelable: true },
    );
  };

  return (
    <>
      <FormScreen title="Edit note" backTestID="edit-back-button" onBack={goBack}>
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
          accessibilityLabel={note.pinned ? 'Unpin note' : 'Pin note'}
          icon="bookmark"
          onPress={togglePin}
          style={commonStyles.compactButton}
          testID="toggle-pin-button"
          variant="secondary"
        >
          {note.pinned ? 'Unpin note' : 'Pin note'}
        </Button>
        <Button
          accessibilityLabel="Delete note"
          icon="trash-2"
          onPress={confirmDelete}
          style={commonStyles.compactButton}
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

const styles = {
  missingScreen: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingHorizontal: 24,
  },
  missingText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 17,
    marginBottom: 18,
  },
};