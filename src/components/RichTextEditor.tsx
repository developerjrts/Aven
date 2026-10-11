import { useRef } from "react";
import { View } from "react-native";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";

import { useColors } from "@/hooks/useColors";

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
      className="overflow-hidden rounded-xl border"
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
      }}
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
        className="border-b"
        style={{
          backgroundColor: colors.card,
          borderBottomColor: colors.border,
        }}
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
        className="min-h-[250px]"
        testID={testID}
      />
    </View>
  );
}
