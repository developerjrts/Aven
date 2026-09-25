import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useColorScheme } from 'react-native';

import colors from '@/constants/colors';

export type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
  colors: typeof colors.light & { radius: typeof colors.radius };
  isDarkMode: boolean;
  isThemeLoaded: boolean;
  setDarkMode: (enabled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const THEME_STORAGE_KEY = 'theme';

function isThemeMode(value: string | null): value is ThemeMode {
  return value === 'light' || value === 'dark';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>(
    systemScheme === 'dark' ? 'dark' : 'light',
  );
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);

        if (isMounted && isThemeMode(storedTheme)) {
          setThemeMode(storedTheme);
        }
      } catch {
        // Keep the system-derived theme when local storage is unavailable.
      } finally {
        if (isMounted) {
          setIsThemeLoaded(true);
        }
      }
    };

    void loadTheme();

    return () => {
      isMounted = false;
    };
  }, []);

  const setDarkMode = useCallback((enabled: boolean) => {
    const nextMode: ThemeMode = enabled ? 'dark' : 'light';
    setThemeMode(nextMode);
    void AsyncStorage.setItem(THEME_STORAGE_KEY, nextMode);
  }, []);

  const value = useMemo(
    () => ({
      colors: {
        ...(themeMode === 'dark' ? colors.dark : colors.light),
        radius: colors.radius,
      },
      isDarkMode: themeMode === 'dark',
      isThemeLoaded,
      setDarkMode,
    }),
    [isThemeLoaded, setDarkMode, themeMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }

  return context;
}