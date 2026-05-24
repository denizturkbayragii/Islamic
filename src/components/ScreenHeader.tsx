import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { spacing, typography } from '../constants/theme';
import { useTheme } from '../hooks/useTheme';

export function ScreenHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.wrap}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.lg },
  title: { ...typography.title },
  subtitle: { ...typography.body, marginTop: spacing.xs },
});
