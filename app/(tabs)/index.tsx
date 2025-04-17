import { View, StyleSheet } from 'react-native';
import { Text, Card, Button, Surface } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Home() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text variant="headlineMedium" style={styles.title}>İlkyardım Bilgileri</Text>
      
      <Surface style={styles.card} elevation={2}>
        <Text variant="titleLarge" style={styles.cardTitle}>Acil Durumlar</Text>
        <View style={styles.contentContainer}>
          <Text variant="bodyLarge" style={styles.cardText}>
            • Solunum Yolu Tıkanıklığı{'\n'}
            • Kalp Durması{'\n'}
            • Kanama{'\n'}
            • Yanıklar{'\n'}
            • Kırıklar
          </Text>
          <Button 
            mode="contained" 
            style={styles.button}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            Detaylı Bilgi
          </Button>
        </View>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#4A4A4A',
  },
  title: {
    marginBottom: 24,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  card: {
    borderRadius: 12,
    backgroundColor: '#4A4A4A',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#8C8C8C',
  },
  cardTitle: {
    padding: 16,
    paddingBottom: 8,
    color: '#FFFFFF',
    backgroundColor: '#B31B1B',
  },
  contentContainer: {
    padding: 16,
  },
  cardText: {
    marginBottom: 16,
    color: '#BFBFBF',
    lineHeight: 28,
  },
  button: {
    marginTop: 8,
    backgroundColor: '#B31B1B',
  },
  buttonContent: {
    height: 44,
  },
  buttonLabel: {
    fontSize: 16,
    letterSpacing: 0.5,
    color: '#FFFFFF',
  },
}); 