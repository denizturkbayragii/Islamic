import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useApp } from '../context/AppContext';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';

/** Inline home-screen widget preview (toggle via launcher) */
export function HomeWidgetModule() {
  const { settings } = useApp();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const prefs = settings.widgetPrefs;

  return (
    <View style={[styles.preview, { backgroundColor: colors.primary, borderColor: colors.accent }]}>
      <Text style={styles.previewTitle}>{t('launcher.widgetModule')}</Text>
      {prefs.showNextPrayer && <Text style={styles.previewLine}>{t('widgets.previewPrayer')}</Text>}
      {prefs.showHijriDate && <Text style={styles.previewLine}>{t('widgets.previewHijri')}</Text>}
      {prefs.showDailyDua && <Text style={styles.previewLine}>{t('widgets.previewDua')}</Text>}
      {prefs.compactMode && <Text style={styles.previewBadge}>{t('widgets.compact')}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  preview: { borderRadius: 20, padding: 18, marginBottom: 16, borderWidth: 2 },
  previewTitle: { color: '#fff', fontSize: 16, fontWeight: '800', marginBottom: 10 },
  previewLine: { color: 'rgba(255,255,255,0.9)', fontSize: 13, marginBottom: 4 },
  previewBadge: { color: '#E8C547', fontSize: 11, marginTop: 6, fontWeight: '600' },
});
