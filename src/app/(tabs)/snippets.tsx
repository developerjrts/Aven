import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
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
import { commonStyles } from '@/styles/common';

export const LANGUAGE_LABELS: Record<
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

export default function SnippetsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { snippets } = useSnippets();

  const orderedSnippets = useMemo(
    () =>
      [...snippets].sort(
        (firstSnippet, secondSnippet) =>
          Number(secondSnippet.pinned) -
          Number(firstSnippet.pinned),
      ),
    [snippets],
  );

  const openSnippet = (id: string) => {
    void Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle.Light,
    );

    router.push({
      pathname: '/view-snippet',
      params: { id },
    });
  };

  const openNewSnippet = () => {
    void Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle.Light,
    );

    router.push('/new-snippet');
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop:
            insets.top +
            (Platform.OS === 'web' ? 67 : 0),
          paddingBottom:
            insets.bottom +
            (Platform.OS === 'web' ? 34 : 0),
        },
      ]}
    >
      <View style={styles.header}>
        <Typography variant="display">
          Snippets
        </Typography>

        <View
          style={[
            styles.titleRule,
            {
              backgroundColor: colors.accent,
            },
          ]}
        />
      </View>

      {orderedSnippets.length === 0 ? (
        <View style={commonStyles.emptyState}>
          <View
            style={[
              commonStyles.emptyIcon,
              {
                backgroundColor: colors.secondary,
                borderColor: colors.border,
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
            No snippets yet
          </Typography>

          <Typography
            color="mutedForeground"
            variant="caption"
          >
            Save useful code for later.
          </Typography>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.snippetsList}
          showsVerticalScrollIndicator={false}
        >
          {orderedSnippets.map((snippet) => (
            <Card
              key={snippet.id}
              accessibilityLabel={`Edit ${snippet.title}`}
              onPress={() => openSnippet(snippet.id)}
              testID={`edit-snippet-${snippet.id}`}
            >
              <View style={commonStyles.cardHeader}>
                <Typography
                  numberOfLines={1}
                  style={commonStyles.cardTitle}
                >
                  {snippet.title}
                </Typography>

                {snippet.pinned && (
                  <Feather
                    name="bookmark"
                    size={17}
                    color={colors.primary}
                  />
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
                {LANGUAGE_LABELS[snippet.language]}
              </Text>

              <CodeBlock
              code={snippet.code}
              language={snippet.language}
              languageLabel={LANGUAGE_LABELS[snippet.language]}
              numberOfLines={6}
              />
            </Card>
          ))}
        </ScrollView>
      )}

      <Pressable
        accessibilityLabel="Add a new snippet"
        accessibilityRole="button"
        onPress={openNewSnippet}
        style={({ pressed }) => [
          styles.fab,
          {
            backgroundColor: colors.primary,
          },
          pressed && styles.fabPressed,
        ]}
        testID="new-snippet-button"
      >
        <Feather
          name="plus"
          size={28}
          color={colors.primaryForeground}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },

  header: {
    paddingTop: 14,
  },

  titleRule: {
    width: 28,
    height: 3,
    borderRadius: 2,
    marginTop: 10,
  },

  snippetsList: {
    paddingTop: 30,
    paddingBottom: 150,
    gap: 12,
  },

  language: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    letterSpacing: 0.4,
    marginTop: 8,
    textTransform: 'uppercase',
  },

  fab: {
    position: 'absolute',
    right: 24,
    bottom: 84,
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 29,
    elevation: 5,
  },

  fabPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.95 }],
  },
});
