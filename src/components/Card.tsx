import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import type { ReactNode } from 'react';

import { useColors } from '@/hooks/useColors';
import { commonStyles } from '@/styles/common';

export function Card({
  children,
  onPress,
  style,
  ...props
}: Omit<PressableProps, 'style'> & {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const colors = useColors();

  return (
    <Pressable
      {...props}
      onPress={onPress}
      style={({ pressed }) => [
        commonStyles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
        onPress && pressed && commonStyles.pressed,
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}