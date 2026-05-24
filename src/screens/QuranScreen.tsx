import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { QURAN_EDITIONS } from '../constants/defaults';
import { useApp } from '../context/AppContext';
import { useTheme } from '../hooks/useTheme';
import { fetchSurahList, type SurahListItem } from '../services/quranApi';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Quran'>;

export function QuranScreen({ navigation }: Props) {
  const { settings } = useApp();
  const { colors } = useTheme();
  const [surahs, setSurahs] = useState<SurahListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const edition =
    QURAN_EDITIONS.find((e) => e.language === settings.language)?.id ?? 'en.sahih';

  useEffect(() => {
    fetchSurahList(settings.language)
      .then(setSurahs)
      .finally(() => setLoading(false));
  }, [settings.language]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.hint, { color: colors.textSecondary }]}>
        Edition: {QURAN_EDITIONS.find((e) => e.id === edition)?.name ?? edition}
      </Text>
      <FlatList
        data={surahs}
        keyExtractor={(item) => String(item.number)}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.row, { borderBottomColor: colors.border }]}
            onPress={() =>
              navigation.navigate('QuranReader', {
                surahNumber: item.number,
                edition,
                surahName: item.englishName,
              })
            }
          >
            <View style={[styles.num, { backgroundColor: colors.primary }]}>
              <Text style={styles.numText}>{item.number}</Text>
            </View>
            <View style={styles.info}>
              <Text style={[styles.name, { color: colors.text }]}>{item.englishName}</Text>
              <Text style={{ color: colors.textSecondary }}>{item.name} · {item.numberOfAyahs} ayahs</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  hint: { marginBottom: 12, fontSize: 13 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1 },
  num: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  numText: { color: '#fff', fontWeight: '700' },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600' },
});
