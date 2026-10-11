import {
  TextInput,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
} from "react-native";

import { useColors } from "@/hooks/useColors";

type InputVariant = "title" | "body" | "code" | "search";

export function Input({
  style,
  variant = "body",
  placeholderTextColor,
  ...props
}: TextInputProps & {
  style?: StyleProp<TextStyle>;
  variant?: InputVariant;
}) {
  const colors = useColors();

  const variantClassName =
    variant === "title"
      ? "min-h-[56px] text-lg mb-[26px] font-medium px-4 rounded-2xl border"
      : variant === "code"
        ? "min-h-[250px] text-[15px] leading-[22px] pt-4 mb-[26px] font-mono px-4 rounded-2xl border"
        : variant === "search"
          ? "flex-1 border-0 text-[15px] px-[10px] py-0"
          : "min-h-[190px] text-base leading-6 pt-4 mb-[26px] px-4 rounded-2xl border";

  const fontFamily =
    variant === "title"
      ? "Inter_500Medium"
      : variant === "body"
        ? "Inter_400Regular"
        : variant === "search"
          ? "Inter_400Regular"
          : undefined;

  return (
    <TextInput
      {...props}
      placeholderTextColor={placeholderTextColor ?? colors.mutedForeground}
      className={variantClassName}
      style={[
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          color: colors.foreground,
          ...(fontFamily ? { fontFamily } : {}),
        },
        style,
      ]}
    />
  );
}
