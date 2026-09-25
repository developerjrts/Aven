import * as Haptics from 'expo-haptics';
import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';

import { Button } from '@/components/Button';
import { CodeBlock } from '@/components/CodeBlock';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import {
  FormLabel,
  FormScreen,
} from '@/components/FormScreen';
import { Input } from '@/components/Input';
import { LanguagePicker } from '@/components/LanguagePicker';

import {
  type Snippet,
  type SnippetLanguage,
  useSnippets,
} from '@/context/snippets';

import { useColors } from '@/hooks/useColors';
import { commonStyles } from '@/styles/common';

export default function EditSnippetScreen() {
  const colors = useColors();

  const {
    snippets,
    isLoaded,
    updateSnippet,
    toggleSnippetPinned,
    deleteSnippet,
  } = useSnippets();

  const { id } =
    useLocalSearchParams<{
      id?: string;
    }>();

  const snippet = snippets.find(
    (item) => item.id === id,
  );

  if (!isLoaded) {
    return (
      <View
        style={[
          commonStyles.screen,
          {
            backgroundColor:
              colors.background,
          },
        ]}
      >
        <ActivityIndicator
          color={colors.primary}
        />
      </View>
    );
  }

  if (!snippet) {
    return <MissingSnippetScreen />;
  }

  return (
    <EditSnippetForm
      snippet={snippet}
      onDelete={deleteSnippet}
      onSave={updateSnippet}
      onTogglePin={toggleSnippetPinned}
    />
  );
}

function MissingSnippetScreen() {
  const colors = useColors();
  const router = useRouter();

  return (
    <View
      style={[
        commonStyles.screen,
        styles.missingScreen,
        {
          backgroundColor:
            colors.background,
        },
      ]}
    >
      <Text
        style={[
          styles.missingText,
          {
            color: colors.foreground,
          },
        ]}
      >
        Snippet not found
      </Text>

      <Pressable
        accessibilityLabel="Go back"
        accessibilityRole="button"
        onPress={() => router.back()}
        style={[
          commonStyles.dialogAction,
          commonStyles.dialogCancelAction,
          {
            borderColor: colors.border,
          },
        ]}
      >
        <Text
          style={{
            color: colors.foreground,
          }}
        >
          Go back
        </Text>
      </Pressable>
    </View>
  );
}

function EditSnippetForm({
  snippet,
  onDelete,
  onSave,
  onTogglePin,
}: {
  snippet: Snippet;
  onDelete: (id: string) => void;
  onSave: (
    id: string,
    title: string,
    code: string,
    language: SnippetLanguage,
  ) => void;
  onTogglePin: (id: string) => void;
}) {
  const router = useRouter();

  const [title, setTitle] =
    useState<string>(snippet.title);

  const [code, setCode] =
    useState<string>(snippet.code);

  const [language, setLanguage] =
    useState<SnippetLanguage>(
      snippet.language,
    );

  const [showDeleteDialog, setShowDeleteDialog] =
    useState<boolean>(false);

  const canSave =
    title.trim().length > 0 &&
    code.trim().length > 0;

  const goBack = () => {
    void Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle.Light,
    );

    router.back();
  };

  const saveSnippet = () => {
    if (!canSave) return;

    void Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success,
    );

    onSave(
      snippet.id,
      title.trim(),
      code.trim(),
      language,
    );

    router.back();
  };

  const togglePin = () => {
    void Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle.Light,
    );

    onTogglePin(snippet.id);
  };

  const deleteCurrentSnippet = () => {
    void Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Warning,
    );

    onDelete(snippet.id);
    router.back();
  };

  const confirmDelete = () => {
    if (Platform.OS === 'web') {
      setShowDeleteDialog(true);
      return;
    }

    Alert.alert(
      'Delete snippet?',
      'This snippet will be removed from Aven.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress:
            deleteCurrentSnippet,
        },
      ],
      {
        cancelable: true,
      },
    );
  };

  return (
    <>
      <FormScreen
        title="Edit snippet"
        backTestID="edit-snippet-back-button"
        onBack={goBack}
      >
        <FormLabel>
          Title
        </FormLabel>

        <Input
          autoCapitalize="sentences"
          onChangeText={setTitle}
          placeholder="Give your snippet a title"
          testID="edit-snippet-title-input"
          value={title}
          variant="title"
        />

        <FormLabel>
          Language
        </FormLabel>

        <LanguagePicker
          onChange={setLanguage}
          testIDPrefix="edit-language"
          value={language}
        />

        <FormLabel>
          Code
        </FormLabel>

        <Input
          autoCapitalize="none"
          autoCorrect={false}
          multiline
          onChangeText={setCode}
          placeholder="Paste or write your code..."
          testID="edit-snippet-code-input"
          textAlignVertical="top"
          value={code}
          variant="code"
        />

        {code.trim().length > 0 && (
          <CodeBlock
            code={code}
            language={language}
            numberOfLines={8}
          />
        )}

        <Button
          accessibilityLabel="Save snippet changes"
          disabled={!canSave}
          onPress={saveSnippet}
          testID="save-edited-snippet-button"
        >
          Save changes
        </Button>

        <Button
          accessibilityLabel={
            snippet.pinned
              ? 'Unpin snippet'
              : 'Pin snippet'
          }
          icon="bookmark"
          onPress={togglePin}
          style={commonStyles.compactButton}
          testID="toggle-snippet-pin-button"
          variant="secondary"
        >
          {snippet.pinned
            ? 'Unpin snippet'
            : 'Pin snippet'}
        </Button>

        <Button
          accessibilityLabel="Delete snippet"
          icon="trash-2"
          onPress={confirmDelete}
          style={commonStyles.compactButton}
          testID="delete-snippet-button"
          variant="destructive"
        >
          Delete snippet
        </Button>
      </FormScreen>

      <ConfirmDialog
        cancelTestID="cancel-delete-snippet-button"
        confirmTestID="confirm-delete-snippet-button"
        message="This snippet will be removed from Aven."
        onCancel={() =>
          setShowDeleteDialog(false)
        }
        onConfirm={deleteCurrentSnippet}
        title="Delete snippet?"
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