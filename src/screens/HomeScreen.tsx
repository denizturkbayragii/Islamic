import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../components/Card';
import { GradientHero } from '../components/GradientHero';
import { HomeAppIcon } from '../components/HomeAppIcon';
import { HomeWidgetModule } from '../components/HomeWidgetModule';
import { getHomeFeature } from '../constants/homeFeatures';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useFeatureAccess } from '../hooks/useFeatureAccess';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';
import { gregorianToHijri } from '../services/hijriCalendar';
import { getNextPrayer, getPrayerTimes } from '../services/prayerTimes';
import type { HomeFeatureId } from '../types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { location, refreshLocation, loading, settings, habitScore, stats, quranProgress, hadithProgress } = useApp();
  const { session, isGuest, logout } = useAuth();
  const { canAccess } = useFeatureAccess();
  const { colors } = useTheme();
  const { t, prayer } = useTranslation();

  useEffect(() => {
    refreshLocation();
  }, []);

  const hijri = useMemo(() => gregorianToHijri(new Date()), []);
  const schedule = useMemo(() => {
    if (!location) return null;
    return getPrayerTimes(
      location.latitude,
      location.longitude,
      new Date(),
      settings.calculationMethod,
      settings.madhab
    );
  }, [location, settings]);

  const nextPrayer = useMemo(() => {
    if (!location) return null;
    return getNextPrayer(
      location.latitude,
      location.longitude,
      settings.calculationMethod,
      settings.madhab
    );
  }, [location, settings]);

  const openFeature = (id: HomeFeatureId) => {
    if (!canAccess(id)) {
      Alert.alert(t('home.guestLocked'), t('auth.guestBanner'));
      return;
    }
    const def = getHomeFeature(id);
    if (!def?.route) return;
    // @ts-expect-error dynamic route params
    navigation.navigate(def.route, def.routeParams);
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const launcherIds = settings.homeLauncher.order;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <GradientHero>
          <Text style={styles.bismillah}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</Text>
          <Text style={styles.appName}>{t('app.name')}</Text>
          <Text style={styles.hijri}>{hijri.formatted}</Text>
          {session && (
            <Text style={styles.sessionLine}>
              {t('auth.signedInAs', { name: session.pseudonym })}
              {isGuest ? ` · ${t('auth.guest')}` : ''}
            </Text>
          )}
          {location ? (
            <Text style={styles.location}>
              <Ionicons name="location" size={14} /> {location.city ?? t('home.yourLocation')}
              {location.country ? `, ${location.country}` : ''}
            </Text>
          ) : (
            <Pressable onPress={refreshLocation}>
              <Text style={styles.locationTap}>{t('home.tapLocation')}</Text>
            </Pressable>
          )}
        </GradientHero>

        {isGuest && (
          <Pressable style={[styles.guestBanner, { backgroundColor: colors.warning + '22', borderColor: colors.warning }]}>
            <Ionicons name="lock-closed" size={18} color={colors.warning} />
            <Text style={[styles.guestBannerText, { color: colors.text }]}>{t('auth.guestBanner')}</Text>
          </Pressable>
        )}

        {(quranProgress.lastRead || hadithProgress.lastRead) && (
          <Card>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('home.continueReading')}</Text>
            {quranProgress.lastRead && (
              <Pressable onPress={() => openFeature('quran')} style={styles.continueRow}>
                <Ionicons name="book" size={20} color={colors.primary} />
                <Text style={{ color: colors.text, flex: 1, marginLeft: 10 }}>
                  {t('reading.continueQuran')}: {quranProgress.lastRead.surahName} · {t('reading.ayah')}{' '}
                  {quranProgress.lastRead.ayahNumber}
                </Text>
              </Pressable>
            )}
            {hadithProgress.lastRead && (
              <Pressable onPress={() => openFeature('hadith')} style={styles.continueRow}>
                <Ionicons name="document-text" size={20} color={colors.primary} />
                <Text style={{ color: colors.text, flex: 1, marginLeft: 10 }}>
                  {t('reading.continueHadith')}: {hadithProgress.lastRead.collectionName}
                </Text>
              </Pressable>
            )}
          </Card>
        )}

        <View style={styles.launcherHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>{t('home.myApps')}</Text>
          <Pressable onPress={() => navigation.navigate('HomeLauncherEdit')}>
            <Text style={{ color: colors.primary, fontWeight: '700' }}>{t('home.editApps')}</Text>
          </Pressable>
        </View>

        <View style={styles.launcherGrid}>
          {launcherIds.map((id) => {
            const def = getHomeFeature(id);
            if (!def) return null;

            if (id === 'module_prayer_times') {
              return (
                <View key={id} style={styles.moduleFull}>
                  {nextPrayer && (
                    <Card style={styles.nextCard}>
                      <Text style={[styles.nextLabel, { color: colors.textSecondary }]}>{t('home.nextPrayer')}</Text>
                      <Text style={[styles.nextName, { color: colors.primary }]}>{prayer(nextPrayer.name)}</Text>
                      <Text style={[styles.nextTime, { color: colors.text }]}>
                        {t('home.in')} {nextPrayer.remaining}
                      </Text>
                      {stats.prayerStreakDays > 0 && (
                        <View style={[styles.streakBadge, { backgroundColor: colors.accent + '30' }]}>
                          <Ionicons name="flame" size={14} color={colors.accent} />
                          <Text style={{ color: colors.primary, fontWeight: '600', marginLeft: 4 }}>
                            {stats.prayerStreakDays} {t('stats.streak').toLowerCase()}
                          </Text>
                        </View>
                      )}
                    </Card>
                  )}
                  {schedule && (
                    <Card>
                      <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('home.todayTimes')}</Text>
                      {(['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const).map((p) => (
                        <View key={p} style={[styles.prayerRow, { borderBottomColor: colors.border }]}>
                          <Text style={{ color: colors.text }}>{prayer(p)}</Text>
                          <Text style={{ color: colors.primary, fontWeight: '600' }}>{schedule.times[p]}</Text>
                        </View>
                      ))}
                    </Card>
                  )}
                </View>
              );
            }

            if (id === 'module_widget') {
              return (
                <View key={id} style={styles.moduleFull}>
                  <HomeWidgetModule />
                </View>
              );
            }

            const locked = !canAccess(id);
            return (
              <HomeAppIcon
                key={id}
                icon={def.icon}
                label={t(def.titleKey)}
                color={def.color}
                locked={locked}
                onPress={() => openFeature(id)}
              />
            );
          })}
        </View>

        <Pressable onPress={() => navigation.navigate('Settings')} style={styles.settingsLink}>
          <Ionicons name="settings-outline" size={18} color={colors.textSecondary} />
          <Text style={{ color: colors.textSecondary, marginLeft: 6 }}>{t('nav.settings')}</Text>
        </Pressable>
        {!isGuest && (
          <Pressable onPress={logout} style={styles.settingsLink}>
            <Text style={{ color: colors.error }}>{t('auth.logout')}</Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 32 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  bismillah: { color: 'rgba(255,255,255,0.85)', fontSize: 16, textAlign: 'center' },
  appName: { color: '#fff', fontSize: 34, fontWeight: '800', textAlign: 'center', marginTop: 8 },
  hijri: { color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginTop: 8, fontSize: 15 },
  sessionLine: { color: 'rgba(255,255,255,0.75)', textAlign: 'center', marginTop: 6, fontSize: 12 },
  location: { color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginTop: 12 },
  locationTap: { color: '#E8C547', textAlign: 'center', marginTop: 12 },
  guestBanner: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
  guestBannerText: { flex: 1, fontSize: 13, lineHeight: 18 },
  continueRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  launcherHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 8 },
  launcherGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  moduleFull: { width: '100%' },
  nextCard: { alignItems: 'center' },
  nextLabel: { fontSize: 14 },
  nextName: { fontSize: 28, fontWeight: '700', marginTop: 4 },
  nextTime: { fontSize: 18, marginTop: 4 },
  streakBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 10, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  prayerRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth },
  settingsLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 16, padding: 8 },
});
