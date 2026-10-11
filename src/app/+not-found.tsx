import { Feather } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { Typography } from "@/components/Typography";
import { useColors } from "@/hooks/useColors";

export default function NotFoundScreen() {
  const colors = useColors();

  return (
    <>
      <Stack.Screen options={{ title: "Page not found" }} />

      <View
        className="flex-1 items-center justify-center px-6"
        style={{ backgroundColor: colors.background }}
      >
        {/* Illustration */}
        <View
          className="mb-8 h-[116px] w-[116px] items-center justify-center rounded-[34px] border"
          style={{
            backgroundColor: colors.secondary,
            borderColor: colors.border,
          }}
        >
          <View
            className="h-[76px] w-[76px] items-center justify-center rounded-[24px]"
            style={{ backgroundColor: colors.card }}
          >
            <Feather name="file-text" size={38} color={colors.primary} />

            <View
              className="absolute -right-1 -top-1 h-8 w-8 items-center justify-center rounded-full border-[3px]"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.secondary,
              }}
            >
              <Feather name="x" size={16} color={colors.destructive} />
            </View>
          </View>
        </View>

        {/* Message */}
        <View className="w-full max-w-[340px] items-center">
          <Typography variant="display" className="text-center">
            Lost a page?
          </Typography>

          <Typography color="mutedForeground" className="mt-3 text-center">
            This note seems to have wandered off. The screen you&apos;re looking
            for doesn&apos;t exist.
          </Typography>
        </View>

        {/* Home action */}
        <Link href="/" asChild>
          <Pressable
            accessibilityRole="button"
            className="mt-8 min-h-[54px] flex-row items-center justify-center gap-3 rounded-2xl px-6 active:opacity-80 active:scale-[0.98]"
            style={{ backgroundColor: colors.primary }}
          >
            <Feather name="home" size={18} color={colors.primaryForeground} />

            <Text
              className="text-base"
              style={{
                color: colors.primaryForeground,
                fontFamily: "Inter_600SemiBold",
              }}
            >
              Back to my notes
            </Text>

            <Feather
              name="arrow-right"
              size={17}
              color={colors.primaryForeground}
            />
          </Pressable>
        </Link>

        {/* Footer branding */}
        <View className="absolute bottom-10 flex-row items-center gap-2">
          <Feather name="edit-3" size={14} color={colors.mutedForeground} />
          <Typography
            variant="caption"
            color="mutedForeground"
            className="tracking-wide"
          >
            Aven Notes
          </Typography>
        </View>
      </View>
    </>
  );
}
