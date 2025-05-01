import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, router, Stack } from "expo-router";
import { Text, Button } from "react-native-paper";
import { getPdfUri, PDFInfo } from "../../utils/pdfCache";
import * as FileSystem from "expo-file-system";

export default function PdfViewer() {
  const { fileName, title } = useLocalSearchParams();
  const [pdfInfo, setPdfInfo] = useState<PDFInfo>({ localUri: "" });

  const loadPdf = async () => {
    try {
      console.log("Loading PDF:", fileName);
      const result = await getPdfUri(fileName as string);
      console.log("PDF load result:", result);
      setPdfInfo(result);
    } catch (err) {
      console.error("Error loading PDF:", err);
      Alert.alert("Hata", "PDF yüklenirken beklenmeyen bir hata oluştu.");
    }
  };

  useEffect(() => {
    loadPdf();
  }, [fileName]);
  const openInExternalViewer = async () => {
    try {
      if (pdfInfo.localUri) {
        if (Platform.OS === "ios") {
          const contentUri = await FileSystem.getContentUriAsync(
            pdfInfo.localUri
          );
          console.log("Opening in external viewer (iOS):", contentUri);
          await FileSystem.getContentUriAsync(contentUri);
        } else {
          const contentUri = `file://${pdfInfo.localUri}`;
          console.log("Opening in external viewer (Android):", contentUri);
          await FileSystem.getContentUriAsync(contentUri).then((res) => {
            console.log("Response:", res);
          });
        }
      } else {
        throw new Error("PDF dosyası bulunamadı");
      }
    } catch (err) {
      console.error("Error opening external viewer:", err);
      Alert.alert(
        "Hata",
        "PDF harici görüntüleyicide açılamadı. Lütfen cihazınızda bir PDF görüntüleyici olduğundan emin olun."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: title as string,
          headerStyle: {
            backgroundColor: "#282b30",
          },
          headerTintColor: "#fff",
        }}
      />
      {pdfInfo.localUri ? (
        <View style={styles.container}>
          <WebView
            style={styles.webview}
            source={{
              uri: `file://${pdfInfo.localUri}`,
            }}
          />
          <View
            style={[
              styles.contentContainer,
              {
                flexDirection: "row",
                justifyContent: "center",
                gap: 20,
                alignItems: "center",
              },
            ]}
          >
            <Button
              mode="outlined"
              onPress={openInExternalViewer}
              style={styles.returnButton}
            >
              Harici Görüntüleyicide Aç
            </Button>
            <Button
              mode="outlined"
              onPress={() => router.back()}
              style={styles.returnButton}
            >
              Geri Dön
            </Button>
          </View>
        </View>
      ) : (
        <View style={styles.contentContainer}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#7289da" />
            <Text style={styles.loadingText}>Yükleniyor...</Text>
          </View>
          <View
            style={[
              styles.contentContainer,
              {
                flexDirection: "row",
                justifyContent: "center",
                gap: 20,
                alignItems: "center",
                padding: 16,
                backgroundColor: "rgba(40, 43, 48, 0.9)",
              },
            ]}
          >
            <Button
              mode="outlined"
              onPress={openInExternalViewer}
              style={[styles.returnButton]}
            >
              Harici Görüntüleyicide Aç
            </Button>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#282b30",
  },
  contentContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  button: {
    backgroundColor: "#7289da",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  returnButton: {
    borderColor: "#ff4444",
    marginTop: 20,
  },
  loadingText: {
    marginTop: 10,
    color: "#FFFFFF",
  },
});
