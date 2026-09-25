import { Feather } from '@expo/vector-icons';
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useColors } from '@/hooks/useColors';
import { commonStyles } from '@/styles/common';

export function IconButton({
  icon,
  style,
  ...props
}: Omit<PressableProps, 'style'> & {
  icon: keyof typeof Feather.glyphMap;
  style?: StyleProp<ViewStyle>;
}) {
  const colors = useColors();

  return (
    <Pressable
      {...props}
      style={({ pressed }) => [
        commonStyles.backButton,
        { borderColor: colors.border },
        pressed && commonStyles.pressed,
        style,
      ]}
    >
      <Feather name={icon} size={21} color={colors.foreground} />
    </Pressable>
  );
}
