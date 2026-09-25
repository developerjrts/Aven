import {
  TextInput,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
} from 'react-native';

import { useColors } from '@/hooks/useColors';
import { commonStyles } from '@/styles/common';

type InputVariant = 'title' | 'body' | 'code' | 'search';

export function Input({
  style,
  variant = 'body',
  placeholderTextColor,
  ...props
}: TextInputProps & {
  style?: StyleProp<TextStyle>;
  variant?: InputVariant;
}) {
  const colors = useColors();

  const variantStyle =
    variant === 'title'
      ? commonStyles.titleInput
      : variant === 'code'
        ? commonStyles.codeInput
        : variant === 'search'
          ? commonStyles.searchInput
          : commonStyles.bodyInput;

  return (
    <TextInput
      {...props}
      placeholderTextColor={
        placeholderTextColor ?? colors.mutedForeground
      }
      style={[
        commonStyles.input,
        variantStyle,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          color: colors.foreground,
        },
        style,
      ]}
    />
  );
}
