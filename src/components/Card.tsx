import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import type { ReactNode } from "react";

import { useColors } from "@/hooks/useColors";

export function Card({
  children,
  onPress,
  style,
  ...props
}: Omit<PressableProps, "style"> & {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const colors = useColors();

  return (
    <Pressable
      {...props}
      onPress={onPress}
      className={[
        "rounded-[18px] border px-[18px] py-4",
        onPress ? "active:opacity-[0.78] active:scale-[0.98]" : "",
      ].join(" ")}
      style={[
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
        style as StyleProp<ViewStyle>,
      ]}
    >
      {children}
    </Pressable>
  );
}
