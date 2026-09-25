import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import { Button } from '@/components/Button';
import { CodeBlock } from '@/components/CodeBlock';
import {
  FormLabel,
  FormScreen,
} from '@/components/FormScreen';
import { Input } from '@/components/Input';
import { LanguagePicker } from '@/components/LanguagePicker';

import {
  type SnippetLanguage,
  useSnippets,
} from '@/context/snippets';

export default function NewSnippetScreen() {
  const router = useRouter();

  const { addSnippet } = useSnippets();

  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] =
    useState<SnippetLanguage>('javascript');

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
    if (!canSave) {
      return;
    }

    void Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success,
    );

    addSnippet(
      title.trim(),
      code.trim(),
      language,
    );

    router.back();
  };

  return (
    <FormScreen
      title="Add snippet"
      backTestID="new-snippet-back-button"
      onBack={goBack}
    >
      <FormLabel>Title</FormLabel>

      <Input
        autoCapitalize="sentences"
        onChangeText={setTitle}
        placeholder="Give your snippet a title"
        testID="snippet-title-input"
        value={title}
        variant="title"
      />

      <FormLabel>Language</FormLabel>

      <LanguagePicker
        onChange={setLanguage}
        value={language}
      />

      <FormLabel>Code</FormLabel>

      <Input
        autoCapitalize="none"
        autoCorrect={false}
        multiline
        onChangeText={setCode}
        placeholder="Paste or write your code..."
        testID="snippet-code-input"
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
        accessibilityLabel="Save snippet"
        disabled={!canSave}
        onPress={saveSnippet}
        testID="save-snippet-button"
      >
        Save snippet
      </Button>
    </FormScreen>
  );
}