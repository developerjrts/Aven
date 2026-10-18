import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";

import { Button } from "@/components/Button";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { FormLabel, FormScreen } from "@/components/FormScreen";
import { Input } from "@/components/Input";
import { RichTextEditor } from "@/components/RichTextEditor";
import { getRichTextPlainText } from "@/components/RichTextPreview";
import { Typography } from "@/components/Typography";
import { useNotes } from "@/context/notes";
import { useColors } from "@/hooks/useColors";

export default function EditPrivateNoteScreen() {
  const colors = useColors();
  const router = useRouter();

  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { notes, unlockNote, lockNote, updatePrivateNote, deleteNote } =
    useNotes();

  const note = useMemo(
    () => notes.find((item) => item.id === id && item.private === true),
    [notes, id],
  );

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isUnlocking, setIsUnlocking] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadPrivateNote() {
      if (!id || !note) {
        setIsUnlocking(false);
        setLoadError(true);
        return;
      }

      setIsUnlocking(true);
      setLoadError(false);

      try {
        const unlockedNote = await unlockNote(id);

        if (cancelled) {
          lockNote(id);
          return;
        }

        setTitle(unlockedNote.title ?? "");
        setContent(unlockedNote.content ?? "");
        setHasChanges(false);
      } catch (error) {
        if (cancelled) return;

        console.warn("Unable to unlock private note:", error);
        setLoadError(true);
      } finally {
        if (!cancelled) {
          setIsUnlocking(false);
        }
      }
    }

    void loadPrivateNote();

    return () => {
      cancelled = true;
    };
  }, [id, note?.id, unlockNote, lockNote]);

  const goBack = useCallback(() => {
    if (isSaving || isDeleting) return;

    if (hasChanges) {
      Alert.alert("Discard changes?", "Your changes have not been saved.", [
        { text: "Keep editing", style: "cancel" },
        {
          text: "Discard",
          style: "destructive",
          onPress: () => {
            if (id) lockNote(id);

            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

            router.back();
          },
        },
      ]);

      return;
    }

    if (id) lockNote(id);

    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  }, [hasChanges, id, isSaving, isDeleting, lockNote, router]);

  const savePrivateNote = async () => {
    if (!id || !title.trim() || !getRichTextPlainText(content).trim()) {
      Alert.alert(
        "Missing information",
        "Please enter a title and some note content before saving.",
      );
      return;
    }

    if (isSaving || isDeleting) return;

    setIsSaving(true);

    try {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      await updatePrivateNote(id, title.trim(), content);

      setHasChanges(false);

      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      Alert.alert("Saved", "Your private note has been updated.", [
        {
          text: "OK",
          onPress: () => {
            lockNote(id);
            router.back();
          },
        },
      ]);
    } catch (error) {
      Alert.alert(
        "Save failed",
        error instanceof Error
          ? error.message
          : "Unable to save your private note. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const deleteCurrentNote = () => {
    if (!id || !note || isDeleting || isSaving) return;

    setIsDeleting(true);

    try {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

      deleteNote(id);
      lockNote(id);
      setShowDeleteDialog(false);
      router.back();
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmDelete = () => {
    if (!id || !note || isSaving || isDeleting) return;

    if (process.env.EXPO_OS === "web") {
      setShowDeleteDialog(true);
      return;
    }

    Alert.alert(
      "Delete private note?",
      "This private note will be permanently removed from Aven.",
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

  if (!id || !note) {
    return (
      <View
        className="flex-1 items-center justify-center px-6"
        style={{ backgroundColor: colors.background }}
      >
        <Feather name="lock" size={36} color={colors.primary} />

        <Typography variant="heading" className="mt-4 text-center">
          Private note not found
        </Typography>

        <Typography color="mutedForeground" className="mt-2 text-center">
          This note may have been deleted or is no longer private.
        </Typography>

        <Button onPress={() => router.back()} className="mt-6">
          Go back
        </Button>
      </View>
    );
  }

  if (isUnlocking) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <ActivityIndicator size="large" color={colors.primary} />

        <Typography color="mutedForeground" className="mt-4">
          Authenticating and unlocking...
        </Typography>
      </View>
    );
  }

  if (loadError) {
    return (
      <View
        className="flex-1 items-center justify-center px-6"
        style={{ backgroundColor: colors.background }}
      >
        <Feather name="shield" size={36} color={colors.primary} />

        <Typography variant="heading" className="mt-4 text-center">
          Note remains locked
        </Typography>

        <Typography color="mutedForeground" className="mt-2 text-center">
          The private note could not be opened.
        </Typography>

        <Button
          onPress={() => {
            lockNote(id);
            router.back();
          }}
          className="mt-6"
        >
          Go back
        </Button>
      </View>
    );
  }

  return (
    <FormScreen
      title="Edit private note"
      onBack={goBack}
      backTestID="edit-private-note-back-button"
    >
      <View
        className="mb-5 flex-row items-center gap-3 rounded-2xl border p-4"
        style={{
          backgroundColor: colors.secondary,
          borderColor: colors.border,
        }}
      >
        <Feather name="shield" size={21} color={colors.primary} />

        <View className="flex-1">
          <Typography variant="button">Private note</Typography>

          <Typography color="mutedForeground" variant="caption">
            Your note content is encrypted in local storage.
          </Typography>
        </View>

        <Feather name="lock" size={18} color={colors.primary} />
      </View>

      <FormLabel>Title</FormLabel>

      <Input
        autoCapitalize="sentences"
        onChangeText={(value) => {
          setTitle(value);
          setHasChanges(true);
        }}
        placeholder="Give your private note a title"
        value={title}
        variant="title"
      />

      <View className="mb-2 mt-5">
        <FormLabel>Note</FormLabel>
      </View>

      <RichTextEditor
        value={content}
        onChange={(value) => {
          setContent(value);
          setHasChanges(true);
        }}
        testID="edit-private-note-content-input"
      />

      <Button
        accessibilityLabel="Save private note changes"
        disabled={
          isSaving ||
          isDeleting ||
          !hasChanges ||
          !title.trim() ||
          !getRichTextPlainText(content).trim()
        }
        onPress={() => void savePrivateNote()}
        testID="save-private-note-button"
        className="mt-5"
      >
        {isSaving ? "Saving..." : "Save changes"}
      </Button>

      <Button
        accessibilityLabel="Delete private note"
        icon="trash-2"
        onPress={confirmDelete}
        disabled={isSaving || isDeleting}
        className="mt-3 min-h-[52px]"
        testID="delete-private-note-button"
        variant="destructive"
      >
        {isDeleting ? "Deleting..." : "Delete note"}
      </Button>

      <Button
        icon="lock"
        variant="secondary"
        onPress={goBack}
        disabled={isSaving || isDeleting}
        className="mt-3"
      >
        Lock and close
      </Button>

      <ConfirmDialog
        cancelTestID="cancel-delete-button"
        confirmTestID="confirm-delete-button"
        message="This private note will be permanently removed from Aven."
        onCancel={() => setShowDeleteDialog(false)}
        onConfirm={deleteCurrentNote}
        title="Delete private note?"
        visible={showDeleteDialog}
      />
    </FormScreen>
  );
}
