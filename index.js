import { registerRootComponent } from 'expo';
import Constants from 'expo-constants';
import { LogBox } from 'react-native';
import App from './App';

// Expo Go cannot fully run expo-notifications (SDK 53+); dev builds are required for production.
if (Constants.appOwnership === 'expo') {
  LogBox.ignoreLogs([
    'expo-notifications: Android Push notifications',
    '`expo-notifications` functionality is not fully supported in Expo Go',
  ]);
}

registerRootComponent(App);
