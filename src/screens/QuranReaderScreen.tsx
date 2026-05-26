import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';
import {
  addQuranBookmark,
  updateQuranLastRead,
} from '../services/readingProgress';
import { fetchSurah, type Ayah } from '../services/quranApi';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'QuranReader'>;

export function QuranReaderScreen({ route }: Props) {
  const { surahNumber, edition, surahName } = route.params;
  const { settings, refreshReadingProgress, trackActivity } = useApp();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastVisibleAyah, setLastVisibleAyah] = useState(1);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    fetchSurah(surahNumber, edition)
      .then((r) => setAyahs(r.ayahs))
      .finally(() => setLoading(false));
  }, [surahNumber, edition]);

  useEffect(() => {
    return () => {
      void updateQuranLastRead(
        settings.activeFamilyMemberId,
        surahNumber,
        edition,
        surahName,
        lastVisibleAyah
      ).then(() => refreshReadingProgress());
      void trackActivity('quran');
    };
  }, [surahNumber, edition, surahName, lastVisibleAyah, settings.activeFamilyMemberId]);

  const bookmarkAyah = async (ayahNumber: number) => {
    await addQuranBookmark(settings.activeFamilyMemberId, {
      surahNumber,
      surahName,
      edition,
      ayahNumber,
      label: `${surahName} ${ayahNumber}`,
    });
    await refreshReadingProgress();
    Alert.alert(t('reading.bookmarked'));
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.primary }]}>{surahName}</Text>
        {ayahs.map((a) => (
          <View
            key={a.number}
            onLayout={() => setLastVisibleAyah(a.numberInSurah)}
            style={[styles.ayah, { borderColor: colors.border }]}
          >
            <View style={styles.ayahHeader}>
              <Text style={[styles.ayahNum, { color: colors.accent }]}>{a.numberInSurah}</Text>
              <Pressable onPress={() => bookmarkAyah(a.numberInSurah)} hitSlop={8}>
                <Ionicons name="bookmark-outline" size={20} color={colors.primary} />
              </Pressable>
            </View>
            <Text style={[styles.ayahText, { color: colors.text }]}>{a.text}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  ayah: { marginBottom: 16, paddingBottom: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  ayahHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  ayahNum: { fontSize: 12 },
  ayahText: { fontSize: 18, lineHeight: 32 },
});
