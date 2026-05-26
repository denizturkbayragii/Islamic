import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export function StatRing({ value, label, max = 100 }: { value: number; label: string; max?: number }) {
  const { colors } = useTheme();
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <View style={styles.wrap}>
      <View style={[styles.ring, { borderColor: colors.border }]}>
        <View
          style={[
            styles.fill,
            {
              height: `${pct}%`,
              backgroundColor: colors.primary,
            },
          ]}
        />
        <Text style={[styles.value, { color: colors.primary }]}>{value}</Text>
      </View>
      <Text style={[styles.label, { color: colors.textSecondary }]} numberOfLines={2}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', flex: 1, minWidth: 72 },
  ring: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  fill: { position: 'absolute', bottom: 0, left: 0, right: 0, opacity: 0.25 },
  value: { fontSize: 20, fontWeight: '800', marginBottom: 22, zIndex: 1 },
  label: { fontSize: 11, textAlign: 'center', fontWeight: '500' },
});
