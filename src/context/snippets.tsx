import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type SnippetLanguage =
  | "javascript"
  | "typescript"
  | "python"
  | "json"
  | "bash"
  | "plaintext";

export const LANGUAGE_LABELS: Record<SnippetLanguage, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  python: "Python",
  json: "JSON",
  bash: "Bash",
  plaintext: "Plain text",
};

export interface Snippet {
  id: string;
  title: string;
  code: string;
  language: SnippetLanguage;
  pinned: boolean;
}

interface SnippetsContextValue {
  snippets: Snippet[];
  isLoaded: boolean;
  addSnippet: (title: string, code: string, language: SnippetLanguage) => void;
  updateSnippet: (
    id: string,
    title: string,
    code: string,
    language: SnippetLanguage,
  ) => void;
  toggleSnippetPinned: (id: string) => void;
  deleteSnippet: (id: string) => void;
}

const SnippetsContext = createContext<SnippetsContextValue | null>(null);

const SNIPPETS_STORAGE_KEY = "snippets";
const LEGACY_SNIPPETS_STORAGE_KEY = "aven.snippets.v1";

interface StoredSnippet {
  id: string;
  title: string;
  code: string;
  language: string;
  pinned?: boolean;
}

function isSnippetLanguage(value: string): value is SnippetLanguage {
  return (
    value === "javascript" ||
    value === "typescript" ||
    value === "python" ||
    value === "json" ||
    value === "bash" ||
    value === "plaintext"
  );
}

function normalizeLanguage(value: string): SnippetLanguage {
  return isSnippetLanguage(value) ? value : "plaintext";
}

function isStoredSnippet(value: unknown): value is StoredSnippet {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const snippet = value as Record<string, unknown>;

  return (
    typeof snippet.id === "string" &&
    typeof snippet.title === "string" &&
    typeof snippet.code === "string" &&
    typeof snippet.language === "string" &&
    (snippet.pinned === undefined || typeof snippet.pinned === "boolean")
  );
}

function normalizeStoredSnippets(value: unknown): Snippet[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isStoredSnippet).map((snippet) => ({
    id: snippet.id,
    title: snippet.title,
    code: snippet.code,
    language: normalizeLanguage(snippet.language),
    pinned: snippet.pinned ?? false,
  }));
}

async function getStoredSnippets(): Promise<string | null> {
  const [storedValue, legacyValue] = await Promise.all([
    AsyncStorage.getItem(SNIPPETS_STORAGE_KEY),
    AsyncStorage.getItem(LEGACY_SNIPPETS_STORAGE_KEY),
  ]);

  if (storedValue !== null) {
    return storedValue;
  }

  if (legacyValue !== null) {
    await AsyncStorage.setItem(SNIPPETS_STORAGE_KEY, legacyValue);
    await AsyncStorage.removeItem(LEGACY_SNIPPETS_STORAGE_KEY);

    return legacyValue;
  }

  return null;
}

export function SnippetsProvider({ children }: { children: ReactNode }) {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [hasLoadedData, setHasLoadedData] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadSnippets = async () => {
      try {
        const storedSnippets = await getStoredSnippets();

        const parsedSnippets: unknown = storedSnippets
          ? JSON.parse(storedSnippets)
          : [];

        const normalizedSnippets = normalizeStoredSnippets(parsedSnippets);

        if (isMounted) {
          setSnippets(normalizedSnippets);
        }
      } catch {
        if (isMounted) {
          setSnippets([]);
        }
      } finally {
        if (isMounted) {
          setHasLoadedData(true);
        }
      }
    };

    void loadSnippets();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hasLoadedData) {
      return;
    }

    void AsyncStorage.setItem(SNIPPETS_STORAGE_KEY, JSON.stringify(snippets));
  }, [hasLoadedData, snippets]);

  const addSnippet = useCallback(
    (title: string, code: string, language: SnippetLanguage) => {
      const newSnippet: Snippet = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title,
        code,
        language,
        pinned: false,
      };

      setSnippets((current) => [newSnippet, ...current]);
    },
    [],
  );

  const updateSnippet = useCallback(
    (id: string, title: string, code: string, language: SnippetLanguage) => {
      setSnippets((current) =>
        current.map((snippet) =>
          snippet.id === id ? { ...snippet, title, code, language } : snippet,
        ),
      );
    },
    [],
  );

  const toggleSnippetPinned = useCallback((id: string) => {
    setSnippets((current) =>
      current.map((snippet) =>
        snippet.id === id ? { ...snippet, pinned: !snippet.pinned } : snippet,
      ),
    );
  }, []);

  const deleteSnippet = useCallback((id: string) => {
    setSnippets((current) => current.filter((snippet) => snippet.id !== id));
  }, []);

  const value = useMemo<SnippetsContextValue>(
    () => ({
      snippets,
      isLoaded: hasLoadedData,
      addSnippet,
      updateSnippet,
      toggleSnippetPinned,
      deleteSnippet,
    }),
    [
      snippets,
      hasLoadedData,
      addSnippet,
      updateSnippet,
      toggleSnippetPinned,
      deleteSnippet,
    ],
  );

  return (
    <SnippetsContext.Provider value={value}>
      {children}
    </SnippetsContext.Provider>
  );
}

export function useSnippets(): SnippetsContextValue {
  const context = useContext(SnippetsContext);

  if (context === null) {
    throw new Error("useSnippets must be used inside SnippetsProvider");
  }

  return context;
}
