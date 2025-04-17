import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import * as Linking from 'expo-linking';

export default function Classroom() {
  const handleOpenDocument = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>İlkyardım Eğitimi</Text>
      
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">Genel İlkyardım Bilgileri</Text>
          <Text variant="bodyMedium" style={styles.cardText}>
            İlkyardımın temel prensipleri ve genel yaklaşım
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button 
            mode="contained"
            onPress={() => handleOpenDocument('https://drive.google.com/file/d/1Kr3OyfidEu-Z-y0Q2wWZYEsinKHFKCIm/view?usp=sharing')}
          >
            Dökümanı Aç
          </Button>
        </Card.Actions>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">Vücut Sistemleri</Text>
          <Text variant="bodyMedium" style={styles.cardText}>
            Solunum yolu tıkanıklığı durumunda yapılması gerekenler
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button 
            mode="contained"
            onPress={() => handleOpenDocument('https://drive.google.com/file/d/1Kr3OyfidEu-Z-y0Q2wWZYEsinKHFKCIm/view?usp=sharing')}
          >
            Dökümanı Aç
          </Button>
        </Card.Actions>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">Acil Taşıma Teknikleri</Text>
          <Text variant="bodyMedium" style={styles.cardText}>
            Temel yaşam desteği uygulamaları
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button 
            mode="contained"
            onPress={() => handleOpenDocument('https://drive.google.com/file/d/1Kr3OyfidEu-Z-y0Q2wWZYEsinKHFKCIm/view?usp=sharing')}
          >
            Dökümanı Aç
          </Button>
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