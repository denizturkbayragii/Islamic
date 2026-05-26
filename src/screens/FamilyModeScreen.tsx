import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { Card } from '../components/Card';
import { useApp } from '../context/AppContext';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';
import type { FamilyMember } from '../types';

const EMOJIS = ['👨', '👩', '👦', '👧', '🧑', '👴', '👵'];
const ROLES: FamilyMember['role'][] = ['parent', 'child', 'spouse', 'other'];

export function FamilyModeScreen() {
  const {
    family,
    addFamilyMember,
    removeFamilyMember,
    settings,
    updateSettings,
    setActiveFamilyMember,
  } = useApp();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('👨');
  const [role, setRole] = useState<FamilyMember['role']>('parent');

  const handleAdd = () => {
    if (!name.trim()) return;
    void addFamilyMember({ name: name.trim(), avatarEmoji: emoji, role });
    setName('');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.intro, { color: colors.textSecondary }]}>{t('family.intro')}</Text>
      <Card>
        <View style={styles.row}>
          <Text style={{ color: colors.text, fontWeight: '600' }}>{t('family.enable')}</Text>
          <Switch
            value={settings.familyModeEnabled}
            onValueChange={(v) => updateSettings({ familyModeEnabled: v })}
            trackColor={{ true: colors.primary }}
          />
        </View>
      </Card>

      {settings.familyModeEnabled && (
        <>
          <Text style={[styles.section, { color: colors.text }]}>{t('family.addMember')}</Text>
          <View style={styles.emojiRow}>
            {EMOJIS.map((e) => (
              <Pressable
                key={e}
                onPress={() => setEmoji(e)}
                style={[styles.emojiBtn, { borderColor: emoji === e ? colors.primary : colors.border, backgroundColor: colors.surface }]}
              >
                <Text style={{ fontSize: 24 }}>{e}</Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.roleRow}>
            {ROLES.map((r) => (
              <Pressable
                key={r}
                onPress={() => setRole(r)}
                style={[styles.roleChip, { backgroundColor: role === r ? colors.primary : colors.surface }]}
              >
                <Text style={{ color: role === r ? '#fff' : colors.text, fontSize: 12 }}>{t(`family.role.${r}`)}</Text>
              </Pressable>
            ))}
          </View>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder={t('family.namePlaceholder')}
            placeholderTextColor={colors.textSecondary}
            style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
          />
          <Pressable style={[styles.addBtn, { backgroundColor: colors.primary }]} onPress={handleAdd}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>{t('family.add')}</Text>
          </Pressable>

          <Text style={[styles.section, { color: colors.text }]}>{t('family.members')}</Text>
          {family.length === 0 ? (
            <Text style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 20 }}>{t('family.empty')}</Text>
          ) : (
            family.map((m) => (
              <Card key={m.id}>
                <Pressable
                  onPress={() => setActiveFamilyMember(settings.activeFamilyMemberId === m.id ? null : m.id)}
                  style={styles.memberRow}
                >
                  <Text style={{ fontSize: 32 }}>{m.avatarEmoji}</Text>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[styles.memberName, { color: colors.text }]}>{m.name}</Text>
                    <Text style={{ color: colors.textSecondary }}>{t(`family.role.${m.role}`)}</Text>
                  </View>
                  {settings.activeFamilyMemberId === m.id && (
                    <Text style={{ color: colors.accent, fontWeight: '700' }}>{t('family.active')}</Text>
                  )}
                </Pressable>
                <Pressable onPress={() => removeFamilyMember(m.id)}>
                  <Text style={{ color: colors.error, marginTop: 8 }}>{t('family.remove')}</Text>
                </Pressable>
              </Card>
            ))
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  intro: { lineHeight: 22, marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  section: { fontSize: 17, fontWeight: '600', marginTop: 20, marginBottom: 10 },
  emojiRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  emojiBtn: { padding: 8, borderRadius: 12, borderWidth: 2 },
  roleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  roleChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16 },
  input: { borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 12 },
  addBtn: { padding: 14, borderRadius: 12, alignItems: 'center' },
  memberRow: { flexDirection: 'row', alignItems: 'center' },
  memberName: { fontSize: 17, fontWeight: '600' },
});
