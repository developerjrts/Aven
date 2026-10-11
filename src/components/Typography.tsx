import {
  Text,
  type StyleProp,
  type TextProps,
  type TextStyle,
} from "react-native";

import { useColors } from "@/hooks/useColors";

type TypographyVariant =
  | "display"
  | "heading"
  | "label"
  | "body"
  | "muted"
  | "button"
  | "caption";

type TypographyColor =
  | "foreground"
  | "mutedForeground"
  | "primary"
  | "secondaryForeground"
  | "destructive"
  | "primaryForeground"
  | "destructiveForeground";

const variantClasses: Record<TypographyVariant, string> = {
  body: "text-[15px] leading-[22px]",
  button: "text-base font-semibold",
  caption: "text-sm",
  display: "text-[32px] tracking-[-1.2px]",
  heading: "text-[19px] tracking-[-0.4px] font-semibold",
  label: "mb-[9px] text-[13px] tracking-[0.2px] font-medium uppercase",
  muted: "text-[15px] leading-[22px]",
};

const variantFonts: Record<TypographyVariant, string> = {
  body: "Inter_400Regular",
  button: "Inter_600SemiBold",
  caption: "Inter_400Regular",
  display: "Inter_700Bold",
  heading: "Inter_600SemiBold",
  label: "Inter_500Medium",
  muted: "Inter_400Regular",
};

export function Typography({
  children,
  className,
  color = "foreground",
  style,
  variant = "body",
  ...props
}: TextProps & {
  className?: string;
  color?: TypographyColor;
  variant?: TypographyVariant;
  style?: StyleProp<TextStyle>;
}) {
  const colors = useColors();

  return (
    <Text
      {...props}
      className={`${variantClasses[variant]} ${className ?? ""}`.trim()}
      style={[
        {
          fontFamily: variantFonts[variant],
          color: colors[color],
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
