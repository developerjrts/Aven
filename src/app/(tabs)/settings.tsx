import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import { Feather } from '@expo/vector-icons';
import { Platform, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '@/components/Card';
import { Typography } from '@/components/Typography';
import { useTheme } from '@/context/theme';
import { commonStyles } from '@/styles/common';

const DEVELOPER_URL = 'https://instagram.com/devjrts';

export default function SettingsScreen() {
  const { colors, isDarkMode, isThemeLoaded, setDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  const appName = Constants.expoConfig?.name ?? 'Aven';
  const appVersion = Constants.expoConfig?.version ?? 'Unknown';

  const openDeveloperWebsite = () => {
    void Linking.openURL(DEVELOPER_URL);
  };

  return (
    <View style={[commonStyles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0),
            paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 0) + 112,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Typography variant="display">Settings</Typography>
          <View style={[styles.titleRule, { backgroundColor: colors.accent }]} />
        </View>

        <Typography color="mutedForeground" style={styles.intro}>
          Make Aven feel right for you.
        </Typography>

        <Typography color="mutedForeground" variant="label">
          Appearance
        </Typography>
        <Card style={styles.settingCard}>
          <View style={styles.row}>
            <View style={styles.rowCopy}>
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
        <Card style={styles.infoCard}>
          <InfoRow icon="smartphone" label="App name" value={appName} colors={colors} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <InfoRow
            icon="hash"
            label="App version"
            value={appVersion}
            colors={colors}
          />
        </Card>

        <Card style={styles.descriptionCard}>
          <View style={[styles.iconBadge, { backgroundColor: colors.secondary }]}>
            <Feather name="edit-3" size={20} color={colors.primary} />
          </View>
          <Typography variant="heading">Simple by design</Typography>
          <Typography color="mutedForeground" style={styles.description}>
            Aven keeps your notes and code snippets close, organized, and easy to
            revisit. Everything is stored locally on your device.
          </Typography>
        </Card>

        <Typography color="mutedForeground" variant="label">
          Developer
        </Typography>
        <Card
          accessibilityLabel="Open Developer JRTS website"
          accessibilityRole="link"
          onPress={openDeveloperWebsite}
          style={styles.developerCard}
          testID="developer-link"
        >
          <View style={styles.row}>
            <View style={styles.rowCopy}>
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
  colors: ReturnType<typeof useTheme>['colors'];
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={[styles.infoIcon, { backgroundColor: colors.secondary }]}>
        <Feather name={icon} size={17} color={colors.primary} />
      </View>
      <Typography color="mutedForeground" style={styles.infoLabel}>
        {label}
      </Typography>
      <Typography style={styles.infoValue}>{value}</Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 18,
  },
  titleRule: {
    width: 28,
    height: 3,
    borderRadius: 2,
    marginTop: 10,
  },
  intro: {
    marginTop: 18,
    marginBottom: 34,
  },
  settingCard: {
    marginTop: 4,
    marginBottom: 30,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
  },
  rowCopy: {
    flex: 1,
    gap: 4,
  },
  infoCard: {
    marginTop: 4,
    marginBottom: 30,
  },
  infoRow: {
    minHeight: 48,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  infoIcon: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
  },
  infoLabel: {
    flex: 1,
  },
  infoValue: {
    fontFamily: 'Inter_600SemiBold',
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  descriptionCard: {
    marginBottom: 30,
  },
  iconBadge: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    marginBottom: 16,
  },
  description: {
    marginTop: 8,
  },
  developerCard: {
    marginTop: 4,
  },
});