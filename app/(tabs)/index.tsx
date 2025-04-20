// Suggested code may be subject to a license. Learn more: ~LicenseLog:1486970087.
// Suggested code may be subject to a license. Learn more: ~LicenseLog:3116330810.
// Suggested code may be subject to a license. Learn more: ~LicenseLog:3354868539.
import { View, StyleSheet, Linking, Image, Dimensions, ScrollView, Pressable, Modal} from 'react-native';
import { Text, Button, Surface, } from 'react-native-paper';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const { width: screenWidth } = Dimensions.get('window');

export default function Home() {
  const insets = useSafeAreaInsets();

  const [isZoomed, setIsZoomed] = useState(false);


  const handleOpenURL = (url: string) => {
    Linking.openURL(url).catch((err) => console.error('An error occurred', err));
  };

  const carouselImages = [
    require('../../assets/carousel/classroom.jpeg'),
    require('../../assets/carousel/dolls.jpeg'),
    require('../../assets/carousel/door.jpeg'),
    require('../../assets/carousel/facility.jpeg'),
  ];

  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  const handleImagePress = (index: number) => {
    setIsZoomed(true);
    setModalImage(carouselImages[index] || undefined);
    setModalVisible(true);
  };
  const closeModal = () => {
    setIsZoomed(false);
    setModalVisible(false);
  };




  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.scrollViewContent}>
      <Text variant="headlineMedium" style={styles.title}>
      {/*İlkyardım Eğitimleri*/}
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
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              {carouselImages.map((image, index) => (
                <Pressable key={index} onPress={() => handleImagePress(index)}>
                  <Image
                    source={image} style={styles.carouselImage}
                     />

                </Pressable>
              ))}
          </ScrollView>
          <Modal
            visible={modalVisible}
            onRequestClose={closeModal}
            transparent={true}
            animationType="slide"
          >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:'rgba(0,0,0,0.5)' }}>
              <View >
                <ScrollView  maximumZoomScale={2} minimumZoomScale={1} contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', }}>
                    { modalImage && (
                    <Pressable onPress={closeModal} >
                      <Image
                          source={modalImage as any} style={[{width: isZoomed ? screenWidth * 0.9 : screenWidth, height: isZoomed ? screenWidth : 200, resizeMode: 'contain', marginHorizontal: isZoomed ? 10 : 0}]}
                        />
                    </Pressable>)} 
                </ScrollView>
              </View>
            </View>
          </Modal>
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
    </ScrollView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#282b30',
  },
  title: {
    marginBottom: 24,
    color: '#FFFFFF',
    textAlign: 'left',
    fontSize: 16,
  },
  scrollViewContent: {
    paddingBottom: 200,
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
    padding: 10,
    fontSize: 20,
    textAlign:'center',
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
  button: {
    marginTop: 8,
    backgroundColor: '#7289da',
  },
  buttonContent: {
    height: 32,
  },
  buttonLabel: {
    fontSize: 16,
    letterSpacing: 0.5,
    color: '#FFFFFF',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 10,
    width: 24, 
    textAlign: 'center',
  },
  carouselImage: {
    width: screenWidth,
    height: 200,
    resizeMode: 'cover',
  },
});