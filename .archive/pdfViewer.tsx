import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import PdfRenderer from "react-native-pdf-renderer";
import * as FileSystem from "expo-file-system";
import { useLocalSearchParams, router } from "expo-router";
import { Text, Button } from "react-native-paper";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function PdfViewer() {
  const { fileName, title, url } = useLocalSearchParams<{
    fileName: string;
    title?: string;
    url: string;
  }>();

  const [pageUris, setPageUris] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(0);

  const localPath = FileSystem.documentDirectory + `pdfs/${fileName}`;

  const ensurePdfDownloaded = async (): Promise<string> => {
    const fileInfo = await FileSystem.getInfoAsync(localPath);
    if (!fileInfo.exists) {
      console.log("Downloading PDF from:", url);
      const result = await FileSystem.downloadAsync(url, localPath);
      return result.uri;
    }
    return fileInfo.uri;
  };

  const renderAllPages = async (pdfPath: string) => {
    try {
      const info = await PdfRenderer.getPageCount(pdfPath);
      setPageCount(info);

      const uris: string[] = [];
      for (let i = 1; i <= info; i++) {
        const img = await PdfRenderer.render({
          filePath: pdfPath,
          page: i,
          width: SCREEN_WIDTH * 2, // higher resolution
        });
        uris.push(img);
      }
      setPageUris(uris);
    } catch (err) {
      console.error("PDF rendering failed:", err);
      Alert.alert("Hata", "PDF render edilemedi.");
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const uri = await ensurePdfDownloaded();
        await renderAllPages(uri);
      } catch (err) {
        Alert.alert("Hata", "PDF yüklenemedi.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [fileName]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#7289da" />
        <Text style={styles.loadingText}>PDF yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title || fileName}</Text>
      <ScrollView contentContainerStyle={styles.pdfContainer}>
        {pageUris.map((uri, index) => (
          <Image
            key={index}
            source={{ uri }}
            style={styles.pdfImage}
            resizeMode="contain"
          />
        ))}
      </ScrollView>
      <View style={styles.buttonRow}>
        <Button
          mode="outlined"
          onPress={() => router.back()}
          style={styles.button}
        >
          Geri Dön
        </Button>
        <Text style={styles.pageText}>{pageCount} sayfa</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e2124",
    paddingTop: 8,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1e2124",
  },
  loadingText: {
    marginTop: 12,
    color: "#ccc",
  },
  title: {
    textAlign: "center",
    fontSize: 18,
    color: "#fff",
    marginVertical: 10,
  },
  pdfContainer: {
    alignItems: "center",
    padding: 10,
  },
  pdfImage: {
    width: SCREEN_WIDTH - 20,
    height: SCREEN_WIDTH * 1.41, // approx A4 aspect
    marginBottom: 12,
    borderRadius: 4,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",
  },
  button: {
    borderColor: "#7289da",
  },
  pageText: {
    color: "#aaa",
  },
});
