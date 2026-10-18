import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { FlatList, Pressable, View } from "react-native";

import { Typography } from "@/components/Typography";
import { useNotes } from "@/context/notes";
import { useColors } from "@/hooks/useColors";

export default function PrivateNotes() {
  const { notes } = useNotes();
  const colors = useColors();
  const router = useRouter();

  const privateNotes = useMemo(
    () => notes.filter((note) => note.private === true),
    [notes],
  );

  return (
    <View
      className="flex-1 px-4 pt-16"
      style={{ backgroundColor: colors.background }}
    >
      <View className="mb-6 flex-row items-center">
        <Pressable
          onPress={() => router.back()}
          className="mr-3 h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: colors.card }}
          accessibilityLabel="Go back"
        >
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>

        <View className="flex-1">
          <Typography variant="heading">Private Notes</Typography>
          <Typography>
            {privateNotes.length}{" "}
            {privateNotes.length === 1 ? "private note" : "private notes"}
          </Typography>
        </View>

        <Feather name="lock" size={22} color={colors.primary} />
      </View>

      {privateNotes.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <View
            className="mb-4 h-16 w-16 items-center justify-center rounded-2xl"
            style={{ backgroundColor: colors.card }}
          >
            <Feather name="lock" size={28} color={colors.mutedForeground} />
          </View>

          <Typography variant="caption">No private notes yet</Typography>
          <Typography>Notes you mark as private will appear here.</Typography>
        </View>
      ) : (
        <FlatList
          data={privateNotes}
          keyExtractor={(item) => item.id}
          contentContainerClassName="gap-3 pb-8"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              className="rounded-2xl border p-4"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
              }}
              onPress={() =>
                router.push({
                  pathname: "/view-private-note",
                  params: { id: item.id },
                })
              }
              accessibilityRole="button"
              accessibilityLabel={`Open private note ${item.title || ""}`}
            >
              <View className="mb-2 flex-row items-center">
                <Feather name="lock" size={16} color={colors.primary} />

                <View className="ml-2 flex-1">
                  <Typography variant="caption">
                    {item.title || "Private note"}
                  </Typography>
                </View>

                <Feather
                  name="chevron-right"
                  size={18}
                  color={colors.mutedForeground}
                />
              </View>

              <Typography>
                {item.content || "Tap to authenticate and edit this note."}
              </Typography>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}
