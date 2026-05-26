import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { DUA_CATEGORIES, DUAS } from '../data/duas';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Duas'>;

export function DuasScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [category, setCategory] = useState<string | 'all'>('all');

  const filtered = useMemo(
    () => (category === 'all' ? DUAS : DUAS.filter((d) => d.category === category)),
    [category]
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.intro, { color: colors.textSecondary }]}>{t('duas.intro')}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
        <Pressable
          onPress={() => setCategory('all')}
          style={[styles.chip, { backgroundColor: category === 'all' ? colors.primary : colors.surface, borderColor: colors.border }]}
        >
          <Text style={{ color: category === 'all' ? '#fff' : colors.text }}>{t('duas.all')}</Text>
        </Pressable>
        {DUA_CATEGORIES.map((c) => (
          <Pressable
            key={c}
            onPress={() => setCategory(c)}
            style={[styles.chip, { backgroundColor: category === c ? colors.primary : colors.surface, borderColor: colors.border }]}
          >
            <Text style={{ color: category === c ? '#fff' : colors.text }}>{t(`duas.cat.${c}`)}</Text>
          </Pressable>
        ))}
      </ScrollView>
      {filtered.map((dua) => (
        <Pressable
          key={dua.id}
          onPress={() => navigation.navigate('DuaDetail', { duaId: dua.id })}
          style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <View style={[styles.iconWrap, { backgroundColor: colors.primary + '15' }]}>
            <Ionicons name="volume-high" size={22} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: colors.text }]}>{t(dua.titleKey)}</Text>
            <Text style={[styles.arabic, { color: colors.textSecondary }]} numberOfLines={1}>
              {dua.arabic}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  intro: { lineHeight: 22, marginBottom: 16 },
  filters: { marginBottom: 16, maxHeight: 44 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, marginRight: 8 },
  card: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 16, borderWidth: 1, marginBottom: 10 },
  iconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  title: { fontSize: 16, fontWeight: '600' },
  arabic: { fontSize: 14, marginTop: 4, textAlign: 'right' },
});
