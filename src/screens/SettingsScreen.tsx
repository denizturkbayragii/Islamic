import React from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { APP_LANGUAGES, CALCULATION_METHODS, MADHABS, QURAN_EDITIONS } from '../constants/defaults';
import { Card } from '../components/Card';
import { useApp } from '../context/AppContext';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';
import type { AppLanguage, CalculationMethodId, Madhab, SectPreference } from '../types';

export function SettingsScreen() {
  const { settings, updateSettings, darkMode, toggleDarkMode } = useApp();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const sectLabel = (s: SectPreference) => {
    if (s === 'sunni') return t('settings.sectSunni');
    if (s === 'shia') return t('settings.sectShia');
    return t('settings.sectNeutral');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.appTitle, { color: colors.primary }]}>{t('app.name')}</Text>
      <Text style={[styles.version, { color: colors.textSecondary }]}>{t('app.tagline')}</Text>

      <Card>
        <View style={styles.row}>
          <Text style={{ color: colors.text }}>{t('settings.darkMode')}</Text>
          <Switch value={darkMode} onValueChange={toggleDarkMode} trackColor={{ true: colors.primary }} />
        </View>
      </Card>

      <Text style={[styles.section, { color: colors.text }]}>{t('settings.appLanguage')}</Text>
      <Text style={[styles.hint, { color: colors.textSecondary }]}>{t('settings.appLanguageHint')}</Text>
      {APP_LANGUAGES.map((lang) => (
        <Pressable
          key={lang.code}
          onPress={() => updateSettings({ appLanguage: lang.code })}
          style={[styles.option, { backgroundColor: settings.appLanguage === lang.code ? colors.primary + '20' : colors.surface, borderColor: colors.border }]}
        >
          <Text style={{ color: colors.text }}>{lang.label}</Text>
          {settings.appLanguage === lang.code && <Text style={{ color: colors.primary }}>✓</Text>}
        </Pressable>
      ))}

      <Text style={[styles.section, { color: colors.text }]}>{t('settings.quranLanguage')}</Text>
      <Text style={[styles.hint, { color: colors.textSecondary }]}>{t('settings.quranLanguageHint')}</Text>
      {QURAN_EDITIONS.map((edition) => (
        <Pressable
          key={edition.id}
          onPress={() => updateSettings({ quranEditionId: edition.id })}
          style={[styles.option, { backgroundColor: settings.quranEditionId === edition.id ? colors.primary + '20' : colors.surface, borderColor: colors.border }]}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.text }}>{edition.name}</Text>
            {edition.translator ? (
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{edition.translator}</Text>
            ) : null}
          </View>
          {settings.quranEditionId === edition.id && <Text style={{ color: colors.primary }}>✓</Text>}
        </Pressable>
      ))}

      <Text style={[styles.section, { color: colors.text }]}>{t('settings.madhab')}</Text>
      {MADHABS.map((m) => (
        <Pressable
          key={m.id}
          onPress={() => updateSettings({ madhab: m.id as Madhab })}
          style={[styles.option, { backgroundColor: settings.madhab === m.id ? colors.primary + '20' : colors.surface, borderColor: colors.border }]}
        >
          <Text style={{ color: colors.text }}>{t(`madhab.${m.id}`)}</Text>
          {settings.madhab === m.id && <Text style={{ color: colors.primary }}>✓</Text>}
        </Pressable>
      ))}

      <Text style={[styles.section, { color: colors.text }]}>{t('settings.calculation')}</Text>
      {CALCULATION_METHODS.map((m) => (
        <Pressable
          key={m.id}
          onPress={() => updateSettings({ calculationMethod: m.id as CalculationMethodId })}
          style={[styles.option, { backgroundColor: settings.calculationMethod === m.id ? colors.primary + '20' : colors.surface, borderColor: colors.border }]}
        >
          <Text style={{ color: colors.text, flex: 1 }}>{t(`calcMethod.${m.id}`)}</Text>
          {settings.calculationMethod === m.id && <Text style={{ color: colors.primary }}>✓</Text>}
        </Pressable>
      ))}

      <Text style={[styles.section, { color: colors.text }]}>{t('settings.contentPref')}</Text>
      {(['neutral', 'sunni', 'shia'] as SectPreference[]).map((s) => (
        <Pressable
          key={s}
          onPress={() => updateSettings({ sectPreference: s })}
          style={[styles.option, { backgroundColor: settings.sectPreference === s ? colors.primary + '20' : colors.surface, borderColor: colors.border }]}
        >
          <Text style={{ color: colors.text }}>{sectLabel(s)}</Text>
          {settings.sectPreference === s && <Text style={{ color: colors.primary }}>✓</Text>}
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  appTitle: { fontSize: 28, fontWeight: '700', textAlign: 'center' },
  version: { textAlign: 'center', marginBottom: 24 },
  section: { fontSize: 16, fontWeight: '600', marginTop: 20, marginBottom: 6 },
  hint: { fontSize: 13, marginBottom: 10, lineHeight: 18 },
  option: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderRadius: 10, borderWidth: 1, marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
