import { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  actions,
  RichEditor,
  RichToolbar,
} from 'react-native-pell-rich-editor';

import { useColors } from '@/hooks/useColors';

export function RichTextEditor({
  value,
  onChange,
  testID,
}: {
  value: string;
  onChange: (value: string) => void;
  testID: string;
}) {
  const colors = useColors();

  const editorRef = useRef<RichEditor>(null);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <RichToolbar
        editor={editorRef}
        actions={[
          actions.setBold,
          actions.setItalic,
          actions.setUnderline,
          actions.insertBulletsList,
          actions.insertOrderedList,
        ]}
        iconTint={colors.foreground}
        selectedIconTint={colors.primary}
        style={[
          styles.toolbar,
          {
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
          },
        ]}
      />

      <RichEditor
        ref={editorRef}
        initialContentHTML={value}
        onChange={onChange}
        placeholder="Start writing..."
        editorStyle={{
          backgroundColor: colors.card,
          color: colors.foreground,
          placeholderColor: colors.mutedForeground,
          cssText: `
            body {
              font-size: 16px;
              line-height: 24px;
              padding: 16px;
              margin: 0;
            }

            ul, ol {
              padding-left: 24px;
            }
          `,
        }}
        style={styles.editor}
        testID={testID}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },

  toolbar: {
    borderBottomWidth: 1,
  },

  editor: {
    minHeight: 250,
  },
});
