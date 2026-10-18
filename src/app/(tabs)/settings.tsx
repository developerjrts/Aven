import { Feather } from "@expo/vector-icons";
import Constants from "expo-constants";
import * as Linking from "expo-linking";
import { Platform, ScrollView, Switch, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Card } from "@/components/Card";
import { Typography } from "@/components/Typography";
import { useTheme } from "@/context/theme";

const DEVELOPER_URL = "https://instagram.com/devjrts";

const PRIVACY_POLICY_URL =
  "https://developerjrts.github.io/aven-privacy-policy/";

export default function SettingsScreen() {
  const { colors, isDarkMode, isThemeLoaded, setDarkMode } = useTheme();
  const insets = useSafeAreaInsets();

  const appName = Constants.expoConfig?.name ?? "Aven Notes";
  const appVersion = Constants.expoConfig?.version ?? "Unknown";

  const openExternalLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.warn("Could not open link:", error);
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 22,
          paddingTop: insets.top + (Platform.OS === "web" ? 67 : 12),
          paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 0) + 112,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="pt-4">
          <Typography variant="display">Settings</Typography>

          <View
            className="mt-3 h-[3px] w-8 rounded-full"
            style={{ backgroundColor: colors.accent }}
          />

          <Typography color="mutedForeground" className="mb-8 mt-4">
            Make Aven feel right for you.
          </Typography>
        </View>

        {/* Appearance */}
        <SectionTitle>APPEARANCE</SectionTitle>

        <Card style={{ marginTop: 10, marginBottom: 28 }}>
          <View className="flex-row items-center gap-4">
            <IconTile colors={colors} icon="moon" />

            <View className="flex-1 gap-1">
              <Typography variant="heading">Dark mode</Typography>

              <Typography color="mutedForeground" variant="caption">
                A comfortable darker look for your notes.
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

        {/* AI Features */}
        <SectionTitle>AI FEATURES</SectionTitle>

        <Card style={{ marginTop: 10, marginBottom: 28 }}>
          <View className="flex-row items-start gap-3">
            <IconTile colors={colors} icon="zap" />

            <View className="flex-1 gap-1">
              <View className="flex-row flex-wrap items-center gap-2">
                <Typography variant="heading">AI Note Summarizer</Typography>

                <StatusTag colors={colors} label="AVAILABLE" />
              </View>

              <Typography color="mutedForeground" variant="caption">
                Turn lengthy notes into concise summaries, key points, and
                actionable takeaways.
              </Typography>
            </View>
          </View>

          <View
            className="my-4 h-px"
            style={{ backgroundColor: colors.border }}
          />

          <View className="flex-row items-start gap-3">
            <IconTile colors={colors} icon="edit-3" />

            <View className="flex-1 gap-1">
              <View className="flex-row flex-wrap items-center gap-2">
                <Typography variant="heading">AI Note Writing</Typography>

                <StatusTag colors={colors} label="AVAILABLE" />
              </View>

              <Typography color="mutedForeground" variant="caption">
                Get AI assistance to draft, develop, and improve your notes more
                efficiently.
              </Typography>
            </View>
          </View>
        </Card>

        {/* Privacy and Security */}
        <SectionTitle>PRIVACY &amp; SECURITY</SectionTitle>

        <Card style={{ marginTop: 10, marginBottom: 28 }}>
          <View className="flex-row items-start gap-3">
            <IconTile colors={colors} icon="shield" />

            <View className="flex-1 gap-1">
              <Typography variant="heading">Your notes, your device</Typography>

              <Typography color="mutedForeground" variant="caption">
                Your regular notes and code snippets are stored locally on your
                device.
              </Typography>
            </View>
          </View>

          <View
            className="my-4 h-px"
            style={{ backgroundColor: colors.border }}
          />

          <View className="flex-row items-start gap-3">
            <IconTile colors={colors} icon="lock" />

            <View className="flex-1 gap-1">
              <Typography variant="heading">Private Notes</Typography>

              <Typography color="mutedForeground" variant="caption">
                Protect private note content with encryption and device
                authentication.
              </Typography>
            </View>
          </View>

          <Typography
            color="mutedForeground"
            variant="caption"
            className="mt-4"
          >
            AI features may send selected note content to your configured AI
            service for processing. Review the Privacy Policy for details about
            data handling.
          </Typography>
        </Card>

        {/* Legal */}
        <SectionTitle>LEGAL</SectionTitle>

        <Card
          accessibilityLabel="Open Aven Notes Privacy Policy"
          accessibilityRole="link"
          onPress={() => {
            void openExternalLink(PRIVACY_POLICY_URL);
          }}
          style={{ marginTop: 10, marginBottom: 28 }}
          testID="privacy-policy-link"
        >
          <View className="flex-row items-center gap-3">
            <IconTile colors={colors} icon="shield" />

            <View className="flex-1 gap-1">
              <Typography variant="heading">Privacy Policy</Typography>

              <Typography color="mutedForeground" variant="caption">
                Learn how Aven Notes handles your data and privacy.
              </Typography>
            </View>

            <Feather
              name="external-link"
              size={18}
              color={colors.mutedForeground}
            />
          </View>
        </Card>

        {/* About Aven */}
        <SectionTitle>ABOUT AVEN</SectionTitle>

        <Card style={{ marginTop: 10, marginBottom: 28 }}>
          <View className="flex-row items-center gap-3">
            <View
              className="h-12 w-12 items-center justify-center rounded-2xl"
              style={{ backgroundColor: colors.secondary }}
            >
              <Feather name="file-text" size={23} color={colors.primary} />
            </View>

            <View className="flex-1 gap-1">
              <Typography variant="heading">{appName}</Typography>

              <Typography color="mutedForeground" variant="caption">
                Notes, code snippets, and AI-powered productivity.
              </Typography>
            </View>
          </View>

          <View
            className="my-4 h-px"
            style={{ backgroundColor: colors.border }}
          />

          <InfoRow
            icon="smartphone"
            label="App version"
            value={appVersion}
            colors={colors}
          />

          <View
            className="my-3 h-px"
            style={{ backgroundColor: colors.border }}
          />

          <InfoRow
            icon="hard-drive"
            label="Storage"
            value="On-device"
            colors={colors}
          />

          <View
            className="my-3 h-px"
            style={{ backgroundColor: colors.border }}
          />

          <InfoRow
            icon="user-check"
            label="Account"
            value="Not required"
            colors={colors}
          />
        </Card>

        {/* Product philosophy */}
        <Card style={{ marginBottom: 28 }}>
          <View
            className="mb-4 h-[42px] w-[42px] items-center justify-center rounded-2xl"
            style={{ backgroundColor: colors.secondary }}
          >
            <Feather name="feather" size={21} color={colors.primary} />
          </View>

          <Typography variant="heading">Simple by design</Typography>

          <Typography color="mutedForeground" className="mt-2">
            A focused space for capturing ideas, organizing useful code, and
            getting more from your notes without unnecessary clutter.
          </Typography>
        </Card>

        {/* Developer */}
        <SectionTitle>DEVELOPER</SectionTitle>

        <Card
          accessibilityLabel="Open Developer JRTS Instagram profile"
          accessibilityRole="link"
          onPress={() => {
            void openExternalLink(DEVELOPER_URL);
          }}
          style={{ marginTop: 10 }}
          testID="developer-link"
        >
          <View className="flex-row items-center gap-4">
            <View
              className="h-11 w-11 items-center justify-center rounded-2xl"
              style={{ backgroundColor: colors.secondary }}
            >
              <Feather name="user" size={21} color={colors.primary} />
            </View>

            <View className="flex-1 gap-1">
              <Typography variant="heading">Developer JRTS</Typography>

              <Typography color="mutedForeground" variant="caption">
                Follow the developer on Instagram.
              </Typography>
            </View>

            <Feather
              name="external-link"
              size={18}
              color={colors.mutedForeground}
            />
          </View>
        </Card>

        <Typography
          color="mutedForeground"
          variant="caption"
          className="mt-6 text-center"
        >
          Made with care for ideas worth keeping.
        </Typography>
      </ScrollView>
    </View>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <Typography
      color="mutedForeground"
      variant="label"
      style={{ letterSpacing: 1.2 }}
    >
      {children}
    </Typography>
  );
}

function IconTile({
  colors,
  icon,
}: {
  colors: ReturnType<typeof useTheme>["colors"];
  icon: keyof typeof Feather.glyphMap;
}) {
  return (
    <View
      className="h-10 w-10 items-center justify-center rounded-[14px]"
      style={{ backgroundColor: colors.secondary }}
    >
      <Feather name={icon} size={19} color={colors.primary} />
    </View>
  );
}

function StatusTag({
  colors,
  label,
}: {
  colors: ReturnType<typeof useTheme>["colors"];
  label: string;
}) {
  return (
    <View
      className="rounded-full px-2 py-1"
      style={{ backgroundColor: colors.secondary }}
    >
      <Typography
        variant="caption"
        style={{
          color: colors.primary,
          fontSize: 9,
          fontWeight: "700",
          letterSpacing: 0.5,
        }}
      >
        {label}
      </Typography>
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
    <View className="min-h-10 flex-row items-center gap-3">
      <Feather name={icon} size={17} color={colors.mutedForeground} />

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
