import Constants from "expo-constants";
import * as Linking from "expo-linking";
import { Feather } from "@expo/vector-icons";
import { Platform, ScrollView, Switch, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Card } from "@/components/Card";
import { Typography } from "@/components/Typography";
import { useTheme } from "@/context/theme";

const DEVELOPER_URL = "https://instagram.com/devjrts";

export default function SettingsScreen() {
  const { colors, isDarkMode, isThemeLoaded, setDarkMode } = useTheme();
  const insets = useSafeAreaInsets();

  const appName = Constants.expoConfig?.name ?? "Aven";
  const appVersion = Constants.expoConfig?.version ?? "Unknown";

  const openDeveloperWebsite = () => {
    void Linking.openURL(DEVELOPER_URL);
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0),
          paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 0) + 112,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="pt-[18px]">
          <Typography variant="display">Settings</Typography>
          <View
            className="mt-[10px] h-[3px] w-7 rounded-sm"
            style={{ backgroundColor: colors.accent }}
          />
        </View>

        <Typography color="mutedForeground" className="mb-[34px] mt-[18px]">
          Make Aven feel right for you.
        </Typography>

        <Typography color="mutedForeground" variant="label">
          Appearance
        </Typography>

        <Card style={{ marginTop: 4, marginBottom: 30 }}>
          <View className="flex-row items-center gap-4">
            <View className="flex-1 gap-1">
              <Typography variant="heading">Dark mode</Typography>
              <Typography color="mutedForeground" variant="caption">
                Use a darker color palette throughout the app.
              </Typography>
            </View>

            <Switch
              accessibilityLabel="Dark mode"
              disabled={!isThemeLoaded}
              onValueChange={setDarkMode}
              testID="dark-mode-toggle"
              trackColor={{
                false: colors.border,
                true: colors.primary,
              }}
              thumbColor={colors.primaryForeground}
              value={isDarkMode}
            />
          </View>
        </Card>

        <Typography color="mutedForeground" variant="label">
          About Aven
        </Typography>

        <Card style={{ marginTop: 4, marginBottom: 30 }}>
          <InfoRow
            icon="smartphone"
            label="App name"
            value={appName}
            colors={colors}
          />

          <View
            className="my-2 h-px"
            style={{ backgroundColor: colors.border }}
          />

          <InfoRow
            icon="hash"
            label="App version"
            value={appVersion}
            colors={colors}
          />
        </Card>

        <Card style={{ marginBottom: 30 }}>
          <View
            className="mb-4 h-[42px] w-[42px] items-center justify-center rounded-[14px]"
            style={{ backgroundColor: colors.secondary }}
          >
            <Feather name="edit-3" size={20} color={colors.primary} />
          </View>

          <Typography variant="heading">Simple by design</Typography>

          <Typography color="mutedForeground" className="mt-2">
            Aven keeps your notes and code snippets close, organized, and easy
            to revisit. Everything is stored locally on your device.
          </Typography>
        </Card>

        <Typography color="mutedForeground" variant="label">
          Developer
        </Typography>

        <Card
          accessibilityLabel="Open Developer JRTS website"
          accessibilityRole="link"
          onPress={openDeveloperWebsite}
          style={{ marginTop: 4 }}
          testID="developer-link"
        >
          <View className="flex-row items-center gap-4">
            <View className="flex-1 gap-1">
              <Typography variant="heading">Developer JRTS</Typography>
              <Typography color="mutedForeground" variant="caption">
                Instagram
              </Typography>
            </View>

            <Feather name="external-link" size={20} color={colors.primary} />
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

function InfoRow({
  colors,
  icon,
  label,
  value,
}: {
  colors: ReturnType<typeof useTheme>["colors"];
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View className="min-h-12 flex-row items-center gap-3">
      <View
        className="h-[34px] w-[34px] items-center justify-center rounded-[11px]"
        style={{ backgroundColor: colors.secondary }}
      >
        <Feather name={icon} size={17} color={colors.primary} />
      </View>

      <View className="flex-1">
        <Typography color="mutedForeground">{label}</Typography>
      </View>

      <Typography
        className="font-semibold"
        style={{ fontFamily: "Inter_600SemiBold" }}
      >
        {value}
      </Typography>
    </View>
  );
}
