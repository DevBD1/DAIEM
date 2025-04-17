import { View, StyleSheet } from 'react-native';
import { Text, Switch, List } from 'react-native-paper';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

export default function Settings() {
  const colorScheme = useColorScheme();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    // Load saved theme preference
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme) {
          setDarkMode(savedTheme === 'dark');
        } else {
          setDarkMode(colorScheme === 'dark');
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      }
    };
    loadThemePreference();
  }, [colorScheme]);

  const handleThemeChange = async (value: boolean) => {
    setDarkMode(value);
    try {
      await AsyncStorage.setItem('theme', value ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  return (
    <View style={styles.container}>
      <List.Section>
        <List.Subheader>Uygulama Ayarları</List.Subheader>
        <List.Item
          title="Karanlık Mod"
          right={() => (
            <Switch value={darkMode} onValueChange={handleThemeChange} />
          )}
        />
        <List.Item
          title="Bildirimler"
          right={() => (
            <Switch value={notifications} onValueChange={setNotifications} />
          )}
        />
      </List.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
}); 