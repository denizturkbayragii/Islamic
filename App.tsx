import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { AppProvider, useApp } from './src/context/AppContext';
import { AppNavigator } from './src/navigation/AppNavigator';

function Root() {
  const { darkMode } = useApp();
  return (
    <>
      <StatusBar style={darkMode ? 'light' : 'dark'} />
      <AppNavigator />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Root />
    </AppProvider>
  );
}
