import { Magnetometer } from 'expo-sensors';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../components/Card';
import { useApp } from '../context/AppContext';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';
import { getDistanceToKaaba, getQiblaBearing } from '../services/qibla';

export function QiblaScreen() {
  const { location, refreshLocation } = useApp();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [heading, setHeading] = useState(0);

  useEffect(() => {
    refreshLocation();
  }, []);

  useEffect(() => {
    Magnetometer.setUpdateInterval(200);
    const sub = Magnetometer.addListener((data) => {
      const angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
      setHeading((angle + 360) % 360);
    });
    return () => sub.remove();
  }, []);

  const qiblaBearing = location ? getQiblaBearing(location.latitude, location.longitude) : 0;
  const distance = location ? getDistanceToKaaba(location.latitude, location.longitude) : 0;
  const rotation = (qiblaBearing - heading + 360) % 360;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Card>
        <View style={styles.compassWrap}>
          <View style={[styles.compass, { borderColor: colors.primary }]}>
            <View
              style={[
                styles.needle,
                { backgroundColor: colors.accent, transform: [{ rotate: `${rotation}deg` }] },
              ]}
            />
            <Text style={[styles.north, { color: colors.textSecondary }]}>N</Text>
          </View>
        </View>
        <Text style={[styles.bearing, { color: colors.primary }]}>
          {t('qibla.qibla')}: {Math.round(qiblaBearing)}°
        </Text>
        {location && (
          <Text style={[styles.dist, { color: colors.textSecondary }]}>
            {t('qibla.distance')}: {Math.round(distance).toLocaleString()} {t('qibla.km')}
          </Text>
        )}
        {!location && (
          <Text style={{ color: colors.warning, textAlign: 'center' }}>{t('qibla.enableLocation')}</Text>
        )}
      </Card>
      <Text style={[styles.tip, { color: colors.textSecondary }]}>{t('qibla.tip')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  compassWrap: { alignItems: 'center', paddingVertical: 24 },
  compass: { width: 220, height: 220, borderRadius: 110, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  needle: { position: 'absolute', width: 4, height: 90, borderRadius: 2, top: 20 },
  north: { position: 'absolute', top: 12, fontWeight: '700' },
  bearing: { fontSize: 22, fontWeight: '700', textAlign: 'center' },
  dist: { textAlign: 'center', marginTop: 8 },
  tip: { textAlign: 'center', marginTop: 16, paddingHorizontal: 24, lineHeight: 22 },
});
