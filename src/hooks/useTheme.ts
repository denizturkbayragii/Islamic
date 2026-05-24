import { useMemo } from 'react';
import { colors } from '../constants/theme';
import { useApp } from '../context/AppContext';

export function useTheme() {
  const { darkMode } = useApp();
  return useMemo(
    () => ({
      dark: darkMode,
      colors: {
        background: darkMode ? colors.backgroundDark : colors.background,
        surface: darkMode ? colors.surfaceDark : colors.surface,
        text: darkMode ? colors.textDark : colors.text,
        textSecondary: darkMode ? colors.textSecondaryDark : colors.textSecondary,
        primary: colors.primary,
        primaryLight: colors.primaryLight,
        accent: colors.accent,
        border: darkMode ? colors.borderDark : colors.border,
        textOnPrimary: colors.textOnPrimary,
        success: colors.success,
        warning: colors.warning,
        error: colors.error,
      },
    }),
    [darkMode]
  );
}
