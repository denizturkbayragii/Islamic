import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { colors } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import { CalendarScreen } from '../screens/CalendarScreen';
import { DutiesScreen } from '../screens/DutiesScreen';
import { EducationDetailScreen } from '../screens/EducationDetailScreen';
import { EducationScreen } from '../screens/EducationScreen';
import { HabitsScreen } from '../screens/HabitsScreen';
import { HadithScreen } from '../screens/HadithScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { NotificationSettingsScreen } from '../screens/NotificationSettingsScreen';
import { PlacesScreen } from '../screens/PlacesScreen';
import { QiblaScreen } from '../screens/QiblaScreen';
import { QuranReaderScreen } from '../screens/QuranReaderScreen';
import { QuranScreen } from '../screens/QuranScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { TasbihScreen } from '../screens/TasbihScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function LearnStack() {
  const { t } = useTranslation();
  return (
    <Stack.Navigator screenOptions={{ headerShown: true, headerTintColor: colors.primary }}>
      <Stack.Screen name="Education" component={EducationScreen} options={{ title: t('nav.education') }} />
      <Stack.Screen name="EducationDetail" component={EducationDetailScreen} options={{ title: t('nav.topic') }} />
    </Stack.Navigator>
  );
}

function HomeStack() {
  const { t } = useTranslation();
  return (
    <Stack.Navigator screenOptions={{ headerShown: true, headerTintColor: colors.primary }}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Quran" component={QuranScreen} options={{ title: t('nav.quran') }} />
      <Stack.Screen name="QuranReader" component={QuranReaderScreen} options={{ title: t('nav.surah') }} />
      <Stack.Screen name="Hadith" component={HadithScreen} options={{ title: t('nav.hadith') }} />
      <Stack.Screen name="Qibla" component={QiblaScreen} options={{ title: t('nav.qibla') }} />
      <Stack.Screen name="Places" component={PlacesScreen} options={{ title: t('nav.nearby') }} />
      <Stack.Screen name="Tasbih" component={TasbihScreen} options={{ title: t('nav.tasbih') }} />
      <Stack.Screen name="Calendar" component={CalendarScreen} options={{ title: t('nav.calendar') }} />
      <Stack.Screen name="Habits" component={HabitsScreen} options={{ title: t('nav.habits') }} />
      <Stack.Screen name="Duties" component={DutiesScreen} options={{ title: t('nav.duties') }} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} options={{ title: t('nav.notifications') }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: t('nav.settings') }} />
    </Stack.Navigator>
  );
}

export function AppNavigator() {
  const { darkMode } = useApp();
  const { t } = useTranslation();
  const navTheme = darkMode
    ? { ...DarkTheme, colors: { ...DarkTheme.colors, primary: colors.accent, background: colors.backgroundDark, card: colors.surfaceDark } }
    : { ...DefaultTheme, colors: { ...DefaultTheme.colors, primary: colors.primary, background: colors.background, card: colors.surface } };

  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: '#888',
          tabBarIcon: ({ color, size }) => {
            const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
              HomeTab: 'home',
              WorshipTab: 'moon',
              LearnTab: 'book',
              MoreTab: 'grid',
            };
            return <Ionicons name={icons[route.name] ?? 'ellipse'} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: t('tabs.home') }} />
        <Tab.Screen
          name="WorshipTab"
          component={QiblaScreen}
          options={{ title: t('tabs.worship'), headerShown: true, headerTintColor: colors.primary }}
        />
        <Tab.Screen name="LearnTab" component={LearnStack} options={{ title: t('tabs.learn') }} />
        <Tab.Screen
          name="MoreTab"
          component={SettingsScreen}
          options={{ title: t('tabs.more'), headerShown: true, headerTintColor: colors.primary }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
