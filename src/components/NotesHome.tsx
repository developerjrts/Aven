import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Platform, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { RichTextPreview } from "@/components/RichTextPreview";
import { Typography } from "@/components/Typography";
import { useNotes } from "@/context/notes";
import { useColors } from "@/hooks/useColors";

export default function NotesHome() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { notes } = useNotes();

  const [searchQuery, setSearchQuery] = useState("");

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  // Show only regular notes. Private notes remain stored locally.
  const orderedNotes = useMemo(
    () =>
      [...notes]
        .filter((note) => !note.private)
        .sort(
          (firstNote, secondNote) =>
            Number(secondNote.pinned) - Number(firstNote.pinned),
        ),
    [notes],
  );

  // Search only regular notes.
  const filteredNotes = useMemo(() => {
    if (!normalizedSearchQuery) {
      return orderedNotes;
    }

    return orderedNotes.filter(
      (note) =>
        (note.title ?? "").toLowerCase().includes(normalizedSearchQuery) ||
        (note.content ?? "").toLowerCase().includes(normalizedSearchQuery),
    );
  }, [normalizedSearchQuery, orderedNotes]);

  // Navigate to the new-note screen.
  const openNewNote = () => {
    router.push("/new-note");
  };

  // Open the selected regular note.
  const openNote = (id: string) => {
    router.push({
      pathname: "/view-note",
      params: { id },
    });
  };

  return (
    <View
      className="flex-1 px-6"
      style={{
        backgroundColor: colors.background,
        paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0),
        paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 0),
      }}
    >
      {/* Header */}
      <View className="pt-[14px]">
        <Typography variant="display">Notes</Typography>

        <View
          className="mt-[10px] h-[3px] w-7 rounded-sm"
          style={{ backgroundColor: colors.accent }}
        />
      </View>

      {/* Search */}
      <View
        className="mt-6 min-h-[50px] flex-row items-center rounded-[15px] border px-[14px]"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
        }}
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
            onPress={() => setSearchQuery("")}
            className="h-[30px] w-[30px] items-center justify-center"
            testID="clear-search-button"
          >
            <Feather name="x" size={18} color={colors.mutedForeground} />
          </Pressable>
        )}
      </View>

      {/* Regular notes and empty states */}
      {orderedNotes.length === 0 ? (
        <EmptyState icon="file-text" message="No notes yet" />
      ) : filteredNotes.length === 0 ? (
        <EmptyState icon="search" message="No notes match your search" />
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerClassName="gap-3 pb-[120px] pt-[30px]"
          showsVerticalScrollIndicator={false}
        >
          {filteredNotes.map((note) => (
            <Card
              key={note.id}
              accessibilityLabel={`Edit ${note.title || "Untitled note"}`}
              onPress={() => openNote(note.id)}
              testID={`edit-note-${note.id}`}
            >
              <View className="flex-row items-center gap-[10px]">
                <Typography className="flex-1 font-semibold text-[17px]">
                  {note.title || "Untitled note"}
                </Typography>

                {note.pinned && (
                  <Feather name="bookmark" size={17} color={colors.primary} />
                )}
              </View>

              <RichTextPreview
                numberOfLines={3}
                style={{ marginTop: 7 }}
                value={note.content ?? ""}
              />
            </Card>
          ))}
        </ScrollView>
      )}

      {/* Create note button */}
      <Pressable
        accessibilityLabel="Create a new note"
        accessibilityRole="button"
        onPress={openNewNote}
        className="absolute bottom-[84px] right-6 h-[58px] w-[58px] items-center justify-center rounded-full active:opacity-[0.78] active:scale-[0.95]"
        style={{
          backgroundColor: colors.primary,
          elevation: 5,
        }}
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
  icon: "file-text" | "search";
  message: string;
}) {
  const colors = useColors();

  return (
    <View className="flex-1 items-center justify-center pb-12">
      <View
        className="mb-[18px] h-[68px] w-[68px] items-center justify-center rounded-[22px] border"
        style={{
          backgroundColor: colors.secondary,
          borderColor: colors.border,
        }}
      >
        <Feather name={icon} size={28} color={colors.primary} />
      </View>

      <Typography variant="heading">{message}</Typography>
    </View>
  );
}
