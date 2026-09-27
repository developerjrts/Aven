import { Feather } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '@/components/Card';
import { CodeBlock } from '@/components/CodeBlock';
import { Typography } from '@/components/Typography';

import {
  type Snippet,
  useSnippets,
} from '@/context/snippets';

import { useColors } from '@/hooks/useColors';

const LANGUAGE_LABELS: Record<
  Snippet['language'],
  string
> = {
  bash: 'Bash',
  javascript: 'JavaScript',
  json: 'JSON',
  plaintext: 'Plain text',
  python: 'Python',
  typescript: 'TypeScript',
};

export default function ViewSnippet() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const { snippets } = useSnippets();

  const [copied, setCopied] = useState(false);

  const snippet = useMemo(
    () =>
      snippets.find(
        (item) => item.id === id,
      ),
    [snippets, id],
  );

  const goBack = () => {
    void Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle.Light,
    );

    router.back();
  };

  const openEdit = () => {
    if (!snippet) {
      return;
    }

    void Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle.Light,
    );

    router.push({
      pathname: '/edit-snippet',
      params: {
        id: snippet.id,
      },
    });
  };

  const copySnippet = async () => {
    if (!snippet) {
      return;
    }

    await Clipboard.setStringAsync(
      snippet.code,
    );

    void Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success,
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  if (!snippet) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor:
              colors.background,
            paddingTop:
              insets.top +
              (Platform.OS === 'web'
                ? 67
                : 0),
            paddingBottom:
              insets.bottom +
              (Platform.OS === 'web'
                ? 34
                : 0),
          },
        ]}
      >
        <View style={styles.topBar}>
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            onPress={goBack}
            style={({ pressed }) => [
              styles.iconButton,
              {
                borderColor:
                  colors.border,
                backgroundColor:
                  colors.secondary,
              },
              pressed &&
                styles.pressed,
            ]}
          >
            <Feather
              name="arrow-left"
              size={20}
              color={colors.foreground}
            />
          </Pressable>
        </View>

        <View style={styles.emptyState}>
          <View
            style={[
              styles.emptyIcon,
              {
                backgroundColor:
                  colors.secondary,
                borderColor:
                  colors.border,
              },
            ]}
          >
            <Feather
              name="code"
              size={28}
              color={colors.primary}
            />
          </View>

          <Typography variant="heading">
            Snippet not found
          </Typography>

          <Typography
            color="mutedForeground"
            variant="caption"
          >
            This snippet may have been
            deleted.
          </Typography>
        </View>
      </View>
    );
  }

  const languageLabel =
    LANGUAGE_LABELS[snippet.language];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            colors.background,
          paddingTop:
            insets.top +
            (Platform.OS === 'web'
              ? 67
              : 0),
          paddingBottom:
            insets.bottom +
            (Platform.OS === 'web'
              ? 34
              : 0),
        },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            onPress={goBack}
            style={({ pressed }) => [
              styles.iconButton,
              {
                borderColor:
                  colors.border,
                backgroundColor:
                  colors.secondary,
              },
              pressed &&
                styles.pressed,
            ]}
          >
            <Feather
              name="arrow-left"
              size={20}
              color={colors.foreground}
            />
          </Pressable>

          <View style={styles.topBarTitle}>
            <Typography variant="heading">
              Snippet
            </Typography>

            <View
              style={[
                styles.titleRule,
                {
                  backgroundColor:
                    colors.accent,
                },
              ]}
            />
          </View>

          <Pressable
            accessibilityLabel="Edit snippet"
            accessibilityRole="button"
            onPress={openEdit}
            style={({ pressed }) => [
              styles.editButton,
              {
                borderColor:
                  colors.border,
                backgroundColor:
                  colors.secondary,
              },
              pressed &&
                styles.pressed,
            ]}
          >
            <Feather
              name="edit-2"
              size={16}
              color={colors.primary}
            />

            <Text
              style={[
                styles.editText,
                {
                  color:
                    colors.primary,
                },
              ]}
            >
              Edit
            </Text>
          </Pressable>
        </View>

        {/* Snippet Information */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Typography
              variant="display"
              numberOfLines={3}
              style={styles.snippetTitle}
            >
              {snippet.title}
            </Typography>

            {snippet.pinned && (
              <View
                style={[
                  styles.pinBadge,
                  {
                    backgroundColor:
                      colors.secondary,
                    borderColor:
                      colors.border,
                  },
                ]}
              >
                <Feather
                  name="bookmark"
                  size={15}
                  color={colors.primary}
                />

                <Text
                  style={[
                    styles.pinText,
                    {
                      color:
                        colors.primary,
                    },
                  ]}
                >
                  Pinned
                </Text>
              </View>
            )}
          </View>

          <Text
            style={[
              styles.language,
              {
                color: colors.primary,
              },
            ]}
          >
            {languageLabel}
          </Text>
        </View>

        {/* Code Card */}
        <Card>
          <View style={styles.codeHeader}>
            <View
              style={styles.codeHeaderLeft}
            >
              <Feather
                name="terminal"
                size={16}
                color={colors.primary}
              />

              <Text
                style={[
                  styles.codeLabel,
                  {
                    color:
                      colors.foreground,
                  },
                ]}
              >
                {languageLabel}
              </Text>
            </View>

            <Pressable
              accessibilityLabel={
                copied
                  ? 'Snippet copied'
                  : 'Copy snippet'
              }
              accessibilityRole="button"
              onPress={copySnippet}
              style={({ pressed }) => [
                styles.copyButton,
                {
                  borderColor:
                    colors.border,
                  backgroundColor:
                    colors.secondary,
                },
                pressed &&
                  styles.pressed,
              ]}
            >
              <Feather
                name={
                  copied
                    ? 'check'
                    : 'copy'
                }
                size={15}
                color={
                  copied
                    ? colors.primary
                    : colors.foreground
                }
              />

              <Text
                style={[
                  styles.copyText,
                  {
                    color: copied
                      ? colors.primary
                      : colors.foreground,
                  },
                ]}
              >
                {copied
                  ? 'Copied'
                  : 'Copy'}
              </Text>
            </Pressable>
          </View>

          <View style={styles.codeContainer}>
            <CodeBlock
              code={snippet.code}
              language={snippet.language}
              languageLabel={languageLabel}
            />
          </View>
        </Card>

        {/* Snippet Details */}
        <View
          style={[
            styles.detailsCard,
            {
              backgroundColor:
                colors.secondary,
              borderColor:
                colors.border,
            },
          ]}
        >
          <View style={styles.detailRow}>
            <View
              style={styles.detailLabel}
            >
              <Feather
                name="code"
                size={15}
                color={
                  colors.mutedForeground
                }
              />

              <Text
                style={[
                  styles.detailText,
                  {
                    color:
                      colors.mutedForeground,
                  },
                ]}
              >
                Language
              </Text>
            </View>

            <Text
              style={[
                styles.detailValue,
                {
                  color:
                    colors.foreground,
                },
              ]}
            >
              {languageLabel}
            </Text>
          </View>

          <View
            style={[
              styles.detailDivider,
              {
                backgroundColor:
                  colors.border,
              },
            ]}
          />

          <View style={styles.detailRow}>
            <View
              style={styles.detailLabel}
            >
              <Feather
                name="bookmark"
                size={15}
                color={
                  colors.mutedForeground
                }
              />

              <Text
                style={[
                  styles.detailText,
                  {
                    color:
                      colors.mutedForeground,
                  },
                ]}
              >
                Status
              </Text>
            </View>

            <Text
              style={[
                styles.detailValue,
                {
                  color:
                    colors.foreground,
                },
              ]}
            >
              {snippet.pinned
                ? 'Pinned'
                : 'Not pinned'}
            </Text>
          </View>
        </View>

        {/* Bottom Edit Button */}
        <Pressable
          accessibilityLabel="Edit this snippet"
          accessibilityRole="button"
          onPress={openEdit}
          style={({ pressed }) => [
            styles.bottomButton,
            {
              backgroundColor:
                colors.primary,
            },
            pressed &&
              styles.bottomButtonPressed,
          ]}
        >
          <Feather
            name="edit-2"
            size={17}
            color={
              colors.primaryForeground
            }
          />

          <Text
            style={[
              styles.bottomButtonText,
              {
                color:
                  colors.primaryForeground,
              },
            ]}
          >
            Edit Snippet
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },

  content: {
    paddingBottom: 40,
  },

  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 14,
    paddingBottom: 22,
  },

  topBarTitle: {
    alignItems: 'center',
    flex: 1,
  },

  titleRule: {
    borderRadius: 2,
    height: 3,
    marginTop: 7,
    width: 24,
  },

  iconButton: {
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },

  editButton: {
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },

  editText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },

  pressed: {
    opacity: 0.7,
    transform: [
      {
        scale: 0.96,
      },
    ],
  },

  header: {
    paddingBottom: 22,
  },

  titleRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },

  snippetTitle: {
    flex: 1,
  },

  pinBadge: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },

  pinText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
  },

  language: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    letterSpacing: 0.6,
    marginTop: 9,
    textTransform: 'uppercase',
  },

  codeHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  codeHeaderLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 7,
  },

  codeLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },

  copyButton: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  copyText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
  },

  codeContainer: {
    marginHorizontal: -4,
  },

  detailsCard: {
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 14,
    paddingHorizontal: 14,
  },

  detailRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 48,
  },

  detailLabel: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },

  detailText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
  },

  detailValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },

  detailDivider: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
  },

  bottomButton: {
    alignItems: 'center',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginTop: 18,
    minHeight: 50,
  },

  bottomButtonPressed: {
    opacity: 0.8,
    transform: [
      {
        scale: 0.98,
      },
    ],
  },

  bottomButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },

  emptyState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 80,
  },

  emptyIcon: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    height: 64,
    justifyContent: 'center',
    marginBottom: 18,
    width: 64,
  },
});
