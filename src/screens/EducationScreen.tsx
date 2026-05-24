import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { EDUCATION_TOPICS } from '../data/education';
import { useTheme } from '../hooks/useTheme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Education'>;

export function EducationScreen({ navigation }: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.intro, { color: colors.textSecondary }]}>
        Learn about Islamic topics from multiple scholarly perspectives — designed for all sects and seekers of knowledge.
      </Text>
      <FlatList
        data={EDUCATION_TOPICS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => navigation.navigate('EducationDetail', { topicId: item.id })}
          >
            <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
            <Text style={{ color: colors.textSecondary }} numberOfLines={2}>
              {item.summary}
            </Text>
            <Text style={[styles.link, { color: colors.primary }]}>
              {item.perspectives.length} perspectives →
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  intro: { marginBottom: 16, lineHeight: 22 },
  card: { padding: 16, borderRadius: 14, borderWidth: 1, marginBottom: 12 },
  title: { fontSize: 17, fontWeight: '600', marginBottom: 6 },
  link: { marginTop: 10, fontWeight: '500' },
});
