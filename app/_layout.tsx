import { Slot } from 'expo-router';
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Load saved theme preference
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme) {
          setIsDarkMode(savedTheme === 'dark');
        } else {
          // If no saved preference, use system preference
          setIsDarkMode(colorScheme === 'dark');
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      }
    };
    loadThemePreference();
  }, [colorScheme]);

  const theme = isDarkMode ? MD3DarkTheme : MD3LightTheme;

  return (
    <PaperProvider theme={theme}>
      <Slot />
    </PaperProvider>
  );
} 