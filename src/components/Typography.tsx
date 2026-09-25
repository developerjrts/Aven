import { Text, type StyleProp, type TextProps, type TextStyle } from 'react-native';

import { useColors } from '@/hooks/useColors';
import { commonStyles } from '@/styles/common';

type TypographyVariant =
  | 'display'
  | 'heading'
  | 'label'
  | 'body'
  | 'muted'
  | 'button'
  | 'caption';
type TypographyColor =
  | 'foreground'
  | 'mutedForeground'
  | 'primary'
  | 'secondaryForeground'
  | 'destructive'
  | 'primaryForeground'
  | 'destructiveForeground';

export function Typography({
  children,
  color = 'foreground',
  style,
  variant = 'body',
  ...props
}: TextProps & {
  color?: TypographyColor;
  variant?: TypographyVariant;
  style?: StyleProp<TextStyle>;
}) {
  const colors = useColors();
  const variantStyles: Record<TypographyVariant, TextStyle> = {
    body: { fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 22 },
    button: commonStyles.buttonText,
    caption: { fontFamily: 'Inter_400Regular', fontSize: 14 },
    display: { fontFamily: 'Inter_700Bold', fontSize: 32, letterSpacing: -1.2 },
    heading: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 19,
      letterSpacing: -0.4,
    },
    label: {
      fontFamily: 'Inter_500Medium',
      fontSize: 13,
      letterSpacing: 0.2,
      marginBottom: 9,
      textTransform: 'uppercase',
    },
    muted: { fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 22 },
  };

  return (
    <Text {...props} style={[variantStyles[variant], { color: colors[color] }, style]}>
      {children}
    </Text>
  );
}