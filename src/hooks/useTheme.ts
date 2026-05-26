import { useMemo } from 'react';
import { APP_THEMES } from '../constants/themes';
import { colors as baseColors } from '../constants/theme';
import { useApp } from '../context/AppContext';

export function useTheme() {
  const { darkMode, settings } = useApp();
  const preset = APP_THEMES[settings.themeId] ?? APP_THEMES.emerald;

  return useMemo(
    () => ({
      dark: darkMode,
      themeId: settings.themeId,
      preset,
      colors: {
        background: darkMode ? preset.backgroundDark : preset.background,
        surface: darkMode ? preset.surfaceDark : preset.surface,
        text: darkMode ? baseColors.textDark : baseColors.text,
        textSecondary: darkMode ? baseColors.textSecondaryDark : baseColors.textSecondary,
        primary: preset.primary,
        primaryLight: preset.primaryLight,
        primaryDark: preset.primaryDark,
        accent: preset.accent,
        accentLight: preset.accentLight,
        border: darkMode ? baseColors.borderDark : baseColors.border,
        textOnPrimary: baseColors.textOnPrimary,
        success: baseColors.success,
        warning: baseColors.warning,
        error: baseColors.error,
        gradient: preset.gradient,
      },
    }),
    [darkMode, settings.themeId, preset]
  );
}
