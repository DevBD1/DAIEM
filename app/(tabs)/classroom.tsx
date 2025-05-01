import { View, ScrollView } from "react-native";
import { Text, Button, Surface } from "react-native-paper";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { useAuth } from "../../components/authContext";
import { styles } from "../../components/styles";

interface DocumentFile {
  id: string;
  displayName: string;
  fileName: string;
}

export default function Classroom() {
  const [documentFiles, setDocumentFiles] = useState<DocumentFile[]>([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchClassroomData = async () => {
      if (!isAuthenticated) {
        setDocumentFiles([]);
        return;
      }
      const fetchDocumentFiles = async () => {
        const fileList: DocumentFile[] = [
          {
            id: "1",
            displayName: "Genel İlk Yardım Bilgileri",
            fileName: "01_genel_ilkyardim_bilgileri.pdf",
          },
          {
            id: "2",
            displayName: "Vücut Sistemleri",
            fileName: "02_vucut_sistemleri.pdf",
          },
          {
            id: "3",
            displayName: "Acil Taşıma Teknikleri",
            fileName: "03_acil_tasima_teknikleri.pdf",
          },
          {
            id: "4",
            displayName: "OED Kullanımı",
            fileName: "04_oed_ve_tyd.pdf",
          },
          {
            id: "5",
            displayName: "Havayolu Tıkanıklığı",
            fileName: "05_havayolu_tikanikliginda_ilkyardim.pdf",
          },
          {
            id: "6",
            displayName: "Bilinç Bozuklukları ve Ciddi Hastalıklar",
            fileName:
              "06_bilinc_bozukluklarinda_ve_ciddi_hastaliklarda_ilkyardim.pdf",
          },
          {
            id: "7",
            displayName: "Kanamalar",
            fileName: "07_kanamalarda_ilkyardim.pdf",
          },
          {
            id: "8",
            displayName: "Şok ve Göğüs Ağrısı",
            fileName: "08_sok_ve_gogus_agrisinda_ilkyardim.pdf",
          },
          {
            id: "9",
            displayName: "Yaralanmalar",
            fileName: "09_yaralanmalarda_ilkyardim.pdf",
          },
          {
            id: "10",
            displayName: "Boğulmalar",
            fileName: "10_bogulmalarda_ilkyardim.pdf",
          },
          {
            id: "11",
            displayName: "Kırık, Çıkık ve Burkulmalar",
            fileName: "11_kirik_cikik_ve_burkulmalarda_ilkyardim.pdf",
          },
          {
            id: "12",
            displayName: "Böcek ve Hayvan Isırıkları",
            fileName:
              "12_bocek_sokmalari_ve_hayvan_isiriklarinda_ilkyardim.pdf",
          },
          {
            id: "13",
            displayName: "Zehirlenmeler",
            fileName: "13_zehirlenmelerde_ilkyardim.pdf",
          },
          {
            id: "14",
            displayName: "Yanık, Soğuk ve Sıcak Acilleri",
            fileName: "14_yanik_soguk_ve_sicak_acillerinde_ilkyardim.pdf",
          },
          {
            id: "15",
            displayName: "Göz, Kulak ve Buruna Yabancı Cisim Kaçması",
            fileName:
              "15_goz_kulak_ve_buruna_yabanci_cisim_kacmasinda_ilkyardim.pdf",
          },
        ];
        setDocumentFiles(fileList);
      };

      try {
        await fetchDocumentFiles();
      } catch (e) {
        console.error(e);
      }
    };

    fetchClassroomData();
  }, [isAuthenticated]);

  const renderLoginCard = () => (
    <View style={[styles.container, { justifyContent: "center", flex: 1 }]}>
      <Surface style={[styles.card]} elevation={2}>
        <View style={styles.cardWrapper}>
          <Text variant="titleLarge" style={styles.cardTitle}>
            Giriş Gerekli
          </Text>
          <View style={styles.contentContainer}>
            <Text variant="bodyMedium" style={styles.cardText}>
              Derslere erişmek için giriş yapmanız gerekmektedir.
            </Text>
            <Button
              mode="contained"
              style={[styles.button, { marginTop: 16 }]}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              onPress={() => router.push("/(pages)/login")}
            >
              Giriş Yap
            </Button>
          </View>
        </View>
      </Surface>
    </View>
  );

  const handleOpenDocument = async (fileName: string, displayName: string) => {
    try {
      router.push({
        pathname: "/(pages)/pdfViewer",
        params: {
          fileName: fileName,
          title: displayName,
        },
      });
    } catch (err) {
      console.error("Error opening document:", err);
      alert("Dosya açılırken bir hata oluştu.");
    }
  };

  const navigateToQuiz = () => router.push("/(pages)/quiz");

  if (!isAuthenticated) {
    return renderLoginCard();
  }

  return (
    <ScrollView style={styles.container}>
      {/* Document Files Card */}
      <Surface style={styles.card} elevation={3}>
        <View style={styles.cardWrapper}>
          <Text variant="titleLarge" style={styles.cardTitle}>
            Dersler
          </Text>
          <View style={styles.contentContainer}>
            {documentFiles.map((document) => (
              <Button
                key={document.id}
                style={styles.documentButton}
                mode="text"
                onPress={() =>
                  handleOpenDocument(document.fileName, document.displayName)
                }
              >
                <Text
                  variant="bodyLarge"
                  style={[styles.cardText, { marginBottom: 0 }]}
                >
                  {document.displayName}
                </Text>
              </Button>
            ))}
          </View>
        </View>
      </Surface>

      {/* Quiz Card */}
      <Surface style={[styles.card]} elevation={3}>
        <View style={styles.cardWrapper}>
          <Text variant="titleLarge" style={styles.cardTitle}>
            Quiz
          </Text>
          <View style={styles.contentContainer}>
            <Text variant="bodyMedium" style={styles.cardText}>
              Bilgilerinizi pekiştirmek için Quiz uygulamasına katılabilirsiniz.
            </Text>
            <Button
              mode="contained"
              style={[styles.button]}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              onPress={navigateToQuiz}
            >
              Quiz&apos;e Git
            </Button>
          </View>
        </View>
      </Surface>
    </ScrollView>
  );
}
