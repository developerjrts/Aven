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
              font-family: -apple-system, BlinkMacSystemFont, sans-serif;
              font-size: 16px;
              line-height: 1.7;
              padding: 18px;
              margin: 0;
              min-height: 250px;
              box-sizing: border-box;
              overflow-wrap: break-word;
            }

            p {
              margin: 0 0 14px 0;
            }

            h1 {
              font-size: 25px;
              line-height: 1.3;
              font-weight: 700;
              margin: 22px 0 12px;
            }

            h2 {
              font-size: 21px;
              line-height: 1.4;
              font-weight: 700;
              margin: 20px 0 10px;
            }

            h3 {
              font-size: 18px;
              line-height: 1.4;
              font-weight: 600;
              margin: 16px 0 8px;
            }

            ul,
            ol {
              padding-left: 26px;
              margin: 8px 0 16px;
            }

            li {
              padding-left: 4px;
              margin-bottom: 8px;
            }

            strong,
            b {
              font-weight: 700;
            }

            em,
            i {
              font-style: italic;
            }

            u {
              text-decoration: underline;
            }

            blockquote {
              margin: 12px 0;
              padding: 8px 14px;
              border-left: 3px solid #888888;
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
