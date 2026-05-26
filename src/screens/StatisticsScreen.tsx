import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '../components/Card';
import { StatRing } from '../components/StatRing';
import { useApp } from '../context/AppContext';
import { statsSummary } from '../services/statistics';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';

export function StatisticsScreen() {
  const { stats, habitScore, refreshStats } = useApp();
  const { colors } = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  const summary = statsSummary(stats, habitScore);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.intro, { color: colors.textSecondary }]}>{t('stats.intro')}</Text>
      <View style={styles.rings}>
        <StatRing value={summary.habitScore} label={t('stats.habits')} max={100} />
        <StatRing value={stats.prayerStreakDays} label={t('stats.streak')} max={30} />
        <StatRing value={summary.weeklyAvg} label={t('stats.weekly')} max={100} />
      </View>
      <Card>
        <StatRow label={t('stats.tasbih')} value={stats.tasbihTotal.toLocaleString()} colors={colors} />
        <StatRow label={t('stats.duasRead')} value={String(stats.duasReadCount)} colors={colors} />
        <StatRow label={t('stats.habitsDone')} value={String(stats.habitsCompletedTotal)} colors={colors} />
        <StatRow label={t('stats.quranSessions')} value={String(stats.quranSessions)} colors={colors} />
      </Card>
      <Text style={[styles.section, { color: colors.text }]}>{t('stats.weeklyChart')}</Text>
      <View style={[styles.chart, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {stats.weeklyActivity.map((v, i) => (
          <View key={i} style={styles.barCol}>
            <View style={[styles.bar, { height: Math.max(4, v * 0.8), backgroundColor: colors.primary }]} />
            <Text style={{ color: colors.textSecondary, fontSize: 10 }}>{['S', 'M', 'T', 'W', 'T', 'F', 'S'][i]}</Text>
          </View>
        ))}
      </View>
      <Text style={[styles.engagement, { color: colors.accent }]}>
        {t('stats.engagement')}: {summary.totalEngagement}
      </Text>
    </ScrollView>
  );
}

function StatRow({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <View style={styles.row}>
      <Text style={{ color: colors.textSecondary }}>{label}</Text>
      <Text style={{ color: colors.text, fontWeight: '700', fontSize: 18 }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  intro: { lineHeight: 22, marginBottom: 20 },
  rings: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 24 },
  section: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  chart: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 120, borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 16 },
  barCol: { alignItems: 'center', flex: 1 },
  bar: { width: 20, borderRadius: 6, marginBottom: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  engagement: { textAlign: 'center', fontSize: 16, fontWeight: '600' },
});
