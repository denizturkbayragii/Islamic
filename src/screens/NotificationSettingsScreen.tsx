import React from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Card } from '../components/Card';
import { prayerLabels } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useTheme } from '../hooks/useTheme';
import type { PrayerName } from '../types';

const PRAYERS: PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
const SOUNDS = ['default', 'adhan_short', 'adhan_full', 'silent'] as const;

export function NotificationSettingsScreen() {
  const { settings, updateSettings, location, refreshLocation } = useApp();
  const { colors } = useTheme();

  const toggleGlobal = (v: boolean) => updateSettings({ globalNotificationsEnabled: v });
  const togglePrayer = (prayer: PrayerName, enabled: boolean) => {
    updateSettings({
      prayerNotifications: {
        ...settings.prayerNotifications,
        [prayer]: { ...settings.prayerNotifications[prayer], enabled },
      },
    });
  };

  const cycleSound = (prayer: PrayerName) => {
    const current = settings.prayerNotifications[prayer].sound;
    const idx = SOUNDS.indexOf(current);
    const next = SOUNDS[(idx + 1) % SOUNDS.length];
    updateSettings({
      prayerNotifications: {
        ...settings.prayerNotifications,
        [prayer]: { ...settings.prayerNotifications[prayer], sound: next },
      },
    });
  };

  const toggleDayOff = (prayer: PrayerName, day: number) => {
    const rules = [...settings.disabledPrayerRules];
    const existing = rules.find((r) => r.prayer === prayer);
    if (existing) {
      const has = existing.daysOfWeek.includes(day);
      existing.daysOfWeek = has
        ? existing.daysOfWeek.filter((d) => d !== day)
        : [...existing.daysOfWeek, day];
      if (existing.daysOfWeek.length === 0 && existing.specificDates.length === 0) {
        updateSettings({ disabledPrayerRules: rules.filter((r) => r.prayer !== prayer) });
        return;
      }
    } else {
      rules.push({ prayer, daysOfWeek: [day], specificDates: [] });
    }
    updateSettings({ disabledPrayerRules: rules });
  };

  const isDayDisabled = (prayer: PrayerName, day: number) =>
    settings.disabledPrayerRules.some((r) => r.prayer === prayer && r.daysOfWeek.includes(day));

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Card>
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text }]}>All prayer notifications</Text>
          <Switch
            value={settings.globalNotificationsEnabled}
            onValueChange={toggleGlobal}
            trackColor={{ true: colors.primary }}
          />
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text }]}>Location reminder</Text>
          <Switch
            value={settings.locationReminderEnabled}
            onValueChange={(v) => updateSettings({ locationReminderEnabled: v })}
            trackColor={{ true: colors.primary }}
          />
        </View>
      </Card>

      {!location && (
        <Text onPress={refreshLocation} style={{ color: colors.primary, marginBottom: 16 }}>
          Enable location to schedule notifications
        </Text>
      )}

      {PRAYERS.map((prayer) => (
        <Card key={prayer}>
          <View style={styles.row}>
            <Text style={[styles.prayerName, { color: colors.text }]}>{prayerLabels[prayer]}</Text>
            <Switch
              value={settings.prayerNotifications[prayer]?.enabled ?? true}
              onValueChange={(v) => togglePrayer(prayer, v)}
              trackColor={{ true: colors.primary }}
            />
          </View>
          <Text
            onPress={() => cycleSound(prayer)}
            style={{ color: colors.textSecondary, marginTop: 8 }}
          >
            Sound: {settings.prayerNotifications[prayer]?.sound ?? 'adhan_short'} (tap to change)
          </Text>
          <Text style={[styles.disableLabel, { color: colors.textSecondary }]}>Disable on days:</Text>
          <View style={styles.days}>
            {dayNames.map((d, i) => (
              <Text
                key={d}
                onPress={() => toggleDayOff(prayer, i)}
                style={[
                  styles.dayChip,
                  {
                    backgroundColor: isDayDisabled(prayer, i) ? colors.error : colors.surface,
                    color: isDayDisabled(prayer, i) ? '#fff' : colors.text,
                    borderColor: colors.border,
                  },
                ]}
              >
                {d}
              </Text>
            ))}
          </View>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 16 },
  prayerName: { fontSize: 18, fontWeight: '600' },
  disableLabel: { marginTop: 12, fontSize: 13 },
  days: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  dayChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, fontSize: 12 },
});
