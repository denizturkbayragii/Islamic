import React from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Card } from '../components/Card';
import { useApp } from '../context/AppContext';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';

export function WidgetsScreen() {
  const { settings, updateSettings } = useApp();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const prefs = settings.widgetPrefs;

  const updateWidget = (patch: Partial<typeof prefs>) => {
    void updateSettings({ widgetPrefs: { ...prefs, ...patch } });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.intro, { color: colors.textSecondary }]}>{t('widgets.intro')}</Text>

      <View style={[styles.preview, { backgroundColor: colors.primary, borderColor: colors.accent }]}>
        <Text style={styles.previewTitle}>{t('app.name')}</Text>
        {prefs.showNextPrayer && <Text style={styles.previewLine}>{t('widgets.previewPrayer')}</Text>}
        {prefs.showHijriDate && <Text style={styles.previewLine}>{t('widgets.previewHijri')}</Text>}
        {prefs.showDailyDua && <Text style={styles.previewLine}>{t('widgets.previewDua')}</Text>}
        {prefs.compactMode && <Text style={styles.previewBadge}>{t('widgets.compact')}</Text>}
      </View>

      <Card>
        <WidgetToggle
          label={t('widgets.nextPrayer')}
          value={prefs.showNextPrayer}
          onChange={(v) => updateWidget({ showNextPrayer: v })}
          colors={colors}
        />
        <WidgetToggle
          label={t('widgets.hijri')}
          value={prefs.showHijriDate}
          onChange={(v) => updateWidget({ showHijriDate: v })}
          colors={colors}
        />
        <WidgetToggle
          label={t('widgets.dailyDua')}
          value={prefs.showDailyDua}
          onChange={(v) => updateWidget({ showDailyDua: v })}
          colors={colors}
        />
        <WidgetToggle
          label={t('widgets.compact')}
          value={prefs.compactMode}
          onChange={(v) => updateWidget({ compactMode: v })}
          colors={colors}
        />
      </Card>

      <Text style={[styles.note, { color: colors.textSecondary }]}>{t('widgets.nativeNote')}</Text>
    </ScrollView>
  );
}

function WidgetToggle({
  label,
  value,
  onChange,
  colors,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <View style={styles.row}>
      <Text style={{ color: colors.text }}>{label}</Text>
      <Switch value={value} onValueChange={onChange} trackColor={{ true: colors.primary }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  intro: { lineHeight: 22, marginBottom: 16 },
  preview: { borderRadius: 20, padding: 20, marginBottom: 20, borderWidth: 2 },
  previewTitle: { color: '#fff', fontSize: 18, fontWeight: '800', marginBottom: 12 },
  previewLine: { color: 'rgba(255,255,255,0.9)', fontSize: 14, marginBottom: 4 },
  previewBadge: { color: '#E8C547', fontSize: 12, marginTop: 8, fontWeight: '600' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  note: { fontSize: 13, lineHeight: 20, marginTop: 16 },
});
