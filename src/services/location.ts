import * as Location from 'expo-location';
import { getJson, setJson, storageKeys } from './storage';

export interface StoredLocation {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
  updatedAt: string;
}

export async function getCurrentLocation(): Promise<StoredLocation | null> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return getJson<StoredLocation | null>(storageKeys.lastLocation, null);

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  let city: string | undefined;
  let country: string | undefined;
  try {
    const [geo] = await Location.reverseGeocodeAsync({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
    city = geo.city ?? geo.subregion ?? undefined;
    country = geo.country ?? undefined;
  } catch {
    /* geocode optional */
  }

  const loc: StoredLocation = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    city,
    country,
    updatedAt: new Date().toISOString(),
  };
  await setJson(storageKeys.lastLocation, loc);
  return loc;
}

export async function getCachedLocation(): Promise<StoredLocation | null> {
  return getJson<StoredLocation | null>(storageKeys.lastLocation, null);
}
