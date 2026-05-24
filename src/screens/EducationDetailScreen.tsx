import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '../components/Card';
import { EDUCATION_TOPICS } from '../data/education';
import { useTheme } from '../hooks/useTheme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'EducationDetail'>;

export function EducationDetailScreen({ route }: Props) {
  const { colors } = useTheme();
  const topic = EDUCATION_TOPICS.find((t) => t.id === route.params.topicId);

  if (!topic) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Topic not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: colors.text }]}>{topic.title}</Text>
      <Text style={[styles.summary, { color: colors.textSecondary }]}>{topic.summary}</Text>
      <Text style={[styles.section, { color: colors.text }]}>Perspectives</Text>
      {topic.perspectives.map((p, i) => (
        <Card key={i}>
          <Text style={[styles.sect, { color: colors.primary }]}>{p.sect}</Text>
          <Text style={[styles.approach, { color: colors.text }]}>{p.approach}</Text>
        </Card>
      ))}
      <Text style={[styles.disclaimer, { color: colors.textSecondary }]}>
        This content is for educational purposes. Consult qualified scholars for personal religious rulings.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: '700' },
  summary: { marginTop: 12, lineHeight: 24, fontSize: 16 },
  section: { fontSize: 18, fontWeight: '600', marginTop: 24, marginBottom: 12 },
  sect: { fontWeight: '600', marginBottom: 8 },
  approach: { lineHeight: 24 },
  disclaimer: { marginTop: 24, fontSize: 12, fontStyle: 'italic', lineHeight: 18 },
});
