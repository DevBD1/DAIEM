import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text, Button, Surface } from 'react-native-paper';
import { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { router } from 'expo-router';
import { useAuth } from '../(pages)/AuthContext';
// @ts-ignore
import { RootTabParamList } from '../../types';

interface DocumentFile {
  id: string;
  displayName: string;
  fileName: string;
}

export default function Classroom() {
  const { isAuthenticated } = useAuth();
  const insets = useSafeAreaInsets();
  const [documentFiles, setDocumentFiles] = useState<DocumentFile[]>([]);

  useEffect(() => {
    // Only fetch documents if authenticated
    if (isAuthenticated) {
      const fetchDocumentFiles = async () => {
        const fileList: DocumentFile[] = [
          {
            id: '1',
            displayName: 'Genel İlk Yardım Bilgileri',
            fileName: '01_genel_ilkyardim_bilgileri.pdf'
          },
          {
            id: '2',
            displayName: 'Vücut Sistemleri',
            fileName: '02_vucut_sistemleri.pdf'
          },
          {
            id: '3',
            displayName: 'Acil Taşıma Teknikleri',
            fileName: '03_acil_tasima_teknikleri.pdf'
          },
          {
            id: '4',
            displayName: 'OED Kullanımı',
            fileName: '04_oed_kullanimi.pdf'
          },
          {
            id: '5',
            displayName: 'Erişkinlerde Temel Yaşam Desteği',
            fileName: '05-1_eriskinlerde_tyd.pdf'
          },
          {
            id: '6',
            displayName: 'Çocuklarda Temel Yaşam Desteği',
            fileName: '05-2_cocuklarda_tyd.pdf'
          },
          {
            id: '7',
            displayName: 'Havayolu Tıkanıklığı',
            fileName: '06_havayolu_tikanikliginda_ilkyardim.pdf'
          },
          {
            id: '8',
            displayName: 'Bilinç Bozuklukları ve Ciddi Hastalıklar',
            fileName: '07_bilinc_bozukluklarinda_ve_ciddi_hastaliklarda_ilkyardim.pdf'
          },
          {
            id: '9',
            displayName: 'Kanamalar',
            fileName: '08_kanamalarda_ilkyardim.pdf'
          },
          {
            id: '10',
            displayName: 'Şok ve Göğüs Ağrısı',
            fileName: '09_sok_ve_gogus_agrisinda_ilkyardim.pdf'
          },
          {
            id: '11',
            displayName: 'Yaralanmalar',
            fileName: '10_yaralanmalarda_ilkyardim.pdf'
          },
          {
            id: '12',
            displayName: 'Boğulmalar',
            fileName: '11_bogulmalarda_ilkyardim.pdf'
          },
          {
            id: '13',
            displayName: 'Kırık, Çıkık ve Burkulmalar',
            fileName: '12_kirik_cikik_ve_burkulmalarda_ilkyardim.pdf'
          },
          {
            id: '14',
            displayName: 'Böcek ve Hayvan Isırıkları',
            fileName: '13_bocek_sokmalari_ve_hayvan_isiriklarinda_ilkyardim.pdf'
          },
          {
            id: '15',
            displayName: 'Zehirlenmeler',
            fileName: '14_zehirlenmelerde_ilkyardim.pdf'
          },
          {
            id: '16',
            displayName: 'Yanık, Soğuk ve Sıcak Acilleri',
            fileName: '15_yanik_soguk_ve_sicak_acillerinde_ilkyardim.pdf'
          },
          {
            id: '17',
            displayName: 'Göz, Kulak ve Buruna Yabancı Cisim Kaçması',
            fileName: '16_goz_kulak_ve_buruna_yabanci_cisim_kacmasinda_ilkyardim.pdf'
          }
        ];
        setDocumentFiles(fileList);
      };

      fetchDocumentFiles();
    }
  }, [isAuthenticated]);

  // If not authenticated, render only a login card
  if (!isAuthenticated) {
    return (
      <View style={[styles.container, { justifyContent: 'center', flex: 1, paddingHorizontal: 16 }]}> 
        <Surface style={[styles.card]} elevation={2}>
          <View style={styles.cardWrapper}>
            <Text variant="titleLarge" style={styles.cardTitle}>Giriş Gerekli</Text>
            <View style={styles.contentContainer}>
              <Text variant="bodyMedium" style={styles.cardText}>
                Derslere erişmek için giriş yapmanız gerekmektedir.
              </Text>
              <Button
                mode="contained"
                style={[styles.button, { marginTop: 16 }]}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
                onPress={() => router.push('/(pages)/login')}
              >
                Giriş Yap
              </Button>
            </View>
          </View>
        </Surface>
      </View>
    );
  }

  const handleOpenDocument = async (document: DocumentFile) => {
    try {
      router.push({
        pathname: "/(pages)/pdfViewer",
        params: { 
          uri: document.fileName,
          title: document.displayName
        }
      });
    } catch (err) {
      console.error('Error opening document:', err);
      alert('Dosya açılırken bir hata oluştu.');
    }
  };

  const navigation = useNavigation<NavigationProp<RootTabParamList>>();
  const navigateToQuiz = () => router.push('/(pages)/quiz');

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={[
        styles.scrollViewContent, 
        { paddingVertical: 16 }
      ]}
    >
      {/*<Text variant="headlineMedium" style={[styles.title, { marginBottom: 16 }]}>İlkyardım Eğitimi</Text>*/}

      {/* Document Files Card */}
      <Surface style={[styles.card, { marginBottom: 16 }]} elevation={2}>
        <View style={styles.cardWrapper}>
          <Text variant="titleLarge" style={styles.cardTitle}>Dersler</Text>
          <View style={styles.contentContainer}>
            {documentFiles.map((document) => (
              <Pressable
                key={document.id}
                style={({pressed}) => [
                  styles.documentPressable,
                  pressed && styles.documentPressablePressed
                ]}
                onPress={() => handleOpenDocument(document)}
              >
                <Text variant="bodyLarge" style={[styles.cardText, { marginBottom: 0 }]}>
                  {document.displayName}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Surface>

      {/* Quiz Card */}
      <Surface style={[styles.card]} elevation={2}>
        <View style={styles.cardWrapper}>
          <Text variant="titleLarge" style={styles.cardTitle}>Quiz</Text>
          <View style={styles.contentContainer}>
            <Text variant="bodyMedium" style={styles.cardText}>
              Bilgilerinizi pekiştirmek için Quiz uygulamasına katılabilirsiniz.
            </Text>
            <Button
              mode="contained" style={[styles.button]} contentStyle={styles.buttonContent} labelStyle={styles.buttonLabel}
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

const styles = StyleSheet.create({
  scrollViewContent: {
    paddingHorizontal: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#282b30',
  },
  card: {
    borderRadius: 24,
    backgroundColor: '#424549',
    borderWidth: 1,
    borderColor: '#8C8C8C',
  },
  cardWrapper: {
    overflow: 'hidden',
    borderRadius: 24,
  },
  cardTitle: {
    color: '#FFFFFF',
    backgroundColor: '#7289da',
    padding: 8,
    fontSize: 20,
    textAlign: 'center',
  },
  contentContainer: {
    padding: 16,
  },
  cardText: {
    color: '#FFFFFF',
    lineHeight: 20,
    fontSize: 16,
  },
  documentPressable: {
    borderWidth: 1,
    borderColor: '#8C8C8C',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  documentPressablePressed: {
    backgroundColor: '#363940',
  },
  button: {
    marginTop: 4,
    backgroundColor: '#7289da',
  },
  buttonContent: {
    height: 40,
  },
  buttonLabel: {
    fontSize: 14,
    letterSpacing: 0.5,
    color: '#FFFFFF',
  },
});