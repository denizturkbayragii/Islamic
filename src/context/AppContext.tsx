import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { DEFAULT_SETTINGS } from '../constants/defaults';
import type { SpiritualHabit, UserSettings } from '../types';
import { getCachedLocation, getCurrentLocation, type StoredLocation } from '../services/location';
import { schedulePrayerNotifications, setupNotificationChannels } from '../services/notifications';
import { migrateSettings } from '../services/settingsMigration';
import { getJson, setJson, storageKeys } from '../services/storage';

interface AppContextValue {
  settings: UserSettings;
  updateSettings: (patch: Partial<UserSettings>) => Promise<void>;
  location: StoredLocation | null;
  refreshLocation: () => Promise<void>;
  habits: SpiritualHabit[];
  addHabit: (habit: Omit<SpiritualHabit, 'id' | 'completedDates'>) => Promise<void>;
  toggleHabitToday: (id: string) => Promise<void>;
  loading: boolean;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [location, setLocation] = useState<StoredLocation | null>(null);
  const [habits, setHabits] = useState<SpiritualHabit[]>([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    (async () => {
      await setupNotificationChannels();
      const [rawSettings, savedHabits, cachedLoc] = await Promise.all([
        getJson(storageKeys.settings, DEFAULT_SETTINGS),
        getJson<SpiritualHabit[]>(storageKeys.habits, []),
        getCachedLocation(),
      ]);
      const savedSettings = migrateSettings(rawSettings);
      setSettings(savedSettings);
      void setJson(storageKeys.settings, savedSettings);
      setHabits(savedHabits);
      setLocation(cachedLoc);
      setLoading(false);
    })();
  }, []);

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
      setJson(storageKeys.habits, next);
      return next;
    });
  }, []);

  const toggleHabitToday = useCallback(async (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setHabits((prev) => {
      const next = prev.map((h) => {
        if (h.id !== id) return h;
        const has = h.completedDates.includes(today);
        return {
          ...h,
          completedDates: has
            ? h.completedDates.filter((d) => d !== today)
            : [...h.completedDates, today],
        };
      });
      setJson(storageKeys.habits, next);
      return next;
    });
  }, []);

  const toggleDarkMode = useCallback(() => setDarkMode((d) => !d), []);

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
        loading,
        darkMode,
        toggleDarkMode,
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
