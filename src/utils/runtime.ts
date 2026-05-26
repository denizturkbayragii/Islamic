import Constants from 'expo-constants';
import { Platform } from 'react-native';

/** Running inside Expo Go (not a custom dev/production build). */
export function isExpoGo(): boolean {
  return Constants.appOwnership === 'expo';
}

/**
 * Scheduled local notifications work best in a development build.
 * Expo Go on Android (SDK 53+) has limited notification support.
 */
export function supportsScheduledNotifications(): boolean {
  if (!isExpoGo()) return true;
  if (Platform.OS === 'android') return false;
  return true;
}

export function getNotificationLimitationKey(): 'none' | 'expoGoAndroid' | 'expoGoIos' {
  if (!isExpoGo()) return 'none';
  if (Platform.OS === 'android') return 'expoGoAndroid';
  return 'expoGoIos';
}
