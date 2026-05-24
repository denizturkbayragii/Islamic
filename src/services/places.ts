import type { NearbyPlace } from '../types';

/**
 * Fetches nearby places via OpenStreetMap Overpass API (no API key required).
 * For production, consider Google Places or dedicated halal/mosque APIs.
 */
export async function fetchNearbyPlaces(
  latitude: number,
  longitude: number,
  type: 'mosque' | 'prayer_room' | 'halal_restaurant',
  radiusMeters = 5000
): Promise<NearbyPlace[]> {
  const osmFilters: Record<string, string> = {
    mosque: '["amenity"="place_of_worship"]["religion"="muslim"]',
    prayer_room: '["amenity"="place_of_worship"]',
    halal_restaurant:
      '["amenity"~"restaurant|fast_food"]["diet:halal"="yes"]',
  };

  const filter = osmFilters[type] ?? osmFilters.mosque;
  const query = `
    [out:json][timeout:25];
    (
      node${filter}(around:${radiusMeters},${latitude},${longitude});
      way${filter}(around:${radiusMeters},${latitude},${longitude});
    );
    out center 30;
  `;

  try {
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    const data = await res.json();
    return (data.elements ?? [])
      .map((el: { id: number; lat?: number; lon?: number; center?: { lat: number; lon: number }; tags?: { name?: string; 'addr:street'?: string } }) => {
        const lat = el.lat ?? el.center?.lat;
        const lon = el.lon ?? el.center?.lon;
        if (lat == null || lon == null) return null;
        const dist = haversineKm(latitude, longitude, lat, lon);
        return {
          id: String(el.id),
          name: el.tags?.name ?? (type === 'halal_restaurant' ? 'Halal Restaurant' : 'Mosque'),
          latitude: lat,
          longitude: lon,
          distanceKm: Math.round(dist * 10) / 10,
          address: el.tags?.['addr:street'],
          type,
        } satisfies NearbyPlace;
      })
      .filter(Boolean)
      .sort((a: NearbyPlace, b: NearbyPlace) => a.distanceKm - b.distanceKm) as NearbyPlace[];
  } catch {
    return getDemoPlaces(latitude, longitude, type);
  }
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getDemoPlaces(lat: number, lon: number, type: NearbyPlace['type']): NearbyPlace[] {
  const labels: Record<string, string> = {
    mosque: 'Community Mosque',
    prayer_room: 'Prayer Room',
    halal_restaurant: 'Halal Kitchen',
  };
  return [0.8, 1.5, 2.3].map((dist, i) => ({
    id: `demo-${type}-${i}`,
    name: `${labels[type]} ${i + 1}`,
    latitude: lat + 0.001 * (i + 1),
    longitude: lon + 0.001 * (i + 1),
    distanceKm: dist,
    type,
  }));
}
