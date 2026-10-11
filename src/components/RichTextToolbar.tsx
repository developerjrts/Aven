import { Pressable, View } from "react-native";

import { Typography } from "@/components/Typography";
import { useColors } from "@/hooks/useColors";

export type RichTextAction = "bold" | "italic" | "underline" | "bullet";

const actions: Array<{
  action: RichTextAction;
  label: string;
  accessibilityLabel: string;
}> = [
  { action: "bold", label: "B", accessibilityLabel: "Bold" },
  { action: "italic", label: "I", accessibilityLabel: "Italic" },
  { action: "underline", label: "U", accessibilityLabel: "Underline" },
  { action: "bullet", label: "•", accessibilityLabel: "Bullet list" },
];

export function RichTextToolbar({
  onAction,
}: {
  onAction: (action: RichTextAction) => void;
}) {
  const colors = useColors();

  return (
    <View
      accessibilityRole="toolbar"
      className="min-h-12 flex-row items-center gap-2 border-b px-3"
      style={{
        backgroundColor: colors.secondary,
        borderBottomColor: colors.border,
      }}
    >
      {actions.map(({ accessibilityLabel, action, label }) => (
        <Pressable
          key={action}
          accessibilityLabel={accessibilityLabel}
          accessibilityRole="button"
          onPress={() => onAction(action)}
          className="h-[34px] w-9 items-center justify-center rounded-[10px]"
          style={({ pressed }) => [
            pressed && {
              opacity: 0.7,
              transform: [{ scale: 0.95 }],
            },
          ]}
          testID={`rich-text-${action}-button`}
        >
          <Typography
            className="text-lg"
            style={[
              action === "italic" && { fontStyle: "italic" },
              action === "underline" && {
                textDecorationLine: "underline",
              },
              { color: colors.foreground },
            ]}
          >
            {label}
          </Typography>
        </Pressable>
      ))}
    </View>
  );
}
