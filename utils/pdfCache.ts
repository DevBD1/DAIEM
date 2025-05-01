import * as FileSystem from "expo-file-system";
import * as Asset from "expo-asset";

// Import PDFs statically
const pdfAssets = {
  "01_genel_ilkyardim_bilgileri.pdf": require("../assets/pdfs/01_genel_ilkyardim_bilgileri.pdf"),
  "02_vucut_sistemleri.pdf": require("../assets/pdfs/02_vucut_sistemleri.pdf"),
  "03_acil_tasima_teknikleri.pdf": require("../assets/pdfs/03_acil_tasima_teknikleri.pdf"),
  "04_oed_kullanimi.pdf": require("../assets/pdfs/04_oed_kullanimi.pdf"),
  "05-1_eriskinlerde_tyd.pdf": require("../assets/pdfs/05-1_eriskinlerde_tyd.pdf"),
  "05-2_cocuklarda_tyd.pdf": require("../assets/pdfs/05-2_cocuklarda_tyd.pdf"),
  "06_havayolu_tikanikliginda_ilkyardim.pdf": require("../assets/pdfs/06_havayolu_tikanikliginda_ilkyardim.pdf"),
  "07_bilinc_bozukluklarinda_ve_ciddi_hastaliklarda_ilkyardim.pdf": require("../assets/pdfs/07_bilinc_bozukluklarinda_ve_ciddi_hastaliklarda_ilkyardim.pdf"),
  "08_kanamalarda_ilkyardim.pdf": require("../assets/pdfs/08_kanamalarda_ilkyardim.pdf"),
  "09_sok_ve_gogus_agrisinda_ilkyardim.pdf": require("../assets/pdfs/09_sok_ve_gogus_agrisinda_ilkyardim.pdf"),
  "10_yaralanmalarda_ilkyardim.pdf": require("../assets/pdfs/10_yaralanmalarda_ilkyardim.pdf"),
  "11_bogulmalarda_ilkyardim.pdf": require("../assets/pdfs/11_bogulmalarda_ilkyardim.pdf"),
  "12_kirik_cikik_ve_burkulmalarda_ilkyardim.pdf": require("../assets/pdfs/12_kirik_cikik_ve_burkulmalarda_ilkyardim.pdf"),
  "13_bocek_sokmalari_ve_hayvan_isiriklarinda_ilkyardim.pdf": require("../assets/pdfs/13_bocek_sokmalari_ve_hayvan_isiriklarinda_ilkyardim.pdf"),
  "14_zehirlenmelerde_ilkyardim.pdf": require("../assets/pdfs/14_zehirlenmelerde_ilkyardim.pdf"),
  "15_yanik_soguk_ve_sicak_acillerinde_ilkyardim.pdf": require("../assets/pdfs/15_yanik_soguk_ve_sicak_acillerinde_ilkyardim.pdf"),
  "16_goz_kulak_ve_buruna_yabanci_cisim_kacmasinda_ilkyardim.pdf": require("../assets/pdfs/16_goz_kulak_ve_buruna_yabanci_cisim_kacmasinda_ilkyardim.pdf"),
} as const;

export interface PDFInfo {
  localUri: string;
  error?: string;
}

const validatePdf = async (
  fileName: string
): Promise<{ isValid: boolean; error?: string }> => {
  try {
    if (!fileName.toLowerCase().endsWith(".pdf")) {
      return {
        isValid: false,
        error: "Invalid file type. Only PDF files are allowed.",
      };
    }

    if (!(fileName in pdfAssets)) {
      return {
        isValid: false,
        error: "PDF file not found in assets",
      };
    }

    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: `File validation failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
};

export const getPdfUri = async (fileName: string): Promise<PDFInfo> => {
  try {
    // Validate PDF file
    const validation = await validatePdf(fileName);
    if (!validation.isValid) {
      throw new Error(validation.error || "Invalid PDF file");
    }

    // Load from assets
    const asset = Asset.Asset.fromModule(
      pdfAssets[fileName as keyof typeof pdfAssets]
    );
    await asset.downloadAsync();

    return {
      localUri: asset.localUri!.replace("file://", ""),
    };
  } catch (error) {
    console.error("Loading error:", error);
    return {
      localUri: "",
      error: "Failed to load PDF",
    };
  }
};

const PdfHandler = {
  getPdfUri,
  validatePdf,
};

export default PdfHandler;
