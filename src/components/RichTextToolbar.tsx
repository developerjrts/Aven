import { Pressable, View } from 'react-native';

import { Typography } from '@/components/Typography';
import { useColors } from '@/hooks/useColors';
import { commonStyles } from '@/styles/common';

export type RichTextAction = 'bold' | 'italic' | 'underline' | 'bullet';

const actions: Array<{
  action: RichTextAction;
  label: string;
  accessibilityLabel: string;
}> = [
  { action: 'bold', label: 'B', accessibilityLabel: 'Bold' },
  { action: 'italic', label: 'I', accessibilityLabel: 'Italic' },
  { action: 'underline', label: 'U', accessibilityLabel: 'Underline' },
  { action: 'bullet', label: '•', accessibilityLabel: 'Bullet list' },
];

export function RichTextToolbar({
  onAction,
}: {
  onAction: (action: RichTextAction) => void;
}) {
  const colors = useColors();

  return (
    <View
      accessibilityRole="toolbar"
      style={[
        commonStyles.richToolbar,
        { backgroundColor: colors.secondary, borderBottomColor: colors.border },
      ]}
    >
      {actions.map(({ accessibilityLabel, action, label }) => (
        <Pressable
          key={action}
          accessibilityLabel={accessibilityLabel}
          accessibilityRole="button"
          onPress={() => onAction(action)}
          style={({ pressed }) => [
            commonStyles.richToolbarButton,
            pressed && commonStyles.richToolbarButtonPressed,
          ]}
          testID={`rich-text-${action}-button`}
        >
          <Typography
            style={[
              commonStyles.richToolbarLabel,
              action === 'italic' && commonStyles.richToolbarItalic,
              action === 'underline' && commonStyles.richToolbarUnderline,
            ]}
          >
            {label}
          </Typography>
        </Pressable>
      ))}
    </View>
  );
}