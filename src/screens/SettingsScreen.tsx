import React from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { CALCULATION_METHODS, LANGUAGES, MADHABS } from '../constants/defaults';
import { Card } from '../components/Card';
import { useApp } from '../context/AppContext';
import { useTheme } from '../hooks/useTheme';
import type { CalculationMethodId, Madhab, SectPreference } from '../types';

export function SettingsScreen() {
  const { settings, updateSettings, darkMode, toggleDarkMode } = useApp();
  const { colors } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.appTitle, { color: colors.primary }]}>Islamic</Text>
      <Text style={[styles.version, { color: colors.textSecondary }]}>Your all-in-one Islamic companion</Text>

      <Card>
        <View style={styles.row}>
          <Text style={{ color: colors.text }}>Dark mode</Text>
          <Switch value={darkMode} onValueChange={toggleDarkMode} trackColor={{ true: colors.primary }} />
        </View>
      </Card>

      <Text style={[styles.section, { color: colors.text }]}>Language</Text>
      {LANGUAGES.map((lang) => (
        <Pressable
          key={lang.code}
          onPress={() => updateSettings({ language: lang.code })}
          style={[styles.option, { backgroundColor: settings.language === lang.code ? colors.primary + '20' : colors.surface, borderColor: colors.border }]}
        >
          <Text style={{ color: colors.text }}>{lang.label}</Text>
          {settings.language === lang.code && <Text style={{ color: colors.primary }}>✓</Text>}
        </Pressable>
      ))}

      <Text style={[styles.section, { color: colors.text }]}>Madhab (Asr calculation)</Text>
      {MADHABS.map((m) => (
        <Pressable
          key={m.id}
          onPress={() => updateSettings({ madhab: m.id as Madhab })}
          style={[styles.option, { backgroundColor: settings.madhab === m.id ? colors.primary + '20' : colors.surface, borderColor: colors.border }]}
        >
          <Text style={{ color: colors.text }}>{m.label}</Text>
          {settings.madhab === m.id && <Text style={{ color: colors.primary }}>✓</Text>}
        </Pressable>
      ))}

      <Text style={[styles.section, { color: colors.text }]}>Prayer time calculation</Text>
      {CALCULATION_METHODS.map((m) => (
        <Pressable
          key={m.id}
          onPress={() => updateSettings({ calculationMethod: m.id as CalculationMethodId })}
          style={[styles.option, { backgroundColor: settings.calculationMethod === m.id ? colors.primary + '20' : colors.surface, borderColor: colors.border }]}
        >
          <Text style={{ color: colors.text, flex: 1 }}>{m.label}</Text>
          {settings.calculationMethod === m.id && <Text style={{ color: colors.primary }}>✓</Text>}
        </Pressable>
      ))}

      <Text style={[styles.section, { color: colors.text }]}>Content preference</Text>
      {(['neutral', 'sunni', 'shia'] as SectPreference[]).map((s) => (
        <Pressable
          key={s}
          onPress={() => updateSettings({ sectPreference: s })}
          style={[styles.option, { backgroundColor: settings.sectPreference === s ? colors.primary + '20' : colors.surface, borderColor: colors.border }]}
        >
          <Text style={{ color: colors.text, textTransform: 'capitalize' }}>{s}</Text>
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
  section: { fontSize: 16, fontWeight: '600', marginTop: 20, marginBottom: 10 },
  option: { flexDirection: 'row', justifyContent: 'space-between', padding: 14, borderRadius: 10, borderWidth: 1, marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
