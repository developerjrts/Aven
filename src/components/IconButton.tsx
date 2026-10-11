import { Feather } from "@expo/vector-icons";
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useColors } from "@/hooks/useColors";

export function IconButton({
  icon,
  style,
  ...props
}: Omit<PressableProps, "style"> & {
  icon: keyof typeof Feather.glyphMap;
  style?: StyleProp<ViewStyle>;
}) {
  const colors = useColors();

  return (
    <Pressable
      {...props}
      className="h-[42px] w-[42px] items-center justify-center rounded-full border active:opacity-[0.78] active:scale-[0.98]"
      style={[{ borderColor: colors.border }, style]}
    >
      <Feather name={icon} size={21} color={colors.foreground} />
    </Pressable>
  );
}
