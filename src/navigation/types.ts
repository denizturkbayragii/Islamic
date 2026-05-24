export type RootStackParamList = {
  MainTabs: undefined;
  Home: undefined;
  Quran: undefined;
  QuranReader: { surahNumber: number; edition: string; surahName: string };
  Hadith: undefined;
  Qibla: undefined;
  Places: { type: 'mosque' | 'prayer_room' | 'halal_restaurant' };
  Tasbih: undefined;
  Calendar: undefined;
  Education: undefined;
  EducationDetail: { topicId: string };
  Habits: undefined;
  Duties: undefined;
  NotificationSettings: undefined;
  Settings: undefined;
};
