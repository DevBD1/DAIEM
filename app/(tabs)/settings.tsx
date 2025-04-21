import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Switch, Surface } from 'react-native-paper';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.scrollViewContent}>
      <Text variant="headlineMedium" style={[styles.title, { marginBottom: 16 }]}>Uygulama Ayarları</Text>

      <Surface style={[styles.card, { marginBottom: 16 }]} elevation={2}>
        <View style={styles.contentContainer}>
          <View style={styles.settingRow}>
            <Text variant="titleMedium" style={styles.cardText}>
              Bildirimler
            </Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              color="#7289da" // Consistent with button color
            />
          </View>
        </View>
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    paddingTop: 0,
    paddingBottom: 12,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#282b30',
  },
  title: {
    color: '#FFFFFF',
    textAlign: 'left',
    fontSize: 16,
  },
  card: {
    borderRadius: 24,
    backgroundColor: '#424549',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#8C8C8C',
  },
  cardTitle: {
    color: '#FFFFFF',
    backgroundColor: '#7289da',
    padding: 6,
    fontSize: 20,
    textAlign: 'center',
  },
  contentContainer: {
    padding: 10,
  },
  cardText: {
    marginBottom: 16,
    color: '#FFFFFF',
    lineHeight: 20,
    fontSize: 14,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8, // Add some vertical padding for visual separation
    paddingHorizontal: 10,
  },
}); 