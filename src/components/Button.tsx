import { Feather } from "@expo/vector-icons";
import { Pressable, type PressableProps } from "react-native";

import { Typography } from "@/components/Typography";
import { useColors } from "@/hooks/useColors";

type ButtonVariant = "primary" | "secondary" | "destructive";

export function Button({
  children,
  disabled = false,
  icon,
  style,
  variant = "primary",
  ...props
}: Omit<PressableProps, "style"> & {
  children: string;
  disabled?: boolean;
  icon?: keyof typeof Feather.glyphMap;
  style?: PressableProps["style"];
  variant?: ButtonVariant;
}) {
  const colors = useColors();

  const backgroundColor =
    variant === "primary"
      ? disabled
        ? colors.secondary
        : colors.primary
      : variant === "secondary"
        ? colors.secondary
        : "transparent";

  const textColor =
    variant === "primary"
      ? disabled
        ? colors.mutedForeground
        : colors.primaryForeground
      : variant === "secondary"
        ? colors.primary
        : colors.destructive;

  return (
    <Pressable
      {...props}
      disabled={disabled}
      className={[
        "min-h-[54px] flex-row items-center justify-center gap-2 rounded-2xl px-[18px]",
        "active:opacity-[0.78] active:scale-[0.98]",
        disabled ? "" : "",
      ].join(" ")}
      style={[
        {
          backgroundColor,
          ...(variant === "destructive"
            ? {
                borderColor: colors.destructive,
                borderWidth: 1,
              }
            : {}),
        },
        style as never,
      ]}
    >
      {icon && <Feather name={icon} size={17} color={textColor} />}

      <Typography
        color="foreground"
        className="text-base font-semibold"
        style={{ color: textColor }}
      >
        {children}
      </Typography>
    </Pressable>
  );
}
