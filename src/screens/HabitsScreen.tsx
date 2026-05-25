import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Card } from '../components/Card';
import { useApp } from '../context/AppContext';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';

export function HabitsScreen() {
  const { habits, addHabit, toggleHabitToday } = useApp();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const today = new Date().toISOString().split('T')[0];

  const handleAdd = () => {
    if (!title.trim()) return;
    addHabit({ title: title.trim(), targetPerWeek: 7, category: 'other' });
    setTitle('');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.intro, { color: colors.textSecondary }]}>{t('habits.intro')}</Text>
      <View style={[styles.addRow, { borderColor: colors.border }]}>
        <TextInput
          placeholder={t('habits.placeholder')}
          placeholderTextColor={colors.textSecondary}
          value={title}
          onChangeText={setTitle}
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        />
        <Pressable style={[styles.addBtn, { backgroundColor: colors.primary }]} onPress={handleAdd}>
          <Text style={{ color: '#fff', fontWeight: '600' }}>{t('habits.add')}</Text>
        </Pressable>
      </View>
      {habits.length === 0 ? (
        <Text style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 40 }}>{t('habits.empty')}</Text>
      ) : (
        habits.map((h) => {
          const doneToday = h.completedDates.includes(today);
          const weekStart = new Date();
          weekStart.setDate(weekStart.getDate() - 7);
          const weekCount = h.completedDates.filter((d) => new Date(d) >= weekStart).length;
          return (
            <Card key={h.id}>
              <Pressable onPress={() => toggleHabitToday(h.id)} style={styles.habitRow}>
                <View
                  style={[
                    styles.check,
                    { backgroundColor: doneToday ? colors.success : 'transparent', borderColor: colors.primary },
                  ]}
                >
                  {doneToday && <Text style={{ color: '#fff' }}>✓</Text>}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.habitTitle, { color: colors.text }]}>{h.title}</Text>
                  <Text style={{ color: colors.textSecondary }}>
                    {weekCount}/{h.targetPerWeek} {t('habits.thisWeek')}
                  </Text>
                </View>
              </Pressable>
            </Card>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  intro: { marginBottom: 16, lineHeight: 22 },
  addRow: { flexDirection: 'row', marginBottom: 20, gap: 8 },
  input: { flex: 1, borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10 },
  addBtn: { paddingHorizontal: 20, justifyContent: 'center', borderRadius: 10 },
  habitRow: { flexDirection: 'row', alignItems: 'center' },
  check: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  habitTitle: { fontSize: 16, fontWeight: '600' },
});
