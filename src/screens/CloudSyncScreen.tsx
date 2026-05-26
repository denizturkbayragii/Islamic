import React, { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '../components/Card';
import { useApp } from '../context/AppContext';
import { payloadToJson, parseSyncJson } from '../services/cloudSync';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';

export function CloudSyncScreen() {
  const { settings, updateSettings, syncNow, exportSyncPayload, importSyncPayload } = useApp();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const result = await syncNow();
      Alert.alert(t('sync.success'), t('sync.syncedAt', { time: new Date(result.mergedAt).toLocaleString() }));
    } catch {
      Alert.alert(t('sync.error'), t('sync.errorMsg'));
    } finally {
      setSyncing(false);
    }
  };

  const handleExport = async () => {
    const payload = await exportSyncPayload();
    Alert.alert(t('sync.exportTitle'), t('sync.exportHint'));
    await updateSettings({
      cloudSync: { ...settings.cloudSync, lastSyncAt: payload.exportedAt },
    });
  };

  const handleImportDemo = async () => {
    const payload = await exportSyncPayload();
    const parsed = parseSyncJson(payloadToJson(payload));
    if (parsed) {
      await importSyncPayload(parsed);
      Alert.alert(t('sync.importSuccess'));
    }
  };

  const lastSync = settings.cloudSync.lastSyncAt
    ? new Date(settings.cloudSync.lastSyncAt).toLocaleString()
    : t('sync.never');

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.intro, { color: colors.textSecondary }]}>{t('sync.intro')}</Text>
      <Card>
        <Text style={{ color: colors.textSecondary }}>{t('sync.lastSync')}</Text>
        <Text style={[styles.lastSync, { color: colors.text }]}>{lastSync}</Text>
        <Text style={{ color: colors.textSecondary, marginTop: 8, fontSize: 12 }}>
          {t('sync.deviceId')}: {settings.cloudSync.deviceId.slice(0, 16)}…
        </Text>
      </Card>

      <Pressable
        style={[styles.btn, { backgroundColor: colors.primary }]}
        onPress={handleSync}
        disabled={syncing}
      >
        {syncing ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>{t('sync.syncNow')}</Text>
        )}
      </Pressable>

      <Pressable style={[styles.btnOutline, { borderColor: colors.primary }]} onPress={handleExport}>
        <Text style={[styles.btnOutlineText, { color: colors.primary }]}>{t('sync.export')}</Text>
      </Pressable>

      <Pressable style={[styles.btnOutline, { borderColor: colors.border }]} onPress={handleImportDemo}>
        <Text style={[styles.btnOutlineText, { color: colors.text }]}>{t('sync.restore')}</Text>
      </Pressable>

      <Text style={[styles.note, { color: colors.textSecondary }]}>{t('sync.note')}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  intro: { lineHeight: 22, marginBottom: 16 },
  lastSync: { fontSize: 18, fontWeight: '700', marginTop: 4 },
  btn: { padding: 16, borderRadius: 14, alignItems: 'center', marginTop: 16 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  btnOutline: { padding: 14, borderRadius: 14, alignItems: 'center', marginTop: 12, borderWidth: 2 },
  btnOutlineText: { fontSize: 15, fontWeight: '600' },
  note: { fontSize: 12, lineHeight: 18, marginTop: 20 },
});
