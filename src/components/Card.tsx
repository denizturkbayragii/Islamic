import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { spacing } from '../constants/theme';
import { useTheme } from '../hooks/useTheme';

export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
});
