import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Note {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
}

interface NotesContextValue {
  notes: Note[];
  isLoaded: boolean;
  addNote: (title: string, content: string) => void;
  updateNote: (id: string, title: string, content: string) => void;
  toggleNotePinned: (id: string) => void;
  deleteNote: (id: string) => void;
}

const NotesContext = createContext<NotesContextValue | null>(null);

const NOTES_STORAGE_KEY = 'notes';
const LEGACY_NOTES_STORAGE_KEY = 'aven.notes.v1';

interface StoredNote {
  id: string;
  title: string;
  content: string;
  pinned?: boolean;
}

function isStoredNote(value: unknown): value is StoredNote {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const note = value as Record<string, unknown>;

  return (
    typeof note.id === 'string' &&
    typeof note.title === 'string' &&
    typeof note.content === 'string' &&
    (note.pinned === undefined || typeof note.pinned === 'boolean')
  );
}

function normalizeStoredNotes(value: unknown): Note[] {
  return Array.isArray(value)
    ? value.filter(isStoredNote).map((note) => ({
        id: note.id,
        title: note.title,
        content: note.content,
        pinned: note.pinned ?? false,
      }))
    : [];
}

async function getStoredNotes() {
  const [storedValue, legacyValue] = await Promise.all([
    AsyncStorage.getItem(NOTES_STORAGE_KEY),
    AsyncStorage.getItem(LEGACY_NOTES_STORAGE_KEY),
  ]);

  if (storedValue !== null) {
    return storedValue;
  }

  if (legacyValue !== null) {
    await Promise.all([
      AsyncStorage.setItem(NOTES_STORAGE_KEY, legacyValue),
      AsyncStorage.removeItem(LEGACY_NOTES_STORAGE_KEY),
    ]);

    return legacyValue;
  }

  return null;
}

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [hasLoadedData, setHasLoadedData] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadNotes = async () => {
      try {
        const storedNotes = await getStoredNotes();

        const parsedNotes: unknown = storedNotes
          ? JSON.parse(storedNotes)
          : [];

        const normalizedNotes = normalizeStoredNotes(parsedNotes);

        if (isMounted) {
          setNotes(normalizedNotes);
        }
      } catch {
        // If local data is unavailable or malformed,
        // start with an empty list.
      } finally {
        if (isMounted) {
          setHasLoadedData(true);
        }
      }
    };

    void loadNotes();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hasLoadedData) {
      return;
    }

    void AsyncStorage.setItem(
      NOTES_STORAGE_KEY,
      JSON.stringify(notes),
    );
  }, [hasLoadedData, notes]);

  const addNote = useCallback(
    (title: string, content: string) => {
      setNotes((currentNotes) => [
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          title,
          content,
          pinned: false,
        },
        ...currentNotes,
      ]);
    },
    [],
  );

  const updateNote = useCallback(
    (id: string, title: string, content: string) => {
      setNotes((currentNotes) =>
        currentNotes.map((note) =>
          note.id === id
            ? { ...note, title, content }
            : note,
        ),
      );
    },
    [],
  );

  const toggleNotePinned = useCallback((id: string) => {
    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === id
          ? { ...note, pinned: !note.pinned }
          : note,
      ),
    );
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((currentNotes) =>
      currentNotes.filter((note) => note.id !== id),
    );
  }, []);

  const value = useMemo(
    () => ({
      notes,
      isLoaded: hasLoadedData,
      addNote,
      updateNote,
      toggleNotePinned,
      deleteNote,
    }),
    [
      notes,
      hasLoadedData,
      addNote,
      updateNote,
      toggleNotePinned,
      deleteNote,
    ],
  );

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);

  if (!context) {
    throw new Error(
      'useNotes must be used inside NotesProvider',
    );
  }

  return context;
}