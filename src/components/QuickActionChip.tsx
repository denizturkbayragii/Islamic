import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export function QuickActionChip({
  icon,
  label,
  onPress,
  highlight,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  highlight?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: highlight ? colors.accent : colors.surface,
          borderColor: highlight ? colors.accent : colors.border,
        },
      ]}
    >
      <Ionicons name={icon} size={18} color={highlight ? colors.primaryDark : colors.primary} />
      <Text style={[styles.label, { color: highlight ? colors.primaryDark : colors.text }]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  label: { fontSize: 13, fontWeight: '600', maxWidth: 100 },
});
