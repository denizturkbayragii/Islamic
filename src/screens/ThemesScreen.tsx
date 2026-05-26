import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { APP_THEMES, type ThemeId } from '../constants/themes';
import { useApp } from '../context/AppContext';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';

const THEME_IDS = Object.keys(APP_THEMES) as ThemeId[];

export function ThemesScreen() {
  const { settings, setThemeId } = useApp();
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.intro, { color: colors.textSecondary }]}>{t('themes.intro')}</Text>
      {THEME_IDS.map((id) => {
        const theme = APP_THEMES[id];
        const selected = settings.themeId === id;
        return (
          <Pressable key={id} onPress={() => setThemeId(id)} style={[styles.card, { borderColor: selected ? theme.primary : colors.border }]}>
            <View style={[styles.swatch, { backgroundColor: theme.primary }]} />
            <View style={styles.info}>
              <Text style={[styles.name, { color: colors.text }]}>{t(theme.nameKey)}</Text>
              <View style={styles.dots}>
                <View style={[styles.dot, { backgroundColor: theme.primary }]} />
                <View style={[styles.dot, { backgroundColor: theme.accent }]} />
              </View>
            </View>
            {selected && <Ionicons name="checkmark-circle" size={28} color={theme.primary} />}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  intro: { lineHeight: 22, marginBottom: 16 },
  card: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, borderWidth: 2, padding: 12, marginBottom: 12, backgroundColor: 'transparent' },
  swatch: { width: 56, height: 56, borderRadius: 14 },
  info: { flex: 1, marginLeft: 14 },
  name: { fontSize: 17, fontWeight: '700' },
  dots: { flexDirection: 'row', gap: 6, marginTop: 8 },
  dot: { width: 16, height: 16, borderRadius: 8 },
});
