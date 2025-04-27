import React from 'react';
import { useState, useEffect } from 'react'; // Add useEffect
import { View, StyleSheet, Linking, Image, Dimensions, ScrollView, Pressable, Modal, Platform, Alert } from 'react-native';
import { Text, Button, Surface } from 'react-native-paper';
import { router } from 'expo-router';
import { Link } from 'expo-router';
import { useAuth } from '../(pages)/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const { width: screenWidth } = Dimensions.get('window');

export default function Home() {
  const { isAuthenticated, logout, user } = useAuth();
  const insets = useSafeAreaInsets();
  const [isZoomed, setIsZoomed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const loadQuestionsAnswered = async () => {
      try {
        const answered = await AsyncStorage.getItem('questionsAnswered');
        setQuestionsAnswered(answered ? parseInt(answered) : 0);
      } catch (error) {
        console.error('Error loading questions answered:', error);
      }
    };

    const loadProfileImage = async () => {
      try {
        const savedImage = await AsyncStorage.getItem('userProfileImage');
        if (savedImage) {
          setProfileImage(savedImage);
        }
      } catch (error) {
        console.error('Error loading profile image:', error);
      }
    };

    if (isAuthenticated) {
      loadQuestionsAnswered();
      loadProfileImage();
    }
  }, [isAuthenticated]);

  const handleOpenURL = (url: string) => {
    Linking.openURL(url).catch((err) => console.error('An error occurred', err));
  };

  const carouselImages = [
    require('../../assets/media/facility.jpeg'),
    require('../../assets/media/door.jpeg'),
    require('../../assets/media/classroom.jpeg'),
    require('../../assets/media/dolls.jpeg'),
  ];

  const [modalImage, setModalImage] = useState(null);
  
  const handleImagePress = (index: number) => {
    setIsZoomed(true);
    setModalImage(carouselImages[index] || undefined);
    setModalVisible(true);
  };

  const closeModal = () => {
    setIsZoomed(false);
    setModalVisible(false);
    setModalImage(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleOpenAddress = () => {
    const address = 'Bahçelievler Mh. 5006 Sk. No: 37 Manavgat / Antalya';
    const encodedAddress = encodeURIComponent(address);
    
    if (Platform.OS === 'ios') {
      // Open Apple Maps
      Linking.openURL(`maps://?q=${encodedAddress}`).catch(() => {
        // Fallback to Apple Maps website if the app is not installed
        Linking.openURL(`https://maps.apple.com/?q=${encodedAddress}`);
      });
    } else {
      // Open Google Maps
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`);
    }
  };

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      await AsyncStorage.setItem('userProfileImage', result.assets[0].uri);
    } else {
      console.log('You did not select any image.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollViewContent}>
      <Surface style={styles.card} elevation={2}>
        <View style={styles.cardWrapper}>
          <Text variant="titleMedium" style={styles.cardTitle}>
            {isAuthenticated ? 'Kullanıcı Bilgileri' : 'Bize Katılın'}
          </Text>
            {!isAuthenticated && <Text style={[styles.infoText]}>Eğitim için dersleri inceleyebilir, kayıt için bize ulaşabilirsiniz.</Text>}
          <View style={styles.contentContainer}>
            {isAuthenticated ? (
              <View style={styles.userInfoContainer}>
                <View style={styles.userTextInfo}>
                  <Text variant="bodyLarge" style={styles.cardText}>TCKN: {user?.tckn || '-'}</Text>
                  <Text variant="bodyLarge" style={styles.cardText}>Cevaplanan Soru: {questionsAnswered}</Text>
                </View>
                <Pressable onPress={pickImageAsync}>
                  <Image 
                    source={profileImage ? { uri: profileImage } : require('../../assets/profile.png')} 
                    style={styles.profileImage} 
                  />
                  <View style={styles.profileImageOverlay}>
                    <MaterialIcons name="photo-camera" size={20} color="#FFFFFF" />
                  </View>
                </Pressable>
              </View>
            ) : (
              <>
                <View style={styles.buttonContainer}>
                  <Button
                    mode="contained"
                    style={[styles.button, { flex: 1, marginRight: 8 }]}
                    contentStyle={styles.buttonContent}
                    labelStyle={styles.buttonLabel}
                    onPress={handleOpenAddress}
                  >
                    Adresimiz
                  </Button>
                  <Link href="/(pages)/login" asChild>
                    <Button mode="contained" style={styles.button} contentStyle={styles.buttonContent} labelStyle={styles.buttonLabel}>
                      Giriş / Kayıt
                    </Button>
                  </Link>
                </View>
              </>
            )}
            {isAuthenticated && (
              <Button 
                mode="contained" 
                style={styles.button} 
                contentStyle={styles.buttonContent} 
                labelStyle={styles.buttonLabel} 
                onPress={handleLogout}
              >
                Çıkış Yap
              </Button>
            )}
          </View>
        </View>
      </Surface>

      <Surface style={[styles.card]} elevation={2}>
        <View style={styles.cardWrapper}>
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
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <ScrollView 
                  key={modalVisible ? 'modal-open' : 'modal-closed'}
                  maximumZoomScale={2} 
                  minimumZoomScale={1} 
                  contentContainerStyle={{ 
                    flex: 1, 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    width: '100%',
                    height: '100%'
                  }}
                >
                  {modalImage && (
                  <Pressable 
                    onPress={closeModal} 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      justifyContent: 'center', 
                      alignItems: 'center' 
                    }}
                  >
                    <Image
                      source={modalImage as any} 
                      style={[
                        {
                          width: isZoomed ? screenWidth * 0.94 : screenWidth, 
                          height: isZoomed ? screenWidth : 200, 
                          resizeMode: 'contain', 
                          marginHorizontal: isZoomed ? 10 : 0
                        }
                      ]}
                    />
                  </Pressable>)} 
                </ScrollView>
              </View>
            </View>
          </Modal>
        </View>
      </Surface>

      <Surface style={[styles.card]} elevation={2}>
        <View style={styles.cardWrapper}>
          <Text variant="titleMedium" style={styles.cardTitle}>Bize Ulaşın</Text>
          <View style={styles.contentContainer}>
            
            <View style={styles.contactRow}>
              <MaterialIcons name="location-on" size={20} color="#7289da" style={styles.icon} />
              <Text 
                variant="bodyMedium" 
                style={styles.cardText} 
                onPress={handleOpenAddress}
              >
                Bahçelievler Mh. 5006 Sk. No: 37 Manavgat / Antalya
              </Text>
            </View>

            <View style={styles.contactRow}>
              <MaterialCommunityIcons name="instagram" size={20} color="#e56969" style={styles.icon} />
              <Text 
                variant="bodyMedium" 
                style={styles.cardText} 
                onPress={() => handleOpenURL('https://www.instagram.com/da_ilkyardim')}
              >
                @da_ilkyardim
              </Text>
            </View>

            <View style={styles.contactRow}>
              <MaterialIcons name="phone" size={20} color="#BFBFBF" style={styles.icon} />
              <Text 
                variant="bodyMedium" 
                style={styles.cardText}
                onPress={() => handleOpenURL('tel:+905514818058')}
              >
                +90 551 481 80 58
              </Text>
            </View>

            <View style={styles.contactRow}>
            <MaterialIcons name="phone" size={20} color="#BFBFBF" style={styles.icon} />
               <Text 
                variant="bodyMedium" 
                style={styles.cardText}
                onPress={() => handleOpenURL('tel:+905437764489')}
              >
                +90 543 776 44 89
              </Text>
             </View>

            <View style={styles.contactRow}>
            <MaterialIcons name="email" size={20} color="#BFBFBF" style={styles.icon} />
              <Text
                variant="bodyMedium"
                style={[styles.cardText, { marginBottom: 0 }]}
                 onPress={() => handleOpenURL('mailto:denizantalyailkyardim@gmail.com')}
                 >
                denizantalyailkyardim@gmail.com{' '}
              </Text>
            </View>

          </View>
        </View>
      </Surface>
    </ScrollView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: '#282b30',
  },
  scrollViewContent: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  infoText: {
    paddingTop: 10,
    paddingLeft: 10,
    color: '#FFFFFF'
  },
  link: {
    color: 'lightblue',
    textDecorationLine: 'underline',
    backgroundColor: '#424549',
    padding: 10,
    fontSize: 20,
    textAlign:'center',
  },
  contentContainer: {
    padding: 10,
  },
  userInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  userTextInfo: {
    flex: 1,
    marginRight: 16,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileImageOverlay: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 4,
  },
  button: {
    marginTop: 0,
    backgroundColor: '#7289da',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonContent: {
    height: 40,
  },
  buttonLabel: {
    fontSize: 14,
    letterSpacing: 0.5,
    color: '#FFFFFF',
  },
  carouselImage: {
    width: screenWidth,
    height: 200,
    resizeMode: 'cover',
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
    padding: 4,
    fontSize: 18,
    textAlign: 'center',
  },
  cardText: {
    marginBottom: 0,
    color: '#FFFFFF',
    lineHeight: 20,
    fontSize: 12,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    paddingVertical: 8,
  },
  icon: {
    marginRight: 10,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFFFFF',
  },

});