export type PrayerName = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export type Madhab = 'hanafi' | 'shafi' | 'maliki' | 'hanbali' | 'jafari';

export type CalculationMethodId =
  | 'muslimWorldLeague'
  | 'egyptian'
  | 'karachi'
  | 'ummAlQura'
  | 'dubai'
  | 'moonsightingCommittee'
  | 'northAmerica'
  | 'kuwait'
  | 'qatar'
  | 'singapore'
  | 'tehran'
  | 'turkey';

export type SectPreference = 'sunni' | 'shia' | 'neutral';

export type AppLanguage = 'en' | 'tr';

export interface PrayerNotificationSettings {
  enabled: boolean;
  sound: 'default' | 'adhan_short' | 'adhan_full' | 'silent';
  vibrate: boolean;
  advanceMinutes: number;
}

export interface PrayerSchedule {
  date: string;
  times: Record<PrayerName, string>;
}

export interface DisabledPrayerRule {
  prayer: PrayerName;
  daysOfWeek: number[];
  specificDates: string[];
}

export interface UserSettings {
  appLanguage: AppLanguage;
  quranEditionId: string;
  madhab: Madhab;
  calculationMethod: CalculationMethodId;
  sectPreference: SectPreference;
  locationReminderEnabled: boolean;
  prayerNotifications: Record<PrayerName, PrayerNotificationSettings>;
  disabledPrayerRules: DisabledPrayerRule[];
  globalNotificationsEnabled: boolean;
}

export interface SpiritualHabit {
  id: string;
  title: string;
  targetPerWeek: number;
  completedDates: string[];
  category: 'prayer' | 'quran' | 'dhikr' | 'charity' | 'fasting' | 'other';
}

export interface NearbyPlace {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  address?: string;
  type: 'mosque' | 'prayer_room' | 'halal_restaurant';
}

export interface EducationTopic {
  id: string;
  title: string;
  summary: string;
  perspectives: {
    sect: string;
    approach: string;
  }[];
}

export interface QuranEdition {
  id: string;
  name: string;
  language: string;
  translator?: string;
  sect?: SectPreference;
}

export interface HadithCollection {
  id: string;
  name: string;
  language: string;
  sect?: SectPreference;
}
