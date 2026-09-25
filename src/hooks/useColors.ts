import { useTheme } from '@/context/theme';

/**
 * Returns the design tokens for the active, persisted app theme.
 */
export function useColors() {
  return useTheme().colors;
}
