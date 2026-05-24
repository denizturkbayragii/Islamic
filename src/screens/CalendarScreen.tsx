import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '../components/Card';
import { useTheme } from '../hooks/useTheme';
import { getUpcomingIslamicEvents, gregorianToHijri, HIJRI_MONTHS } from '../services/hijriCalendar';

export function CalendarScreen() {
  const { colors } = useTheme();
  const today = useMemo(() => new Date(), []);
  const hijri = useMemo(() => gregorianToHijri(today), [today]);
  const events = useMemo(() => getUpcomingIslamicEvents(today), [today]);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Card>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Today (Gregorian)</Text>
        <Text style={[styles.date, { color: colors.text }]}>
          {today.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </Text>
        <Text style={[styles.label, { color: colors.textSecondary, marginTop: 16 }]}>Hijri</Text>
        <Text style={[styles.hijri, { color: colors.primary }]}>{hijri.formatted}</Text>
      </Card>

      <Text style={[styles.section, { color: colors.text }]}>Hijri Months</Text>
      <View style={styles.monthGrid}>
        {HIJRI_MONTHS.map((m, i) => (
          <View
            key={m}
            style={[
              styles.monthCell,
              {
                backgroundColor: hijri.month === i + 1 ? colors.primary : colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={{ color: hijri.month === i + 1 ? '#fff' : colors.text, fontSize: 11 }}>
              {m}
            </Text>
          </View>
        ))}
      </View>

      <Text style={[styles.section, { color: colors.text }]}>Upcoming Events</Text>
      {events.map((e) => (
        <Card key={e.name}>
          <Text style={[styles.eventName, { color: colors.text }]}>{e.name}</Text>
          <Text style={{ color: colors.textSecondary }}>{e.hijriLabel}</Text>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  label: { fontSize: 13 },
  date: { fontSize: 18, fontWeight: '600', marginTop: 4 },
  hijri: { fontSize: 22, fontWeight: '700', marginTop: 4 },
  section: { fontSize: 18, fontWeight: '600', marginVertical: 16 },
  monthGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  monthCell: { padding: 8, borderRadius: 8, borderWidth: 1, width: '30%' },
  eventName: { fontSize: 16, fontWeight: '600' },
});
