import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';

export default function Classroom() {
  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>İlkyardım Eğitimi</Text>
      
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">Temel İlkyardım</Text>
          <Text variant="bodyMedium" style={styles.cardText}>
            • İlkyardımın ABC'si
            • Temel Yaşam Desteği
            • Hasta/Yaralı Taşıma
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained">Başla</Button>
        </Card.Actions>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">Yaralanmalar</Text>
          <Text variant="bodyMedium" style={styles.cardText}>
            • Kesik ve Sıyrıklar
            • Yanıklar
            • Kırıklar ve Çıkıklar
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained">Başla</Button>
        </Card.Actions>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">Acil Durumlar</Text>
          <Text variant="bodyMedium" style={styles.cardText}>
            • Kalp Krizi
            • Şok
            • Zehirlenmeler
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained">Başla</Button>
        </Card.Actions>
      </Card>
    </ScrollView>
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