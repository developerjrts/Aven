import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import type { ReactNode } from "react";

import { IconButton } from "@/components/IconButton";
import { Typography } from "@/components/Typography";
import { useColors } from "@/hooks/useColors";

export function FormScreen({
  children,
  onBack,
  title,
  backTestID,
}: {
  children: ReactNode;
  onBack?: () => void;
  title: string;
  backTestID: string;
}) {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = onBack ?? (() => router.back());

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? insets.top : 0}
      >
        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0) + 8,
            paddingBottom:
              insets.bottom + (Platform.OS === "web" ? 34 : 0) + 24,
          }}
        >
          <View className="flex-row items-center justify-between">
            <IconButton
              accessibilityLabel="Go back"
              accessibilityRole="button"
              icon="arrow-left"
              onPress={handleBack}
              testID={backTestID}
            />

            <Typography variant="heading">{title}</Typography>

            <View className="w-[42px]" />
          </View>

          <View className="gap-[10px] pt-[42px]">{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

export function FormLabel({ children }: { children: string }) {
  return (
    <Typography color="mutedForeground" variant="label">
      {children}
    </Typography>
  );
}
