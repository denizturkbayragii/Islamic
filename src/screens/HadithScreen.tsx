import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { HADITH_COLLECTIONS } from '../constants/defaults';
import { Card } from '../components/Card';
import { useApp } from '../context/AppContext';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';

const SAMPLE_HADITH: Record<string, { text: string; narrator: string }[]> = {
  bukhari: [
    { text: 'Actions are judged by intentions, and every person will get what they intended.', narrator: 'Umar ibn al-Khattab' },
    { text: 'The believer is not one who eats his fill while his neighbor goes hungry.', narrator: 'Ibn Abbas' },
  ],
  muslim: [
    { text: 'None of you truly believes until he loves for his brother what he loves for himself.', narrator: 'Anas ibn Malik' },
  ],
  abudawud: [
    { text: 'The best of you are those who learn the Quran and teach it.', narrator: 'Uthman ibn Affan' },
  ],
  tirmidhi: [
    { text: 'Whoever does not show mercy to people, Allah will not show mercy to him.', narrator: 'Abdullah ibn Amr' },
  ],
  nahj: [
    { text: 'People are asleep; when they die, they awaken.', narrator: 'Ali ibn Abi Talib' },
  ],
};

export function HadithScreen() {
  const { settings } = useApp();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const filtered = HADITH_COLLECTIONS.filter(
    (c) => settings.sectPreference === 'neutral' || !c.sect || c.sect === settings.sectPreference
  );
  const [selected, setSelected] = useState(filtered[0]?.id ?? 'bukhari');
  const hadiths = SAMPLE_HADITH[selected] ?? [];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        horizontal
        data={filtered}
        keyExtractor={(i) => i.id}
        style={styles.tabs}
        renderItem={({ item }) => (
          <Text
            onPress={() => setSelected(item.id)}
            style={[
              styles.tab,
              {
                backgroundColor: selected === item.id ? colors.primary : colors.surface,
                color: selected === item.id ? '#fff' : colors.text,
              },
            ]}
          >
            {item.name}
          </Text>
        )}
      />
      <Text style={[styles.note, { color: colors.textSecondary }]}>{t('hadith.offlineNote')}</Text>
      {hadiths.map((h, i) => (
        <Card key={i}>
          <Text style={[styles.text, { color: colors.text }]}>{h.text}</Text>
          <Text style={[styles.narrator, { color: colors.textSecondary }]}>— {h.narrator}</Text>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  tabs: { maxHeight: 44, marginBottom: 12 },
  tab: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 8, overflow: 'hidden' },
  note: { fontSize: 12, marginBottom: 12 },
  text: { fontSize: 16, lineHeight: 26, fontStyle: 'italic' },
  narrator: { marginTop: 12, fontSize: 14 },
});
