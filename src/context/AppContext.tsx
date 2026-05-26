import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { DEFAULT_SETTINGS } from '../constants/defaults';
import { scheduleCustomReminders } from '../services/advancedReminders';
import { initAudio } from '../services/audio';
import { buildSyncPayload, loadFromCloudBlob, performCloudSync, type SyncPayload } from '../services/cloudSync';
import { getCachedLocation, getCurrentLocation, type StoredLocation } from '../services/location';
import { schedulePrayerNotifications, setupNotificationChannels } from '../services/notifications';
import { migrateSettings } from '../services/settingsMigration';
import { getProfileJson, setProfileJson } from '../services/profileData';
import {
  loadHadithProgress,
  loadQuranProgress,
} from '../services/readingProgress';
import { computeHabitScore, loadStats, recordActivity } from '../services/statistics';
import { getJson, setJson, storageKeys } from '../services/storage';
import type {
  ActivityStats,
  AIChatMessage,
  CustomReminder,
  FamilyMember,
  HadithProgress,
  HomeFeatureId,
  QuranProgress,
  SpiritualHabit,
  ThemeId,
  UserSettings,
} from '../types';

interface AppContextValue {
  settings: UserSettings;
  updateSettings: (patch: Partial<UserSettings>) => Promise<void>;
  location: StoredLocation | null;
  refreshLocation: () => Promise<void>;
  habits: SpiritualHabit[];
  addHabit: (habit: Omit<SpiritualHabit, 'id' | 'completedDates'>) => Promise<void>;
  toggleHabitToday: (id: string) => Promise<void>;
  family: FamilyMember[];
  addFamilyMember: (member: Omit<FamilyMember, 'id' | 'habitIds'>) => Promise<void>;
  removeFamilyMember: (id: string) => Promise<void>;
  setActiveFamilyMember: (id: string | null) => Promise<void>;
  stats: ActivityStats;
  refreshStats: () => Promise<void>;
  trackActivity: (type: 'tasbih' | 'habit' | 'dua' | 'quran' | 'prayer') => Promise<void>;
  habitScore: number;
  aiMessages: AIChatMessage[];
  sendAIMessage: (text: string, reply: string) => Promise<void>;
  clearAIChat: () => Promise<void>;
  syncNow: () => Promise<{ success: boolean; mergedAt: string }>;
  exportSyncPayload: () => Promise<SyncPayload>;
  importSyncPayload: (payload: SyncPayload) => Promise<void>;
  addCustomReminder: (reminder: Omit<CustomReminder, 'id'>) => Promise<void>;
  removeCustomReminder: (id: string) => Promise<void>;
  markDuaRead: (duaId: string) => Promise<void>;
  quranProgress: QuranProgress;
  hadithProgress: HadithProgress;
  refreshReadingProgress: () => Promise<void>;
  updateHomeLauncher: (order: HomeFeatureId[]) => Promise<void>;
  reloadProfileData: () => Promise<void>;
  loading: boolean;
  darkMode: boolean;
  toggleDarkMode: () => void;
  setThemeId: (id: ThemeId) => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [location, setLocation] = useState<StoredLocation | null>(null);
  const [habits, setHabits] = useState<SpiritualHabit[]>([]);
  const [family, setFamily] = useState<FamilyMember[]>([]);
  const [stats, setStats] = useState<ActivityStats>({
    tasbihTotal: 0,
    habitsCompletedTotal: 0,
    duasReadCount: 0,
    quranSessions: 0,
    prayerStreakDays: 0,
    lastActiveDate: '',
    weeklyActivity: [0, 0, 0, 0, 0, 0, 0],
  });
  const [aiMessages, setAiMessages] = useState<AIChatMessage[]>([]);
  const [quranProgress, setQuranProgress] = useState<QuranProgress>({ lastRead: null, bookmarks: [] });
  const [hadithProgress, setHadithProgress] = useState<HadithProgress>({ lastRead: null, bookmarks: [] });
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const profileId = settings.activeFamilyMemberId;

  const refreshStats = useCallback(async () => {
    const s = await loadStats(profileId);
    setStats(s);
  }, [profileId]);

  const reloadProfileData = useCallback(async () => {
    const memberId = settings.activeFamilyMemberId;
    const [h, s, q, hd] = await Promise.all([
      getProfileJson<SpiritualHabit[]>(storageKeys.habits, memberId, []),
      loadStats(memberId),
      loadQuranProgress(memberId),
      loadHadithProgress(memberId),
    ]);
    setHabits(h);
    setStats(s);
    setQuranProgress(q);
    setHadithProgress(hd);
  }, [settings.activeFamilyMemberId]);

  const refreshReadingProgress = useCallback(async () => {
    const memberId = settings.activeFamilyMemberId;
    const [q, hd] = await Promise.all([loadQuranProgress(memberId), loadHadithProgress(memberId)]);
    setQuranProgress(q);
    setHadithProgress(hd);
  }, [settings.activeFamilyMemberId]);

  useEffect(() => {
    (async () => {
      await setupNotificationChannels();
      void initAudio();
      const [rawSettings, cachedLoc, savedFamily, savedChat] = await Promise.all([
        getJson(storageKeys.settings, DEFAULT_SETTINGS),
        getCachedLocation(),
        getJson<FamilyMember[]>(storageKeys.family, []),
        getJson<AIChatMessage[]>(storageKeys.aiChat, []),
      ]);
      const savedSettings = migrateSettings(rawSettings);
      setSettings(savedSettings);
      void setJson(storageKeys.settings, savedSettings);
      setLocation(cachedLoc);
      setFamily(savedFamily);
      setAiMessages(savedChat);
      const memberId = savedSettings.activeFamilyMemberId;
      const [savedHabits, savedStats, qProg, hProg] = await Promise.all([
        getProfileJson<SpiritualHabit[]>(storageKeys.habits, memberId, []),
        loadStats(memberId),
        loadQuranProgress(memberId),
        loadHadithProgress(memberId),
      ]);
      setHabits(savedHabits);
      setStats(savedStats);
      setQuranProgress(qProg);
      setHadithProgress(hProg);
      if (savedSettings.customReminders.length > 0) {
        void scheduleCustomReminders(savedSettings.customReminders);
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!loading) void reloadProfileData();
  }, [settings.activeFamilyMemberId, loading]);

  const refreshLocation = useCallback(async () => {
    const loc = await getCurrentLocation();
    setLocation(loc);
    if (loc) {
      await schedulePrayerNotifications(loc.latitude, loc.longitude, settings);
    }
  }, [settings]);

  useEffect(() => {
    if (location && settings.globalNotificationsEnabled) {
      schedulePrayerNotifications(location.latitude, location.longitude, settings);
    }
  }, [location, settings]);

  const updateSettings = useCallback(async (patch: Partial<UserSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      void setJson(storageKeys.settings, next);
      if (location && next.globalNotificationsEnabled) {
        void schedulePrayerNotifications(location.latitude, location.longitude, next);
      }
      if (patch.customReminders || next.customReminders) {
        void scheduleCustomReminders(next.customReminders);
      }
      return next;
    });
  }, [location]);

  const addHabit = useCallback(async (habit: Omit<SpiritualHabit, 'id' | 'completedDates'>) => {
    const newHabit: SpiritualHabit = {
      ...habit,
      id: Date.now().toString(),
      completedDates: [],
    };
    setHabits((prev) => {
      const next = [...prev, newHabit];
      void setProfileJson(storageKeys.habits, settings.activeFamilyMemberId, next);
      return next;
    });
  }, [settings.activeFamilyMemberId]);

  const toggleHabitToday = useCallback(async (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setHabits((prev) => {
      const next = prev.map((h) => {
        if (h.id !== id) return h;
        const has = h.completedDates.includes(today);
        if (!has) void recordActivity(settings.activeFamilyMemberId, 'habit');
        return {
          ...h,
          completedDates: has
            ? h.completedDates.filter((d) => d !== today)
            : [...h.completedDates, today],
        };
      });
      void setProfileJson(storageKeys.habits, settings.activeFamilyMemberId, next);
      void refreshStats();
      return next;
    });
  }, [refreshStats, settings.activeFamilyMemberId]);

  const addFamilyMember = useCallback(async (member: Omit<FamilyMember, 'id' | 'habitIds'>) => {
    const newMember: FamilyMember = {
      ...member,
      id: Date.now().toString(),
      habitIds: [],
    };
    setFamily((prev) => {
      const next = [...prev, newMember];
      void setJson(storageKeys.family, next);
      return next;
    });
  }, []);

  const removeFamilyMember = useCallback(async (id: string) => {
    setFamily((prev) => {
      const next = prev.filter((m) => m.id !== id);
      void setJson(storageKeys.family, next);
      return next;
    });
    if (settings.activeFamilyMemberId === id) {
      await updateSettings({ activeFamilyMemberId: null });
    }
  }, [settings.activeFamilyMemberId, updateSettings]);

  const setActiveFamilyMember = useCallback(
    async (id: string | null) => {
      await updateSettings({ activeFamilyMemberId: id });
    },
    [updateSettings]
  );

  const updateHomeLauncher = useCallback(
    async (order: HomeFeatureId[]) => {
      await updateSettings({ homeLauncher: { order } });
    },
    [updateSettings]
  );

  const trackActivity = useCallback(
    async (type: 'tasbih' | 'habit' | 'dua' | 'quran' | 'prayer') => {
      const next = await recordActivity(settings.activeFamilyMemberId, type);
      setStats(next);
    },
    [settings.activeFamilyMemberId]
  );

  const sendAIMessage = useCallback(async (text: string, reply: string) => {
    const now = new Date().toISOString();
    setAiMessages((prev) => {
      const next: AIChatMessage[] = [
        ...prev,
        { id: `${now}-u`, role: 'user', content: text, timestamp: now },
        { id: `${now}-a`, role: 'assistant', content: reply, timestamp: now },
      ];
      void setJson(storageKeys.aiChat, next);
      return next;
    });
  }, []);

  const clearAIChat = useCallback(async () => {
    setAiMessages([]);
    await setJson(storageKeys.aiChat, []);
  }, []);

  const exportSyncPayload = useCallback(async () => {
    return buildSyncPayload(settings, habits, family, stats);
  }, [settings, habits, family, stats]);

  const importSyncPayload = useCallback(async (payload: SyncPayload) => {
    setSettings(payload.settings);
    setHabits(payload.habits);
    setFamily(payload.family);
    setStats(payload.stats);
    await Promise.all([
      setJson(storageKeys.settings, payload.settings),
      setJson(storageKeys.habits, payload.habits),
      setJson(storageKeys.family, payload.family),
      setJson(storageKeys.stats, payload.stats),
      setJson(storageKeys.tasbih, payload.tasbih),
      setJson(storageKeys.duaProgress, payload.duaProgress),
    ]);
    if (payload.settings.customReminders.length > 0) {
      await scheduleCustomReminders(payload.settings.customReminders);
    }
  }, []);

  const syncNow = useCallback(async () => {
    const local = await buildSyncPayload(settings, habits, family, stats);
    const result = await performCloudSync(local, importSyncPayload);
    await updateSettings({
      cloudSync: { ...settings.cloudSync, lastSyncAt: result.mergedAt, syncEnabled: true },
    });
    await refreshStats();
    return result;
  }, [settings, habits, family, stats, importSyncPayload, updateSettings, refreshStats]);

  const addCustomReminder = useCallback(
    async (reminder: Omit<CustomReminder, 'id'>) => {
      const newR: CustomReminder = { ...reminder, id: Date.now().toString() };
      const next = [...settings.customReminders, newR];
      await updateSettings({ customReminders: next });
      await scheduleCustomReminders(next);
    },
    [settings.customReminders, updateSettings]
  );

  const removeCustomReminder = useCallback(
    async (id: string) => {
      const next = settings.customReminders.filter((r) => r.id !== id);
      await updateSettings({ customReminders: next });
      await scheduleCustomReminders(next);
    },
    [settings.customReminders, updateSettings]
  );

  const markDuaRead = useCallback(async (duaId: string) => {
    const progress = await getJson<Record<string, number>>(storageKeys.duaProgress, {});
    progress[duaId] = (progress[duaId] ?? 0) + 1;
    await setJson(storageKeys.duaProgress, progress);
    await trackActivity('dua');
  }, [trackActivity]);

  const toggleDarkMode = useCallback(() => setDarkMode((d) => !d), []);

  const setThemeId = useCallback(
    async (id: ThemeId) => {
      await updateSettings({ themeId: id });
    },
    [updateSettings]
  );

  const habitScore = computeHabitScore(habits);

  return (
    <AppContext.Provider
      value={{
        settings,
        updateSettings,
        location,
        refreshLocation,
        habits,
        addHabit,
        toggleHabitToday,
        family,
        addFamilyMember,
        removeFamilyMember,
        setActiveFamilyMember,
        stats,
        refreshStats,
        trackActivity,
        habitScore,
        aiMessages,
        sendAIMessage,
        clearAIChat,
        syncNow,
        exportSyncPayload,
        importSyncPayload,
        addCustomReminder,
        removeCustomReminder,
        markDuaRead,
        quranProgress,
        hadithProgress,
        refreshReadingProgress,
        updateHomeLauncher,
        reloadProfileData,
        loading,
        darkMode,
        toggleDarkMode,
        setThemeId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
