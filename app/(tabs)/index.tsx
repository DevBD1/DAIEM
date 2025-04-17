import { View, StyleSheet } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>İlkyardım Bilgileri</Text>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">Acil Durumlar</Text>
          <Text variant="bodyMedium" style={styles.cardText}>
            • Solunum Yolu Tıkanıklığı
            • Kalp Durması
            • Kanama
            • Yanıklar
            • Kırıklar
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained">Detaylı Bilgi</Button>
        </Card.Actions>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    marginBottom: 16,
  },
  cardText: {
    marginTop: 8,
    lineHeight: 24,
  },
}); 