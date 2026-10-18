import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  decryptPrivatePayload,
  encryptPrivatePayload,
} from "@/service/private/crypto";

import { authenticateForPrivateNote } from "@/service/private/auth";

import type { PrivateNotePayload } from "@/types/privateNote";

export interface Note {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  private: boolean;
  aiGenerated?: boolean;
  encryptedData?: string;
  encryptionVersion?: 1;
  updatedAt?: string;
}

export interface UnlockedNote {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

interface StoredNote {
  id: string;
  title?: string;
  content?: string;
  pinned?: boolean;
  private?: boolean;
  aiGenerated?: boolean;
  encryptedData?: string;
  encryptionVersion?: 1;
  updatedAt?: string;
}

interface NotesContextValue {
  notes: Note[];
  isLoaded: boolean;

  addNote: (title: string, content: string) => void;
  addAiGeneratedNote: (title: string, content: string) => void;
  addPrivateNote: (title: string, content: string) => Promise<void>;

  updateNote: (id: string, title: string, content: string) => void;
  updateAiGeneratedNote: (id: string, title: string, content: string) => void;

  toggleNotePinned: (id: string) => void;
  deleteNote: (id: string) => void;

  makeNotePrivate: (id: string) => Promise<void>;
  unlockNote: (id: string) => Promise<UnlockedNote>;
  lockNote: (id: string) => void;
  updatePrivateNote: (
    id: string,
    title: string,
    content: string,
  ) => Promise<void>;
  isNoteUnlocked: (id: string) => boolean;
}

const NotesContext = createContext<NotesContextValue | null>(null);

const NOTES_STORAGE_KEY = "notes";
const LEGACY_NOTES_STORAGE_KEY = "aven.notes.v1";

function isStoredNote(value: unknown): value is StoredNote {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const note = value as Record<string, unknown>;

  return (
    typeof note.id === "string" &&
    (note.title === undefined || typeof note.title === "string") &&
    (note.content === undefined || typeof note.content === "string") &&
    (note.pinned === undefined || typeof note.pinned === "boolean") &&
    (note.private === undefined || typeof note.private === "boolean") &&
    (note.aiGenerated === undefined || typeof note.aiGenerated === "boolean") &&
    (note.encryptedData === undefined ||
      typeof note.encryptedData === "string") &&
    (note.encryptionVersion === undefined || note.encryptionVersion === 1) &&
    (note.updatedAt === undefined || typeof note.updatedAt === "string")
  );
}

function normalizeStoredNote(note: StoredNote): Note {
  const isEncryptedPrivate =
    note.private === true &&
    typeof note.encryptedData === "string" &&
    note.encryptionVersion === 1;

  if (isEncryptedPrivate) {
    return {
      id: note.id,
      title: note.title ?? "",
      content: "",
      pinned: note.pinned ?? false,
      private: true,
      aiGenerated: false,
      encryptedData: note.encryptedData,
      encryptionVersion: 1,
      updatedAt: note.updatedAt,
    };
  }

  return {
    id: note.id,
    title: note.title ?? "",
    content: note.content ?? "",
    pinned: note.pinned ?? false,
    private: false,
    aiGenerated: note.aiGenerated ?? false,
    updatedAt: note.updatedAt,
  };
}

function createNoteId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createUpdatedAt(): string {
  return new Date().toISOString();
}

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [unlockedNotes, setUnlockedNotes] = useState<
    Record<string, UnlockedNote>
  >({});
  const [hasLoadedData, setHasLoadedData] = useState(false);
  const [canPersist, setCanPersist] = useState(false);

  // Load notes and migrate older private notes containing plaintext.
  useEffect(() => {
    let isMounted = true;

    async function loadNotes() {
      try {
        const [currentValue, legacyValue] = await Promise.all([
          AsyncStorage.getItem(NOTES_STORAGE_KEY),
          AsyncStorage.getItem(LEGACY_NOTES_STORAGE_KEY),
        ]);

        const rawValue = currentValue ?? legacyValue;
        const parsed: unknown = rawValue ? JSON.parse(rawValue) : [];

        if (!Array.isArray(parsed) || !parsed.every(isStoredNote)) {
          throw new Error("Stored notes data is invalid.");
        }

        const normalized: Note[] = [];

        for (const stored of parsed) {
          const isEncryptedPrivate =
            stored.private === true &&
            typeof stored.encryptedData === "string" &&
            stored.encryptionVersion === 1;

          if (isEncryptedPrivate) {
            normalized.push(normalizeStoredNote(stored));
            continue;
          }

          if (stored.private === true) {
            // Encrypt legacy private-note content while keeping its title visible.
            const payload: PrivateNotePayload = {
              id: stored.id,
              content: stored.content ?? "",
              updatedAt: stored.updatedAt ?? createUpdatedAt(),
            };

            const encryptedData = await encryptPrivatePayload(payload);

            normalized.push({
              id: stored.id,
              title: stored.title ?? "",
              content: "",
              pinned: stored.pinned ?? false,
              private: true,
              aiGenerated: false,
              encryptedData,
              encryptionVersion: 1,
              updatedAt: payload.updatedAt,
            });

            continue;
          }

          normalized.push(normalizeStoredNote(stored));
        }

        await AsyncStorage.setItem(
          NOTES_STORAGE_KEY,
          JSON.stringify(normalized),
        );

        if (legacyValue !== null && currentValue === null) {
          await AsyncStorage.removeItem(LEGACY_NOTES_STORAGE_KEY);
        }

        if (isMounted) {
          setNotes(normalized);
          setCanPersist(true);
        }
      } catch (error) {
        console.error("Failed to load or migrate notes:", error);
      } finally {
        if (isMounted) {
          setHasLoadedData(true);
        }
      }
    }

    void loadNotes();

    return () => {
      isMounted = false;
    };
  }, []);

  // Persist notes locally.
  useEffect(() => {
    if (!hasLoadedData || !canPersist) {
      return;
    }

    void AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes)).catch(
      (error) => {
        console.error("Failed to save notes:", error);
      },
    );
  }, [hasLoadedData, canPersist, notes]);

  // Create a regular note.
  const addNote = useCallback((title: string, content: string) => {
    const newNote: Note = {
      id: createNoteId(),
      title,
      content,
      pinned: false,
      private: false,
      aiGenerated: false,
      updatedAt: createUpdatedAt(),
    };

    setNotes((current) => [newNote, ...current]);
  }, []);

  // Create an AI-generated note.
  const addAiGeneratedNote = useCallback((title: string, content: string) => {
    const newNote: Note = {
      id: createNoteId(),
      title,
      content,
      pinned: false,
      private: false,
      aiGenerated: true,
      updatedAt: createUpdatedAt(),
    };

    setNotes((current) => [newNote, ...current]);
  }, []);

  // Create a private note: authenticate and encrypt its content.
  const addPrivateNote = useCallback(
    async (title: string, content: string) => {
      if (!hasLoadedData || !canPersist) {
        throw new Error("Notes are not ready yet. Please try again.");
      }

      const authenticated = await authenticateForPrivateNote();

      if (!authenticated) {
        throw new Error("Authentication cancelled or failed.");
      }

      const id = createNoteId();
      const updatedAt = createUpdatedAt();

      const payload: PrivateNotePayload = {
        id,
        content,
        updatedAt,
      };

      const encryptedData = await encryptPrivatePayload(payload);

      const privateRecord: Note = {
        id,
        title,
        content: "",
        pinned: false,
        private: true,
        aiGenerated: false,
        encryptedData,
        encryptionVersion: 1,
        updatedAt,
      };

      const storedValue = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
      const storedNotes: unknown = storedValue ? JSON.parse(storedValue) : [];

      if (!Array.isArray(storedNotes) || !storedNotes.every(isStoredNote)) {
        throw new Error("Stored notes data is invalid.");
      }

      const nextNotes = [
        privateRecord,
        ...storedNotes.map(normalizeStoredNote),
      ];

      await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(nextNotes));

      setNotes(nextNotes);
    },
    [hasLoadedData, canPersist],
  );

  // Regular editing cannot modify private or AI-generated notes.
  const updateNote = useCallback(
    (id: string, title: string, content: string) => {
      setNotes((current) =>
        current.map((note) =>
          note.id === id && !note.private && !note.aiGenerated
            ? {
                ...note,
                title,
                content,
                updatedAt: createUpdatedAt(),
              }
            : note,
        ),
      );
    },
    [],
  );

  // Update an AI-generated note after an AI modification succeeds.
  const updateAiGeneratedNote = useCallback(
    (id: string, title: string, content: string) => {
      setNotes((current) =>
        current.map((note) =>
          note.id === id && !note.private && note.aiGenerated
            ? {
                ...note,
                title,
                content,
                updatedAt: createUpdatedAt(),
              }
            : note,
        ),
      );
    },
    [],
  );

  const toggleNotePinned = useCallback((id: string) => {
    setNotes((current) =>
      current.map((note) =>
        note.id === id ? { ...note, pinned: !note.pinned } : note,
      ),
    );
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((current) => current.filter((note) => note.id !== id));

    setUnlockedNotes((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  }, []);

  // Convert a regular note into an encrypted private note.
  const makeNotePrivate = useCallback(
    async (id: string) => {
      const note = notes.find((item) => item.id === id);

      if (!note) {
        throw new Error("Note not found.");
      }

      if (note.private) {
        throw new Error("This note is already private.");
      }

      const authenticated = await authenticateForPrivateNote();

      if (!authenticated) {
        throw new Error("Authentication cancelled or failed.");
      }

      const updatedAt = createUpdatedAt();

      const payload: PrivateNotePayload = {
        id: note.id,
        content: note.content,
        updatedAt,
      };

      const encryptedData = await encryptPrivatePayload(payload);

      const privateRecord: Note = {
        id: note.id,
        title: note.title,
        content: "",
        pinned: note.pinned,
        private: true,
        aiGenerated: false,
        encryptedData,
        encryptionVersion: 1,
        updatedAt,
      };

      const nextNotes = notes.map((item) =>
        item.id === id ? privateRecord : item,
      );

      await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(nextNotes));

      setNotes(nextNotes);

      setUnlockedNotes((current) => {
        const next = { ...current };
        delete next[id];
        return next;
      });
    },
    [notes],
  );

  // Authenticate and decrypt only the private note content.
  const unlockNote = useCallback(
    async (id: string): Promise<UnlockedNote> => {
      const note = notes.find((item) => item.id === id);

      if (
        !note ||
        !note.private ||
        !note.encryptedData ||
        note.encryptionVersion !== 1
      ) {
        throw new Error("Encrypted private note not found.");
      }

      const authenticated = await authenticateForPrivateNote();

      if (!authenticated) {
        throw new Error("Authentication cancelled or failed.");
      }

      const payload = await decryptPrivatePayload(note.encryptedData);

      if (payload.id !== id) {
        throw new Error("Private note integrity check failed.");
      }

      const unlocked: UnlockedNote = {
        id: payload.id,
        title: note.title,
        content: payload.content,
        updatedAt: payload.updatedAt,
      };

      setUnlockedNotes((current) => ({
        ...current,
        [id]: unlocked,
      }));

      return unlocked;
    },
    [notes],
  );

  const lockNote = useCallback((id: string) => {
    setUnlockedNotes((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  }, []);

  // Re-encrypt updated content; keep the title readable in storage.
  const updatePrivateNote = useCallback(
    async (id: string, title: string, content: string) => {
      const note = notes.find((item) => item.id === id);

      if (
        !note ||
        !note.private ||
        !note.encryptedData ||
        note.encryptionVersion !== 1 ||
        !unlockedNotes[id]
      ) {
        throw new Error("Unlock this private note before editing it.");
      }

      const updatedAt = createUpdatedAt();

      const payload: PrivateNotePayload = {
        id,
        content,
        updatedAt,
      };

      const encryptedData = await encryptPrivatePayload(payload);

      const updatedRecord: Note = {
        id,
        title,
        content: "",
        pinned: note.pinned,
        private: true,
        aiGenerated: false,
        encryptedData,
        encryptionVersion: 1,
        updatedAt,
      };

      const nextNotes = notes.map((item) =>
        item.id === id ? updatedRecord : item,
      );

      await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(nextNotes));

      setNotes(nextNotes);

      setUnlockedNotes((current) => ({
        ...current,
        [id]: {
          id,
          title,
          content,
          updatedAt,
        },
      }));
    },
    [notes, unlockedNotes],
  );

  const isNoteUnlocked = useCallback(
    (id: string) => Boolean(unlockedNotes[id]),
    [unlockedNotes],
  );

  const value = useMemo(
    () => ({
      notes,
      isLoaded: hasLoadedData,
      addNote,
      addAiGeneratedNote,
      addPrivateNote,
      updateNote,
      updateAiGeneratedNote,
      toggleNotePinned,
      deleteNote,
      makeNotePrivate,
      unlockNote,
      lockNote,
      updatePrivateNote,
      isNoteUnlocked,
    }),
    [
      notes,
      hasLoadedData,
      addNote,
      addAiGeneratedNote,
      addPrivateNote,
      updateNote,
      updateAiGeneratedNote,
      toggleNotePinned,
      deleteNote,
      makeNotePrivate,
      unlockNote,
      lockNote,
      updatePrivateNote,
      isNoteUnlocked,
    ],
  );

  return (
    <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);

  if (!context) {
    throw new Error("useNotes must be used inside NotesProvider");
  }

  return context;
}
