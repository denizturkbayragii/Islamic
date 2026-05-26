export type ThemeId = 'emerald' | 'midnight' | 'desert' | 'ocean' | 'rose';

export interface AppTheme {
  id: ThemeId;
  nameKey: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  accent: string;
  accentLight: string;
  background: string;
  backgroundDark: string;
  surface: string;
  surfaceDark: string;
  gradient: [string, string, string];
}

export const APP_THEMES: Record<ThemeId, AppTheme> = {
  emerald: {
    id: 'emerald',
    nameKey: 'themes.emerald',
    primary: '#0D3B2E',
    primaryLight: '#1A5C47',
    primaryDark: '#082820',
    accent: '#C9A227',
    accentLight: '#E8C547',
    background: '#F5F7F4',
    backgroundDark: '#0A1612',
    surface: '#FFFFFF',
    surfaceDark: '#142820',
    gradient: ['#0D3B2E', '#1A5C47', '#2E7D5A'],
  },
  midnight: {
    id: 'midnight',
    nameKey: 'themes.midnight',
    primary: '#1B2838',
    primaryLight: '#2C3E50',
    primaryDark: '#0F1419',
    accent: '#5DADE2',
    accentLight: '#85C1E9',
    background: '#ECEFF1',
    backgroundDark: '#0B0F14',
    surface: '#FFFFFF',
    surfaceDark: '#1A2332',
    gradient: ['#0B0F14', '#1B2838', '#2C3E50'],
  },
  desert: {
    id: 'desert',
    nameKey: 'themes.desert',
    primary: '#6B3E26',
    primaryLight: '#8B5A3C',
    primaryDark: '#4A2A18',
    accent: '#D4A574',
    accentLight: '#E8C9A0',
    background: '#FAF6F0',
    backgroundDark: '#1A1208',
    surface: '#FFFFFF',
    surfaceDark: '#2A1F14',
    gradient: ['#4A2A18', '#6B3E26', '#D4A574'],
  },
  ocean: {
    id: 'ocean',
    nameKey: 'themes.ocean',
    primary: '#0E4D6B',
    primaryLight: '#1A6B8F',
    primaryDark: '#083344',
    accent: '#48C9B0',
    accentLight: '#76D7C4',
    background: '#F0F8FA',
    backgroundDark: '#051820',
    surface: '#FFFFFF',
    surfaceDark: '#0F2A38',
    gradient: ['#051820', '#0E4D6B', '#48C9B0'],
  },
  rose: {
    id: 'rose',
    nameKey: 'themes.rose',
    primary: '#6B2D5B',
    primaryLight: '#8E4578',
    primaryDark: '#4A1F40',
    accent: '#E8B4BC',
    accentLight: '#F5D0D6',
    background: '#FDF5F8',
    backgroundDark: '#1A0A14',
    surface: '#FFFFFF',
    surfaceDark: '#2A1424',
    gradient: ['#4A1F40', '#6B2D5B', '#E8B4BC'],
  },
};

export const DEFAULT_THEME_ID: ThemeId = 'emerald';
