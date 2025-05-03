/* eslint-disable @typescript-eslint/no-require-imports */
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, View, Button, SafeAreaView, StyleSheet, Dimensions, useWindowDimensions } from "react-native";
import Pdf, { Source } from "react-native-pdf";
import { Asset } from "expo-asset";
import React, { useEffect, useState } from "react";
import { styles as sharedStyles } from "../../components/styles";

const pdfMap: Record<string, number> = {
  "01_genel_ilkyardim_bilgileri.pdf": require("../../assets/pdfs/01_genel_ilkyardim_bilgileri.pdf"),
  "02_vucut_sistemleri.pdf": require("../../assets/pdfs/02_vucut_sistemleri.pdf"),
  "03_acil_tasima_teknikleri.pdf": require("../../assets/pdfs/03_acil_tasima_teknikleri.pdf"),
  "04_oed_ve_tyd.pdf": require("../../assets/pdfs/04_oed_ve_tyd.pdf"),
  "05_havayolu_tikanikliginda_ilkyardim.pdf": require("../../assets/pdfs/05_havayolu_tikanikliginda_ilkyardim.pdf"),
  "06_bilinc_bozukluklarinda_ve_ciddi_hastaliklarda_ilkyardim.pdf": require("../../assets/pdfs/06_bilinc_bozukluklarinda_ve_ciddi_hastaliklarda_ilkyardim.pdf"),
  "07_kanamalarda_ilkyardim.pdf": require("../../assets/pdfs/07_kanamalarda_ilkyardim.pdf"),
  "08_sok_ve_gogus_agrisinda_ilkyardim.pdf": require("../../assets/pdfs/08_sok_ve_gogus_agrisinda_ilkyardim.pdf"),
  "09_yaralanmalarda_ilkyardim.pdf": require("../../assets/pdfs/09_yaralanmalarda_ilkyardim.pdf"),
  "10_bogulmalarda_ilkyardim.pdf": require("../../assets/pdfs/10_bogulmalarda_ilkyardim.pdf"),
  "11_kirik_cikik_ve_burkulmalarda_ilkyardim.pdf": require("../../assets/pdfs/11_kirik_cikik_ve_burkulmalarda_ilkyardim.pdf"),
  "12_bocek_sokmalari_ve_hayvan_isiriklarinda_ilkyardim.pdf": require("../../assets/pdfs/12_bocek_sokmalari_ve_hayvan_isiriklarinda_ilkyardim.pdf"),
  "13_zehirlenmelerde_ilkyardim.pdf": require("../../assets/pdfs/13_zehirlenmelerde_ilkyardim.pdf"),
  "14_yanik_soguk_ve_sicak_acillerinde_ilkyardim.pdf": require("../../assets/pdfs/14_yanik_soguk_ve_sicak_acillerinde_ilkyardim.pdf"),
  "15_goz_kulak_ve_buruna_yabanci_cisim_kacmasinda_ilkyardim.pdf": require("../../assets/pdfs/15_goz_kulak_ve_buruna_yabanci_cisim_kacmasinda_ilkyardim.pdf"),
};



const PDFViewer = () => {
  const router = useRouter();
  const { fileName, title } = useLocalSearchParams<{
    fileName?: string;
    title?: string;
  }>();
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [pdfWidth, setPdfWidth] = useState(screenWidth);
  const [pdfHeight, setPdfHeight] = useState(screenHeight);

  useEffect(() => {
    const updateDimensions = () => {
      const { width, height } = Dimensions.get('window');
      setPdfWidth(width);
      setPdfHeight(height);
    };

    const subscription = Dimensions.addEventListener('change', updateDimensions);
    return () => {
      subscription.remove();
    };
  }, [screenWidth, screenHeight]);


  useEffect(() => {
    const loadPdf = async () => {
      if (!fileName) return;

      const pdfModule = pdfMap[fileName];
      if (!pdfModule) {
        console.error("Dosya eşleşmesi bulunamadı:", fileName);
        return;
      }

      const asset = Asset.fromModule(pdfModule);
      await asset.downloadAsync();
      setPdfUri(asset.localUri);
    };

    loadPdf().catch((err) => {
      console.error("PDF yüklenirken hata oluştu:", err);
    });
  }, [fileName]);

  if (!pdfUri) {
    return (
      <SafeAreaView style={sharedStyles.container}>
        <Text style={sharedStyles.loadingText}>Yükleniyor...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={sharedStyles.container}>
      <View style={localStyles.backButton}>
        <Button title="Geri" onPress={() => router.back()} color="#7289da" />
      </View>

      {title && (
        <Text style={[sharedStyles.cardTitle, { marginBottom: 12 }]}>
          {title}
        </Text>
      )}
      
      <View style={[localStyles.pdfWrapper, { width: pdfWidth, height:pdfHeight-100}]}>
        <Pdf 
          source={{ uri: pdfUri } as Source}
          onError={(error) => console.error("PDF Error:", error)}
          enablePaging={true}
          style={localStyles.pdf}
        />
      </View>
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  backButton: {
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  pdfWrapper: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#8C8C8C",
    borderRadius: 12,
    overflow: "hidden"
  },
  pdf: {
    flex: 1, 
    width: pdfWidth,
    height: pdfHeight-100,
  },
});

export default PDFViewer;
