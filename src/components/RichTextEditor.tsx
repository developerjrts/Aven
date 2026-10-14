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
        placeholder="Start writing your thoughts..."
        editorStyle={{
          backgroundColor: colors.card,
          color: colors.foreground,
          placeholderColor: colors.mutedForeground,
          cssText: `
      html {
        min-height: 100%;
      }

      body {
        font-size: 16px;
        line-height: 26px;
        padding: 18px;
        margin: 0;
        min-height: 250px;
        box-sizing: border-box;
      }

      p {
        margin: 0 0 12px 0;
      }

      ul, ol {
        padding-left: 24px;
      }

      li {
        margin-bottom: 6px;
      }
    `,
        }}
        style={{
          minHeight: 300,
          height: 300,
        }}
        className="w-full"
        testID={testID}
      />
    </View>
  );
}
