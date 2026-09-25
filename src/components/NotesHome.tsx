import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { RichTextPreview } from '@/components/RichTextPreview';
import { Typography } from '@/components/Typography';
import { useNotes } from '@/context/notes';
import { useColors } from '@/hooks/useColors';
import { commonStyles } from '@/styles/common';

export default function NotesHome() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { notes } = useNotes();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const orderedNotes = useMemo(
    () =>
      [...notes].sort(
        (firstNote, secondNote) =>
          Number(secondNote.pinned) - Number(firstNote.pinned),
      ),
    [notes],
  );
  const filteredNotes = useMemo(() => {
    if (!normalizedSearchQuery) {
      return orderedNotes;
    }

    return orderedNotes.filter(
      (note) =>
        note.title.toLowerCase().includes(normalizedSearchQuery) ||
        note.content.toLowerCase().includes(normalizedSearchQuery),
    );
  }, [normalizedSearchQuery, orderedNotes]);

  const openNote = (id: string) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({ pathname: '/edit-note', params: { id } });
  };

  const openNewNote = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/new-note');
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0),
          paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 0),
        },
      ]}
    >
      <View style={styles.header}>
        <Typography variant="display">Notes</Typography>
        <View style={[styles.titleRule, { backgroundColor: colors.accent }]} />
      </View>

      <View
        style={[
          commonStyles.searchBar,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Feather name="search" size={19} color={colors.mutedForeground} />
        <Input
          accessibilityLabel="Search notes"
          autoCapitalize="none"
          onChangeText={setSearchQuery}
          placeholder="Search notes"
          returnKeyType="search"
          testID="search-notes-input"
          value={searchQuery}
          variant="search"
        />
        {searchQuery.length > 0 && (
          <Pressable
            accessibilityLabel="Clear search"
            accessibilityRole="button"
            onPress={() => setSearchQuery('')}
            style={styles.clearSearchButton}
            testID="clear-search-button"
          >
            <Feather name="x" size={18} color={colors.mutedForeground} />
          </Pressable>
        )}
      </View>

      {notes.length === 0 ? (
        <EmptyState
          icon="file-text"
          message="No notes yet"
        />
      ) : filteredNotes.length === 0 ? (
        <EmptyState
          icon="search"
          message="No notes match your search"
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.notesList}
          showsVerticalScrollIndicator={false}
        >
          {filteredNotes.map((note) => (
            <Card
              key={note.id}
              accessibilityLabel={`Edit ${note.title}`}
              onPress={() => openNote(note.id)}
              testID={`edit-note-${note.id}`}
            >
              <View style={commonStyles.cardHeader}>
                <Typography style={commonStyles.cardTitle}>
                  {note.title}
                </Typography>
                {note.pinned && (
                  <Feather name="bookmark" size={17} color={colors.primary} />
                )}
              </View>
              <RichTextPreview
                numberOfLines={3}
                style={styles.noteContent}
                value={note.content}
              />
            </Card>
          ))}
        </ScrollView>
      )}

      <Pressable
        accessibilityLabel="Create a new note"
        accessibilityRole="button"
        onPress={openNewNote}
        style={({ pressed }) => [
          styles.fab,
          { backgroundColor: colors.primary },
          pressed && styles.fabPressed,
        ]}
        testID="new-note-button"
      >
        <Feather name="plus" size={28} color={colors.primaryForeground} />
      </Pressable>
    </View>
  );
}

function EmptyState({
  icon,
  message,
}: {
  icon: 'file-text' | 'search';
  message: string;
}) {
  const colors = useColors();

  return (
    <View style={commonStyles.emptyState}>
      <View
        style={[
          commonStyles.emptyIcon,
          { backgroundColor: colors.secondary, borderColor: colors.border },
        ]}
      >
        <Feather name={icon} size={28} color={colors.primary} />
      </View>
      <Typography variant="heading">{message}</Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24 },
  header: { paddingTop: 14 },
  titleRule: { width: 28, height: 3, borderRadius: 2, marginTop: 10 },
  clearSearchButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notesList: { paddingTop: 30, paddingBottom: 120, gap: 12 },
  noteContent: {
    marginTop: 7,
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
  fabPressed: { opacity: 0.78, transform: [{ scale: 0.95 }] },
});