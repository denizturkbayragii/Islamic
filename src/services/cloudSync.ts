import type { ActivityStats, FamilyMember, SpiritualHabit, UserSettings } from '../types';
import { getJson, setJson, storageKeys } from './storage';

export interface SyncPayload {
  version: 1;
  exportedAt: string;
  settings: UserSettings;
  habits: SpiritualHabit[];
  family: FamilyMember[];
  stats: ActivityStats;
  tasbih: { count: number; total: number };
  duaProgress: Record<string, number>;
}

export async function buildSyncPayload(
  settings: UserSettings,
  habits: SpiritualHabit[],
  family: FamilyMember[],
  stats: ActivityStats
): Promise<SyncPayload> {
  const [tasbih, duaProgress] = await Promise.all([
    getJson(storageKeys.tasbih, { count: 0, total: 0 }),
    getJson<Record<string, number>>(storageKeys.duaProgress, {}),
  ]);
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    settings,
    habits,
    family,
    stats,
    tasbih,
    duaProgress,
  };
}

export async function saveToCloudBlob(payload: SyncPayload): Promise<void> {
  await setJson(storageKeys.cloudBlob, payload);
}

export async function loadFromCloudBlob(): Promise<SyncPayload | null> {
  const blob = await getJson<SyncPayload | null>(storageKeys.cloudBlob, null);
  return blob;
}

export async function performCloudSync(
  local: SyncPayload,
  onMerge: (merged: SyncPayload) => Promise<void>
): Promise<{ success: boolean; mergedAt: string }> {
  const remote = await loadFromCloudBlob();
  const mergedAt = new Date().toISOString();

  if (!remote) {
    await saveToCloudBlob(local);
    await onMerge(local);
    return { success: true, mergedAt };
  }

  const merged: SyncPayload = {
    version: 1,
    exportedAt: mergedAt,
    settings: { ...remote.settings, ...local.settings, cloudSync: local.settings.cloudSync },
    habits: mergeHabits(remote.habits, local.habits),
    family: local.family.length >= remote.family.length ? local.family : remote.family,
    stats: mergeStats(remote.stats, local.stats),
    tasbih: {
      count: local.tasbih.count,
      total: Math.max(remote.tasbih.total, local.tasbih.total),
    },
    duaProgress: { ...remote.duaProgress, ...local.duaProgress },
  };

  await saveToCloudBlob(merged);
  await onMerge(merged);
  return { success: true, mergedAt };
}

function mergeHabits(remote: SpiritualHabit[], local: SpiritualHabit[]): SpiritualHabit[] {
  const map = new Map<string, SpiritualHabit>();
  for (const h of [...remote, ...local]) {
    const existing = map.get(h.id);
    if (!existing) map.set(h.id, h);
    else {
      const dates = new Set([...existing.completedDates, ...h.completedDates]);
      map.set(h.id, { ...existing, completedDates: [...dates] });
    }
  }
  return [...map.values()];
}

function mergeStats(a: ActivityStats, b: ActivityStats): ActivityStats {
  return {
    tasbihTotal: Math.max(a.tasbihTotal, b.tasbihTotal),
    habitsCompletedTotal: Math.max(a.habitsCompletedTotal, b.habitsCompletedTotal),
    duasReadCount: Math.max(a.duasReadCount, b.duasReadCount),
    quranSessions: Math.max(a.quranSessions, b.quranSessions),
    prayerStreakDays: Math.max(a.prayerStreakDays, b.prayerStreakDays),
    lastActiveDate: a.lastActiveDate > b.lastActiveDate ? a.lastActiveDate : b.lastActiveDate,
    weeklyActivity: a.weeklyActivity.map((v, i) => Math.max(v, b.weeklyActivity[i] ?? 0)),
  };
}

export function payloadToJson(payload: SyncPayload): string {
  return JSON.stringify(payload, null, 2);
}

export function parseSyncJson(raw: string): SyncPayload | null {
  try {
    const parsed = JSON.parse(raw) as SyncPayload;
    if (parsed.version !== 1) return null;
    return parsed;
  } catch {
    return null;
  }
}
