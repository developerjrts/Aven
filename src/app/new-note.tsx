import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import { Button } from '@/components/Button';
import {
  FormLabel,
  FormScreen,
} from '@/components/FormScreen';
import { Input } from '@/components/Input';
import { RichTextEditor } from '@/components/RichTextEditor';
import { getRichTextPlainText } from '@/components/RichTextPreview';
import { useNotes } from '@/context/notes';

export default function NewNoteScreen() {
  const router = useRouter();

  const { addNote } = useNotes();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const plainTextContent =
    getRichTextPlainText(content);

  const canSave =
    title.trim().length > 0 &&
    plainTextContent.trim().length > 0;

  const goBack = () => {
    void Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle.Light,
    );

    router.back();
  };

  const saveNote = () => {
    if (!canSave) {
      return;
    }

    void Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success,
    );

    // Save the original rich-text content,
    // not the converted plain text.
    addNote(
      title.trim(),
      content.trim(),
    );

    router.back();
  };

  return (
    <FormScreen
      title="New note"
      backTestID="back-button"
      onBack={goBack}
    >
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

      <Button
        accessibilityLabel="Save note"
        disabled={!canSave}
        onPress={saveNote}
        testID="save-note-button"
      >
        Save
      </Button>
    </FormScreen>
  );
}
