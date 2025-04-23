import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Switch, Surface } from 'react-native-paper';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const insets = useSafeAreaInsets();

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={[
        styles.scrollViewContent, 
        { 
          paddingTop: 40,
          paddingBottom: 8
        }
      ]}
    >
      <Text variant="headlineMedium" style={[styles.title, { marginBottom: 16 }]}>Uygulama Ayarları</Text>

      <Surface style={[styles.card]} elevation={2}>
        <View style={styles.cardWrapper}>
          <Text variant="titleLarge" style={styles.cardTitle}>Bildirimler</Text>
          <View style={styles.contentContainer}>
            <View style={styles.settingRow}>
              <Text variant="titleMedium" style={[styles.cardText, { marginBottom: 0 }]}>
                Bildirim İzinleri
              </Text>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                color="#7289da"
              />
            </View>
          </View>
        </View>
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
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
    borderWidth: 1,
    borderColor: '#8C8C8C',
    marginBottom: 16,
  },
  cardWrapper: {
    overflow: 'hidden',
    borderRadius: 24,
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