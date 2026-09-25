import { Modal, Pressable, Text, View } from 'react-native';

import { useColors } from '@/hooks/useColors';
import { commonStyles } from '@/styles/common';

export function ConfirmDialog({
  cancelTestID,
  confirmTestID,
  message,
  onCancel,
  onConfirm,
  title,
  visible,
}: {
  cancelTestID: string;
  confirmTestID: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  visible: boolean;
}) {
  const colors = useColors();

  return (
    <Modal
      animationType="fade"
      onRequestClose={onCancel}
      transparent
      visible={visible}
    >
      <View style={commonStyles.dialogOverlay}>
        <View
          style={[
            commonStyles.dialog,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[commonStyles.dialogTitle, { color: colors.foreground }]}>
            {title}
          </Text>
          <Text
            style={[
              commonStyles.dialogMessage,
              { color: colors.mutedForeground },
            ]}
          >
            {message}
          </Text>
          <View style={commonStyles.dialogActions}>
            <Pressable
              accessibilityLabel="Cancel deletion"
              accessibilityRole="button"
              onPress={onCancel}
              style={({ pressed }) => [
                commonStyles.dialogAction,
                commonStyles.dialogCancelAction,
                { borderColor: colors.border },
                pressed && commonStyles.pressed,
              ]}
              testID={cancelTestID}
            >
              <Text style={{ color: colors.foreground }}>Cancel</Text>
            </Pressable>
            <Pressable
              accessibilityLabel="Confirm delete"
              accessibilityRole="button"
              onPress={onConfirm}
              style={({ pressed }) => [
                commonStyles.dialogAction,
                { backgroundColor: colors.destructive },
                pressed && commonStyles.pressed,
              ]}
              testID={confirmTestID}
            >
              <Text style={{ color: colors.destructiveForeground }}>Delete</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}