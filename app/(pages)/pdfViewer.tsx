import React, { useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, router, Stack } from "expo-router";
import { Text, Button } from "react-native-paper";
import { getPdfUri, PDFInfo } from "../../utils/pdfCache";
import * as FileViewer from "expo-file-viewer";


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

  const openPdf = async () => {
    try {
      await FileViewer.openFile(pdfInfo.localUri, { displayName: title as string });
    } catch (e) {
      console.error("Error opening PDF:", e);
      Alert.alert("Hata", "PDF açılırken bir hata oluştu.");
    }
  }
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: title as string,
          headerStyle: {
            backgroundColor: "#282b30",
          },
          headerTintColor: "#FF0000",
        }}
      />
      {pdfInfo.localUri ? (
        <View style={styles.container}>
          <View style={styles.loadingContainer}>
          <Button mode="outlined" onPress={openPdf} style={styles.returnButton}>
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
              <Button mode="outlined" onPress={openPdf} style={styles.returnButton}>
              Harici Görüntüleyicide Aç
            </Button>

          </View>
        </View>
      )}
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#282b30",
  },
  contentContainer: {
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
