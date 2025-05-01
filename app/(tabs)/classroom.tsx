import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { Text, Button, Surface } from "react-native-paper";
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuth } from "../../components/authContext";
import { styles } from "../../components/styles";

interface DocumentFile {
  id: string;
  displayName: string;
  fileName: string;
}

const FILE_LIST_URL =
  "https://raw.githubusercontent.com/DenizAntalya/DAIEM_DB/main/quiz_questions.json";

export default function Classroom() {
  const insets = useSafeAreaInsets();
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
            fileName: "04_oed_kullanimi.pdf",
          },
          {
            id: "5",
            displayName: "Erişkinlerde Temel Yaşam Desteği",
            fileName: "05-1_eriskinlerde_tyd.pdf",
          },
          {
            id: "6",
            displayName: "Çocuklarda Temel Yaşam Desteği",
            fileName: "05-2_cocuklarda_tyd.pdf",
          },
          {
            id: "7",
            displayName: "Havayolu Tıkanıklığı",
            fileName: "06_havayolu_tikanikliginda_ilkyardim.pdf",
          },
          {
            id: "8",
            displayName: "Bilinç Bozuklukları ve Ciddi Hastalıklar",
            fileName:
              "07_bilinc_bozukluklarinda_ve_ciddi_hastaliklarda_ilkyardim.pdf",
          },
          {
            id: "9",
            displayName: "Kanamalar",
            fileName: "08_kanamalarda_ilkyardim.pdf",
          },
          {
            id: "10",
            displayName: "Şok ve Göğüs Ağrısı",
            fileName: "09_sok_ve_gogus_agrisinda_ilkyardim.pdf",
          },
          {
            id: "11",
            displayName: "Yaralanmalar",
            fileName: "10_yaralanmalarda_ilkyardim.pdf",
          },
          {
            id: "12",
            displayName: "Boğulmalar",
            fileName: "11_bogulmalarda_ilkyardim.pdf",
          },
          {
            id: "13",
            displayName: "Kırık, Çıkık ve Burkulmalar",
            fileName: "12_kirik_cikik_ve_burkulmalarda_ilkyardim.pdf",
          },
          {
            id: "14",
            displayName: "Böcek ve Hayvan Isırıkları",
            fileName:
              "13_bocek_sokmalari_ve_hayvan_isiriklarinda_ilkyardim.pdf",
          },
          {
            id: "15",
            displayName: "Zehirlenmeler",
            fileName: "14_zehirlenmelerde_ilkyardim.pdf",
          },
          {
            id: "16",
            displayName: "Yanık, Soğuk ve Sıcak Acilleri",
            fileName: "15_yanik_soguk_ve_sicak_acillerinde_ilkyardim.pdf",
          },
          {
            id: "17",
            displayName: "Göz, Kulak ve Buruna Yabancı Cisim Kaçması",
            fileName:
              "16_goz_kulak_ve_buruna_yabanci_cisim_kacmasinda_ilkyardim.pdf",
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

  const handleOpenDocument = async (document: DocumentFile) => {
    try {
      router.push({
        pathname: "/(pages)/pdfViewer",
        params: {
          uri: document.fileName,
          title: document.displayName,
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
              <Pressable
                key={document.id}
                style={({ pressed }) => [
                  styles.documentPressable,
                  pressed && styles.documentPressablePressed,
                ]}
                onPress={() => handleOpenDocument(document)}
              >
                <Text
                  variant="bodyLarge"
                  style={[styles.cardText, { marginBottom: 0 }]}
                >
                  {document.displayName}
                </Text>
              </Pressable>
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
              Quiz'e Git
            </Button>
          </View>
        </View>
      </Surface>
    </ScrollView>
  );
}
