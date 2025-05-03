import React, { useState } from "react";
import {
  View,
  Linking,
  Image,
  Dimensions,
  ScrollView,
  Pressable,
  Modal,
  Platform,
} from "react-native";
import { Text, Button, Surface } from "react-native-paper";
import { Link } from "expo-router";
import { useAuth } from "../../components/authContext";
import { styles } from "../../components/styles";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const { width: screenWidth } = Dimensions.get("window");

const handleOpenURL = (url: string) => {
  Linking.openURL(url).catch((err) => console.error("An error occurred", err));
};

export default function Home() {
  const { isAuthenticated, logout, user } = useAuth();
  const [isZoomed, setIsZoomed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const carouselImages = [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("../../assets/media/facility.jpeg"),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("../../assets/media/door.jpeg"),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("../../assets/media/classroom.jpeg"),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("../../assets/media/dolls.jpeg"),
  ];

  const [modalImage, setModalImage] = useState(null);

  const handleImagePress = (index: number) => {
    setIsZoomed(true);
    setModalImage(carouselImages[index] ?? undefined);
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
      console.error("Logout error:", error);
    }
  };

  const renderGuestInfo = () => (
    <Text style={styles.infoText}>
      Eğitim için dersleri inceleyebilir, kayıt için bize ulaşabilirsiniz.
    </Text>
  );

  const renderUserInfo = () => (
    <View style={styles.userInfoContainer}>
      <View style={styles.userTextInfo}>
        <Text variant="bodyLarge" style={styles.cardText}>
          TCKN:
        </Text>
        <Text variant="bodyLarge" style={styles.cardText}>
          {user?.tckn ?? "-"}
        </Text>
      </View>
    </View>
  );

  const renderGuestActions = () => (
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
        <Button
          mode="contained"
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >
          Giriş / Kayıt
        </Button>
      </Link>
    </View>
  );

  const renderLogoutButton = () => (
    <Button
      mode="contained"
      style={styles.button}
      contentStyle={styles.buttonContent}
      labelStyle={styles.buttonLabel}
      onPress={handleLogout}
    >
      Çıkış Yap
    </Button>
  );

  const handleOpenAddress = () => {
    const address = "Bahçelievler Mh. 5006 Sk. No: 37 Manavgat / Antalya";
    const encodedAddress = encodeURIComponent(address);

    if (Platform.OS === "ios") {
      // Open Apple Maps
      Linking.openURL(`maps://?q=${encodedAddress}`).catch(() => {
        // Fallback to Apple Maps website if the app is not installed
        Linking.openURL(`https://maps.apple.com/?q=${encodedAddress}`);
      });
    } else {
      // Open Google Maps
      Linking.openURL(
        `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.card} elevation={3}>
        <View style={styles.cardWrapper}>
          <Text variant="titleMedium" style={styles.cardTitle}>
            {isAuthenticated ? "Kullanıcı Bilgileri" : "Bize Katılın"}
          </Text>

          {!isAuthenticated && renderGuestInfo()}

          <View style={styles.contentContainer}>
            {isAuthenticated ? renderUserInfo() : renderGuestActions()}
            {isAuthenticated && renderLogoutButton()}
          </View>
        </View>
      </Surface>

      <Surface style={[styles.card]} elevation={2}>
        <View style={styles.cardWrapper}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {carouselImages.map((image, index) => (
              <Pressable key={index} onPress={() => handleImagePress(index)}>
                <Image source={image} style={styles.carouselImage} />
              </Pressable>
            ))}
          </ScrollView>
          <Modal
            visible={modalVisible}
            onRequestClose={closeModal}
            transparent={true}
            animationType="slide"
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ScrollView
                  key={modalVisible ? "modal-open" : "modal-closed"}
                  maximumZoomScale={2}
                  minimumZoomScale={1}
                  contentContainerStyle={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  {modalImage && (
                    <Pressable
                      onPress={closeModal}
                      style={{
                        width: "100%",
                        height: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        source={modalImage as any}
                        style={[
                          {
                            width: isZoomed ? screenWidth * 0.94 : screenWidth,
                            height: isZoomed ? screenWidth : 200,
                            resizeMode: "contain",
                            marginHorizontal: isZoomed ? 10 : 0,
                          },
                        ]}
                      />
                    </Pressable>
                  )}
                </ScrollView>
              </View>
            </View>
          </Modal>
        </View>
      </Surface>

      <Surface style={[styles.card]} elevation={2}>
        <View style={styles.cardWrapper}>
          <Text variant="titleMedium" style={styles.cardTitle}>
            Bize Ulaşın
          </Text>
          <View style={styles.contentContainer}>
            <View style={styles.contactRow}>
              <MaterialIcons
                name="location-on"
                size={20}
                color="#7289da"
                style={styles.icon}
              />
              <Text
                variant="bodyMedium"
                style={styles.cardText}
                onPress={handleOpenAddress}
              >
                Bahçelievler Mh. 5006 Sk. No: 37 Manavgat / Antalya
              </Text>
            </View>

            <View style={styles.contactRow}>
              <MaterialCommunityIcons
                name="instagram"
                size={20}
                color="#e56969"
                style={styles.icon}
              />
              <Text
                variant="bodyMedium"
                style={styles.cardText}
                onPress={() =>
                  handleOpenURL("https://www.instagram.com/da_ilkyardim")
                }
              >
                @da_ilkyardim
              </Text>
            </View>

            <View style={styles.contactRow}>
              <MaterialIcons
                name="phone"
                size={20}
                color="#BFBFBF"
                style={styles.icon}
              />
              <Text
                variant="bodyMedium"
                style={styles.cardText}
                onPress={() => handleOpenURL("tel:+905514818058")}
              >
                +90 551 481 80 58
              </Text>
            </View>

            <View style={styles.contactRow}>
              <MaterialIcons
                name="phone"
                size={20}
                color="#BFBFBF"
                style={styles.icon}
              />
              <Text
                variant="bodyMedium"
                style={styles.cardText}
                onPress={() => handleOpenURL("tel:+905437764489")}
              >
                +90 543 776 44 89
              </Text>
            </View>

            <View style={styles.contactRow}>
              <MaterialIcons
                name="email"
                size={20}
                color="#BFBFBF"
                style={styles.icon}
              />
              <Text
                variant="bodyMedium"
                style={[styles.cardText, { marginBottom: 0 }]}
                onPress={() =>
                  handleOpenURL("mailto:denizantalyailkyardim@gmail.com")
                }
              >
                denizantalyailkyardim@gmail.com{" "}
              </Text>
            </View>
          </View>
        </View>
      </Surface>
    </ScrollView>
  );
}
