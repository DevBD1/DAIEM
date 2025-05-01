import * as FileSystem from "expo-file-system";

const googleDriveLinks = {
  "01_genel_ilkyardim_bilgileri.pdf":
    "https://drive.google.com/file/d/1X8P4blEt1HrEcswtmFppCadG_Ql3qSE8",
  "02_vucut_sistemleri.pdf":
    "https://drive.google.com/file/d/1y-ZJW0qAJVjzo9IMBxoVQDFnqGQCBhX4",
  "document.03_acil_tasima_teknikleri.pdf":
    "https://drive.google.com/file/d/1Ae8XashwOqxhzXM97hch8Ryju2YWZDP4",
  "document.04_oed_ve_tyd.pdf":
    "https://drive.google.com/file/d/1h2nOihMwOs3rQfwrKny4h4xBxvjkF6X2",
  "document.05_havayolu_tikanikliginda_ilkyardim.pdf":
    "https://drive.google.com/file/d/1CHQVIFELYVl3Vg_cAlXetoENxJ_vYL1Q",
  "document.06_bilinc_bozukluklarinda_ve_ciddi_hastaliklarda_ilkyardim.pdf":
    "https://drive.google.com/file/d/1CWVTLoYPhnarLExJmtyQA5jVEXcep87m",
  "document.07_kanamalarda_ilkyardim.pdf":
    "https://drive.google.com/file/d/1uJGKlgwLEQHbIZTOks-um4duBryVt54D",
  "document.08_sok_ve_gogus_agrisinda_ilkyardim.pdf":
    "https://drive.google.com/file/d/10P8KHd3v6H8hbCUfbWUmPHe2dcbiZX0n",
  "document.09_yaralanmalarda_ilkyardim.pdf":
    "https://drive.google.com/file/d/12R2PgsGrRzOfN4HYb5zLll-VIhOifsrT",
  "document.10_bogulmalarda_ilkyardim.pdf":
    "https://drive.google.com/file/d/1TR3C4Zn3XHeB3SyPQQQymZ72YUBA-10_",
  "document.11_kirik_cikik_ve_burkulmalarda_ilkyardim.pdf":
    "https://drive.google.com/file/d/1lsoTYQm1tlBYSSG0fNtMbXSLdoiUctSY",
  "document.12_bocek_sokmalari_ve_hayvan_isiriklarinda_ilkyardim.pdf":
    "https://drive.google.com/file/d/1inclMxfntNd1ugMduFOdZbA0C0H_LZuw",
  "document.13_zehirlenmelerde_ilkyardim.pdf":
    "https://drive.google.com/file/d/1XLCYjhGq70Zi0o4HCfJ-K02c99tIUJKm",
  "document.14_yanik_soguk_ve_sicak_acillerinde_ilkyardim.pdf":
    "https://drive.google.com/file/d/1FP4X4_Mnquq7Iecq-NmZYWBT2EUDb8AV",
  "document.15_goz_kulak_ve_buruna_yabanci_cisim_kacmasinda_ilkyardim.pdf":
    "https://drive.google.com/file/d/1gBOI-bzIn4zLKbYZxpYwreXDfp67XCxX",
};

export interface PDFInfo {
  localUri: string;
  error?: string;
}
export const getPdfUri = async (fileName: string): Promise<PDFInfo> => {
  try {
    if (
      !fileName.toLowerCase().endsWith(".pdf") ||
      !(fileName in googleDriveLinks)
    ) {
      throw new Error(`Invalid file type or file name: ${fileName}`);
    }

    // Define the local directory where files will be stored
    const localDir = `${FileSystem.documentDirectory}pdfs/`;
    const localUri = `${localDir}${fileName}`;

    // Check if the file already exists locally
    const fileInfo = await FileSystem.getInfoAsync(localUri);

    if (fileInfo.exists) {
      console.log(`File already exists locally: ${localUri}`);
      return { localUri };
    }

    // Ensure the directory exists
    const dirInfo = await FileSystem.getInfoAsync(localDir);
    if (!dirInfo.exists) {
      console.log(`Creating directory: ${localDir}`);
      await FileSystem.makeDirectoryAsync(localDir, { intermediates: true });
    }

    // If file doesn't exist locally, download it
    const sourceUri =
      googleDriveLinks[fileName as keyof typeof googleDriveLinks];
    if (!sourceUri) {
      throw new Error(`No source URI found for file: ${fileName}`);
    }
    console.log(`Downloading file from: ${sourceUri} to ${localUri}`);

    const downloadResumable = FileSystem.createDownloadResumable(
      sourceUri,
      localUri,
      {}
    );

    try {
      const downloadResult = await downloadResumable.downloadAsync();
      if (downloadResult) {
        let cleanedUri = downloadResult.uri;
        if (downloadResult.uri.startsWith("file://file://")) {
          cleanedUri = downloadResult.uri.substring(7);
        }
        console.log(`Downloaded file to: ${cleanedUri}`);
        return { localUri: downloadResult.uri };
      } else {
        throw new Error("Download failed: Download result is undefined.");
      }
    } catch (downloadError) {
      console.error("Error downloading file:", downloadError);
      return {
        localUri: "",
        error: "Failed to download PDF",
      };
    }
  } catch (error) {
    console.error("Loading error:", error);
    return {
      localUri: "",
      error: "Failed to load PDF",
    };
  }
};
