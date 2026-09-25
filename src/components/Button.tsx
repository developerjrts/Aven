import { Feather } from '@expo/vector-icons';
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Typography } from '@/components/Typography';
import { useColors } from '@/hooks/useColors';
import { commonStyles } from '@/styles/common';

type ButtonVariant = 'primary' | 'secondary' | 'destructive';

export function Button({
  children,
  disabled = false,
  icon,
  style,
  variant = 'primary',
  ...props
}: Omit<PressableProps, 'style'> & {
  children: string;
  disabled?: boolean;
  icon?: keyof typeof Feather.glyphMap;
  style?: StyleProp<ViewStyle>;
  variant?: ButtonVariant;
}) {
  const colors = useColors();
  const backgroundColor =
    variant === 'primary'
      ? disabled
        ? colors.secondary
        : colors.primary
      : variant === 'secondary'
        ? colors.secondary
        : 'transparent';
  const textColor =
    variant === 'primary'
      ? disabled
        ? colors.mutedForeground
        : colors.primaryForeground
      : variant === 'secondary'
        ? colors.primary
        : colors.destructive;
  const iconColor = textColor;

  return (
    <Pressable
      {...props}
      disabled={disabled}
      style={({ pressed }) => [
        commonStyles.button,
        { backgroundColor },
        variant === 'destructive' && { borderColor: colors.destructive, borderWidth: 1 },
        pressed && !disabled && commonStyles.pressed,
        style,
      ]}
    >
      {icon && <Feather name={icon} size={17} color={iconColor} />}
      <Typography color="foreground" style={[commonStyles.buttonText, { color: textColor }]}>
        {children}
      </Typography>
    </Pressable>
  );
}