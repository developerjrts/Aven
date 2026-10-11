import { Modal, Pressable, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

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
      <View className="flex-1 items-center justify-center bg-black/30 px-6">
        <View
          className="w-full max-w-[360px] rounded-[22px] border px-5 pb-[18px] pt-[22px]"
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
          }}
        >
          <Text
            className="text-xl font-semibold"
            style={{
              fontFamily: "Inter_600SemiBold",
              color: colors.foreground,
            }}
          >
            {title}
          </Text>

          <Text
            className="mt-2 text-[15px] leading-[22px]"
            style={{
              fontFamily: "Inter_400Regular",
              color: colors.mutedForeground,
            }}
          >
            {message}
          </Text>

          <View className="mt-[22px] flex-row gap-[10px]">
            <Pressable
              accessibilityLabel="Cancel deletion"
              accessibilityRole="button"
              onPress={onCancel}
              className="min-h-[46px] flex-1 items-center justify-center rounded-[13px] border active:opacity-[0.78] active:scale-[0.98]"
              style={{ borderColor: colors.border }}
              testID={cancelTestID}
            >
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  color: colors.foreground,
                }}
              >
                Cancel
              </Text>
            </Pressable>

            <Pressable
              accessibilityLabel="Confirm delete"
              accessibilityRole="button"
              onPress={onConfirm}
              className="min-h-[46px] flex-1 items-center justify-center rounded-[13px] active:opacity-[0.78] active:scale-[0.98]"
              style={{ backgroundColor: colors.destructive }}
              testID={confirmTestID}
            >
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  color: colors.destructiveForeground,
                }}
              >
                Delete
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
