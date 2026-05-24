import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../components/Card';
import { FeatureTile } from '../components/FeatureTile';
import { prayerLabels } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useTheme } from '../hooks/useTheme';
import { gregorianToHijri } from '../services/hijriCalendar';
import { getNextPrayer, getPrayerTimes } from '../services/prayerTimes';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { location, refreshLocation, loading, settings } = useApp();
  const { colors } = useTheme();

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

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, { backgroundColor: colors.primary }]}>
          <Text style={styles.bismillah}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</Text>
          <Text style={styles.appName}>Islamic</Text>
          <Text style={styles.hijri}>{hijri.formatted}</Text>
          {location ? (
            <Text style={styles.location}>
              <Ionicons name="location" size={14} /> {location.city ?? 'Your location'}
              {location.country ? `, ${location.country}` : ''}
            </Text>
          ) : (
            <Pressable onPress={refreshLocation}>
              <Text style={styles.locationTap}>Tap to enable location</Text>
            </Pressable>
          )}
        </View>

        {nextPrayer && (
          <Card style={styles.nextCard}>
            <Text style={[styles.nextLabel, { color: colors.textSecondary }]}>Next Prayer</Text>
            <Text style={[styles.nextName, { color: colors.primary }]}>
              {prayerLabels[nextPrayer.name]}
            </Text>
            <Text style={[styles.nextTime, { color: colors.text }]}>in {nextPrayer.remaining}</Text>
          </Card>
        )}

        {schedule && (
          <Card>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's Times</Text>
            {(['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const).map((p) => (
              <View key={p} style={styles.prayerRow}>
                <Text style={{ color: colors.text }}>{prayerLabels[p]}</Text>
                <Text style={{ color: colors.primary, fontWeight: '600' }}>{schedule.times[p]}</Text>
              </View>
            ))}
          </Card>
        )}

        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 8 }]}>Explore</Text>
        <FeatureTile icon="book" title="Quran" subtitle="Multiple translations & languages" onPress={() => navigation.navigate('Quran')} />
        <FeatureTile icon="document-text" title="Hadith" subtitle="Collections by tradition" onPress={() => navigation.navigate('Hadith')} />
        <FeatureTile icon="compass" title="Qibla Finder" subtitle="Direction to the Kaaba" onPress={() => navigation.navigate('Qibla')} />
        <FeatureTile icon="business" title="Nearby Mosques" subtitle="Mosques & prayer rooms" onPress={() => navigation.navigate('Places', { type: 'mosque' })} />
        <FeatureTile icon="restaurant" title="Halal Restaurants" subtitle="Especially abroad" onPress={() => navigation.navigate('Places', { type: 'halal_restaurant' })} />
        <FeatureTile icon="ellipse-outline" title="Digital Tasbih" subtitle="Dhikr counter" onPress={() => navigation.navigate('Tasbih')} />
        <FeatureTile icon="calendar" title="Islamic Calendar" subtitle="Hijri dates & events" onPress={() => navigation.navigate('Calendar')} />
        <FeatureTile icon="school" title="Education" subtitle="Multi-perspective learning" onPress={() => navigation.navigate('Education')} />
        <FeatureTile icon="heart" title="Spiritual Habits" subtitle="Track worship goals" onPress={() => navigation.navigate('Habits')} />
        <FeatureTile icon="calculator" title="Zakat & Sadaqa" subtitle="Religious duty calculators" onPress={() => navigation.navigate('Duties')} />
        <FeatureTile icon="notifications" title="Prayer Notifications" subtitle="Sounds, days & per-prayer control" onPress={() => navigation.navigate('NotificationSettings')} />
        <FeatureTile icon="settings" title="Settings" subtitle="Madhab, method & language" onPress={() => navigation.navigate('Settings')} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 32 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  hero: { borderRadius: 20, padding: 24, marginBottom: 16 },
  bismillah: { color: 'rgba(255,255,255,0.85)', fontSize: 16, textAlign: 'center' },
  appName: { color: '#fff', fontSize: 32, fontWeight: '700', textAlign: 'center', marginTop: 8 },
  hijri: { color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginTop: 8 },
  location: { color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginTop: 12 },
  locationTap: { color: '#E8C547', textAlign: 'center', marginTop: 12 },
  nextCard: { alignItems: 'center' },
  nextLabel: { fontSize: 14 },
  nextName: { fontSize: 28, fontWeight: '700', marginTop: 4 },
  nextTime: { fontSize: 18, marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  prayerRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#eee' },
});
