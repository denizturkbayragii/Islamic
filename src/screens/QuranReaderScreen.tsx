import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { fetchSurah, type Ayah } from '../services/quranApi';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'QuranReader'>;

export function QuranReaderScreen({ route }: Props) {
  const { surahNumber, edition, surahName } = route.params;
  const { colors } = useTheme();
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSurah(surahNumber, edition)
      .then((r) => setAyahs(r.ayahs))
      .finally(() => setLoading(false));
  }, [surahNumber, edition]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: colors.primary }]}>{surahName}</Text>
      {ayahs.map((a) => (
        <View key={a.number} style={[styles.ayah, { borderColor: colors.border }]}>
          <Text style={[styles.ayahNum, { color: colors.accent }]}>{a.numberInSurah}</Text>
          <Text style={[styles.ayahText, { color: colors.text }]}>{a.text}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  ayah: { marginBottom: 16, paddingBottom: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  ayahNum: { fontSize: 12, marginBottom: 6 },
  ayahText: { fontSize: 18, lineHeight: 32 },
});
