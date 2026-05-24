const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

/** Bearing from user location to Kaaba (0–360°, clockwise from North). */
export function getQiblaBearing(latitude: number, longitude: number): number {
  const lat1 = toRad(latitude);
  const lat2 = toRad(KAABA_LAT);
  const dLng = toRad(KAABA_LNG - longitude);

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  const bearing = toDeg(Math.atan2(y, x));
  return (bearing + 360) % 360;
}

export function getDistanceToKaaba(latitude: number, longitude: number): number {
  const R = 6371;
  const dLat = toRad(KAABA_LAT - latitude);
  const dLng = toRad(KAABA_LNG - longitude);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(latitude)) * Math.cos(toRad(KAABA_LAT)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
