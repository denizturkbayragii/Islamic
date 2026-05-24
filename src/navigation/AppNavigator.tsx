import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { colors } from '../constants/theme';
import { useApp } from '../context/AppContext';
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
  return (
    <Stack.Navigator screenOptions={{ headerShown: true, headerTintColor: colors.primary }}>
      <Stack.Screen name="Education" component={EducationScreen} options={{ title: 'Education' }} />
      <Stack.Screen name="EducationDetail" component={EducationDetailScreen} options={{ title: 'Topic' }} />
    </Stack.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true, headerTintColor: colors.primary }}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Quran" component={QuranScreen} options={{ title: 'Quran' }} />
      <Stack.Screen name="QuranReader" component={QuranReaderScreen} options={{ title: 'Surah' }} />
      <Stack.Screen name="Hadith" component={HadithScreen} options={{ title: 'Hadith' }} />
      <Stack.Screen name="Qibla" component={QiblaScreen} options={{ title: 'Qibla' }} />
      <Stack.Screen name="Places" component={PlacesScreen} options={{ title: 'Nearby' }} />
      <Stack.Screen name="Tasbih" component={TasbihScreen} options={{ title: 'Tasbih' }} />
      <Stack.Screen name="Calendar" component={CalendarScreen} options={{ title: 'Islamic Calendar' }} />
      <Stack.Screen name="Habits" component={HabitsScreen} options={{ title: 'Spiritual Habits' }} />
      <Stack.Screen name="Duties" component={DutiesScreen} options={{ title: 'Zakat & Sadaqa' }} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} options={{ title: 'Notifications' }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Stack.Navigator>
  );
}

export function AppNavigator() {
  const { darkMode } = useApp();
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
        <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Home' }} />
        <Tab.Screen
          name="WorshipTab"
          component={QiblaScreen}
          options={{ title: 'Worship', headerShown: true, headerTintColor: colors.primary }}
        />
        <Tab.Screen name="LearnTab" component={LearnStack} options={{ title: 'Learn' }} />
        <Tab.Screen
          name="MoreTab"
          component={SettingsScreen}
          options={{ title: 'More', headerShown: true, headerTintColor: colors.primary }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
