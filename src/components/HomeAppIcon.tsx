import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export function HomeAppIcon({
  icon,
  label,
  color,
  onPress,
  onLongPress,
  locked,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color?: string;
  onPress: () => void;
  onLongPress?: () => void;
  locked?: boolean;
}) {
  const { colors } = useTheme();
  const bg = color ?? colors.primary;

  return (
    <Pressable style={styles.wrap} onPress={onPress} onLongPress={onLongPress}>
      <View style={[styles.iconBox, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={28} color="#fff" />
        {locked && (
          <View style={styles.lockBadge}>
            <Ionicons name="lock-closed" size={10} color="#fff" />
          </View>
        )}
      </View>
      <Text style={[styles.label, { color: colors.text }]} numberOfLines={2}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '25%', alignItems: 'center', marginBottom: 18, paddingHorizontal: 4 },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  lockBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 8,
    padding: 3,
  },
  label: { fontSize: 11, textAlign: 'center', marginTop: 6, fontWeight: '600', lineHeight: 14 },
});
