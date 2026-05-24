export const colors = {
  primary: '#0D3B2E',
  primaryLight: '#1A5C47',
  primaryDark: '#082820',
  accent: '#C9A227',
  accentLight: '#E8C547',
  background: '#F5F7F4',
  backgroundDark: '#0A1612',
  surface: '#FFFFFF',
  surfaceDark: '#142820',
  text: '#1A2E28',
  textSecondary: '#5A6F68',
  textOnPrimary: '#FFFFFF',
  textDark: '#E8F0EC',
  textSecondaryDark: '#9BB5AC',
  border: '#D4E0DB',
  borderDark: '#2A4038',
  success: '#2E7D5A',
  warning: '#B8860B',
  error: '#C0392B',
  cardShadow: 'rgba(13, 59, 46, 0.12)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  title: { fontSize: 28, fontWeight: '700' as const },
  heading: { fontSize: 20, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  caption: { fontSize: 13, fontWeight: '400' as const },
  label: { fontSize: 14, fontWeight: '500' as const },
};

export const prayerLabels: Record<string, string> = {
  fajr: 'Fajr',
  sunrise: 'Sunrise',
  dhuhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha',
};
