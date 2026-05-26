import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Card } from '../components/Card';
import { getDayNames } from '../i18n';
import { useApp } from '../context/AppContext';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';
import type { CustomReminder } from '../types';

const TYPES: CustomReminder['type'][] = ['dhikr', 'dua', 'quran', 'custom'];

export function AdvancedRemindersScreen() {
  const { settings, addCustomReminder, removeCustomReminder } = useApp();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dayNames = getDayNames(settings.appLanguage);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('08:00');
  const [type, setType] = useState<CustomReminder['type']>('dhikr');
  const [days, setDays] = useState<number[]>([1, 2, 3, 4, 5]);

  const toggleDay = (d: number) => {
    setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  };

  const handleAdd = () => {
    if (!title.trim() || days.length === 0) return;
    void addCustomReminder({
      title: title.trim(),
      time,
      daysOfWeek: days,
      type,
      enabled: true,
      sound: 'default',
    });
    setTitle('');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.intro, { color: colors.textSecondary }]}>{t('reminders.intro')}</Text>

      <Text style={[styles.label, { color: colors.text }]}>{t('reminders.typeLabel')}</Text>
      <View style={styles.typeRow}>
        {TYPES.map((tp) => (
          <Pressable
            key={tp}
            onPress={() => setType(tp)}
            style={[styles.chip, { backgroundColor: type === tp ? colors.primary : colors.surface, borderColor: colors.border }]}
          >
            <Text style={{ color: type === tp ? '#fff' : colors.text, fontSize: 12 }}>{t(`reminders.types.${tp}`)}</Text>
          </Pressable>
        ))}
      </View>

      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder={t('reminders.titlePlaceholder')}
        placeholderTextColor={colors.textSecondary}
        style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
      />
      <TextInput
        value={time}
        onChangeText={setTime}
        placeholder="HH:mm"
        placeholderTextColor={colors.textSecondary}
        style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
      />

      <Text style={[styles.label, { color: colors.text }]}>{t('notifications.disableDays')}</Text>
      <View style={styles.days}>
        {dayNames.map((d, i) => (
          <Pressable
            key={d}
            onPress={() => toggleDay(i)}
            style={[
              styles.dayChip,
              {
                backgroundColor: days.includes(i) ? colors.primary : colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={{ color: days.includes(i) ? '#fff' : colors.text, fontSize: 12 }}>{d}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={[styles.addBtn, { backgroundColor: colors.primary }]} onPress={handleAdd}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>{t('reminders.add')}</Text>
      </Pressable>

      <Text style={[styles.section, { color: colors.text }]}>{t('reminders.scheduled')}</Text>
      {settings.customReminders.length === 0 ? (
        <Text style={{ color: colors.textSecondary }}>{t('reminders.empty')}</Text>
      ) : (
        settings.customReminders.map((r) => (
          <Card key={r.id}>
            <View style={styles.reminderRow}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontWeight: '600' }}>{r.title}</Text>
                <Text style={{ color: colors.textSecondary }}>
                  {r.time} · {t(`reminders.types.${r.type}`)}
                </Text>
              </View>
              <Pressable onPress={() => removeCustomReminder(r.id)}>
                <Text style={{ color: colors.error }}>{t('reminders.delete')}</Text>
              </Pressable>
            </View>
          </Card>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  intro: { lineHeight: 22, marginBottom: 16 },
  label: { fontWeight: '600', marginBottom: 8 },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, borderWidth: 1 },
  input: { borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 12, fontSize: 16 },
  days: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16 },
  dayChip: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8, borderWidth: 1 },
  addBtn: { padding: 14, borderRadius: 12, alignItems: 'center', marginBottom: 24 },
  section: { fontSize: 17, fontWeight: '600', marginBottom: 10 },
  reminderRow: { flexDirection: 'row', alignItems: 'center' },
});
