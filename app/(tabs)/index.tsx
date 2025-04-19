import { View, StyleSheet, Linking, Text as RNText } from 'react-native';
import { Text, Button, Surface } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function Home() {
  const insets = useSafeAreaInsets();

  const handleOpenURL = (url: string) => {
    Linking.openURL(url).catch((err) => console.error('An error occurred', err));
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text variant="headlineMedium" style={styles.title}>
        İlkyardım Eğitimleri
      </Text>
      
      <Surface style={[styles.card, {marginBottom:16}]} elevation={2}>
        <Text variant="titleLarge" style={styles.cardTitle}>
          Acil Durumlar
        </Text>
        <View style={styles.contentContainer}>
          <Text variant="bodyLarge" style={styles.cardText}>
            • Solunum Yolu Tıkanıklığı{'\n'}• Kalp Durması{'\n'}• Kanama{'\n'}•
            Yanıklar{'\n'}• Kırıklar
          </Text>
          <Button
            mode="contained"
            style={styles.button}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}>
            Detaylı Bilgi
          </Button>
        </View>
      </Surface>

      <Surface style={[styles.card, {marginBottom:16}]} elevation={2}>
        <Text variant="titleMedium" style={styles.cardTitle}>Bize Ulaşın</Text>
        <View style={styles.contentContainer}>
        <View style={styles.contactRow}>
            <MaterialIcons name="location-on" size={24} color="#BFBFBF" style={styles.icon} />
            <Text 
              variant="bodyLarge" 
              style={styles.cardText} 
              onPress={() => handleOpenURL('https://www.google.com/maps/search/?api=1&query=Bah%C3%A7elievler+Mh.+5006+Sk.+No:+37+Manavgat+%2F+Antalya')}
            >
              Bahçelievler Mh. 5006 Sk. No: 37 Manavgat / Antalya
            </Text>
          </View>
          <View style={styles.contactRow}>
            <MaterialCommunityIcons name="instagram" size={24} color="#BFBFBF" style={styles.icon} />
            <Text 
              variant="bodyLarge" 
              style={styles.cardText} 
              onPress={() => handleOpenURL('https://www.instagram.com/da_ilkyardim')}
            >
              @da_ilkyardim
            </Text>
          </View>
          <View style={styles.contactRow}>
            <MaterialIcons name="phone" size={24} color="#BFBFBF" style={styles.icon} />
            <Text 
              variant="bodyLarge" 
              style={styles.cardText}
              onPress={() => handleOpenURL('tel:+905514818058')}
            >
              +90 551 481 80 58
            </Text>
          </View>
          <View style={styles.contactRow}>
            <MaterialIcons name="phone" size={24} color="#BFBFBF" style={styles.icon} />
             <Text 
              variant="bodyLarge" 
              style={styles.cardText}
              onPress={() => handleOpenURL('tel:+905437764489')}
            >
              +90 543 776 44 89
            </Text>
           </View>
          <View style={styles.contactRow}>
            <MaterialIcons name="email" size={24} color="#BFBFBF" style={styles.icon} />
            <Text 
              variant="bodyLarge" 
              style={styles.cardText} 
              onPress={() => handleOpenURL('mailto:denizantalyailkyardim@gmail.com')}
            >
              denizantalyailkyardim@gmail.com
            </Text>
          </View>
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
    color: '#FFFFFF',
    backgroundColor: '#B31B1B',
    padding: 10,
  },
  contentContainer: {
    padding: 10,
  },
  cardText: {
    marginBottom: 16,
    color: '#BFBFBF',
    lineHeight: 24,
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
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    marginRight: 10,
    width: 24, 
    textAlign: 'center',
  },
});