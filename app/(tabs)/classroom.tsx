import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text, Button, Surface } from 'react-native-paper';
//import * as Linking from 'expo-linking';
import { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootTabParamList } from '../../types';
 
export default function Classroom() {
  const insets = useSafeAreaInsets();
  const [documentFiles, setDocumentFiles] = useState<string[]>([]);

  useEffect(() => {
    const fetchDocumentFiles = async () => {
      const fileList = [
        '(1) Genel İlkyardım Bilgileri.pdf',
        '(2) Vücut Sistemleri.pdf',
        '(3) Acil Taşıma Teknikleri.pdf',
        '(4) OED Kullanımı.pdf',
      ];
      const pdfFiles = fileList.filter((file) => file.endsWith('.pdf'));
      setDocumentFiles(pdfFiles);

    };

    fetchDocumentFiles();
  }, []);
    const navigation = useNavigation<NavigationProp<RootTabParamList>>();

    const handleOpenDocument = (url: string) => {
        //Linking.openURL(url).catch((err) => console.error('An error occurred:', err));
    };
    const navigateToQuiz = () => navigation.navigate('sub_screens/quiz');

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.scrollViewContent}>
      {/*<Text variant="headlineMedium" style={[styles.title, { marginBottom: 16 }]}>İlkyardım Eğitimi</Text>*/}

      {/* Document Files Card */}
      <Surface style={[styles.card, { marginBottom: 16 }, { marginTop: 16 }]} elevation={2}>
        <Text variant="titleLarge" style={styles.cardTitle}>Ders Notları</Text>
        <View style={styles.contentContainer}>
          {documentFiles.map((file, index) => (
            <Pressable
              key={index} style={styles.documentPressable} onPress={() => handleOpenDocument(`../../assets/documents/pdf/${file}`)}
            >
              <Text variant="bodyLarge" style={styles.cardText}>
              {file}
              </Text>
            </Pressable>
          ))}
        </View>
      </Surface>

      {/* Quiz Card */}
      <Surface style={[styles.card, { marginBottom: 16 }]} elevation={2}>
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
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    scrollViewContent: {
        paddingTop: 0,
        paddingBottom: 12,
    },
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#282b30',
    },
    title: {
        color: '#FFFFFF',
        textAlign: 'left',
        fontSize: 16,
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
        padding: 6,
        fontSize: 20,
        textAlign: 'center',
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
    documentPressable: {
        borderWidth: 1,
        borderColor: '#8C8C8C',
        padding: 5,
    }
});