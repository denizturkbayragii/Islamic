import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { useApp } from '../context/AppContext';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';
import { getCurrentLocation } from '../services/location';
import { fetchNearbyPlaces } from '../services/places';
import type { NearbyPlace } from '../types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Places'>;

export function PlacesScreen({ route }: Props) {
  const { type } = route.params;
  const { location, refreshLocation } = useApp();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const loc = location ?? (await getCurrentLocation());
      if (!loc) await refreshLocation();
      const coords = loc ?? location;
      if (coords) {
        const results = await fetchNearbyPlaces(coords.latitude, coords.longitude, type);
        setPlaces(results);
      }
      setLoading(false);
    })();
  }, [location, type]);

  const openMaps = (p: NearbyPlace) => {
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${p.latitude},${p.longitude}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>{t(`places.${type}`)}</Text>
      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={places}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 40 }}>
              {t('places.empty')}
            </Text>
          }
          renderItem={({ item }) => (
            <Pressable
              style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => openMaps(item)}
            >
              <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
              <Text style={{ color: colors.textSecondary }}>
                {item.distanceKm} {t('qibla.km')} {item.address ? `· ${item.address}` : ''}
              </Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 16 },
  row: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 10 },
  name: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
});
