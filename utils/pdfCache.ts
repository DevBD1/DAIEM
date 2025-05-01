/* eslint-disable @typescript-eslint/no-require-imports */
import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";

const googleDriveLinks = {
  "01_genel_ilkyardim_bilgileri.pdf":
    "https://drive.google.com/uc?id=1v71l1Y8aHl4OqH7z5V9i9j639Z-c1gZk",
  "02_vucut_sistemleri.pdf":
    "https://drive.google.com/uc?id=15pL4lX07_rV8o0w2a9a5b_5uJ9Q-2wX1",
  "03_acil_tasima_teknikleri.pdf":
    "https://drive.google.com/uc?id=1_dIe1aK-37dZtLwM7-xZg8mN5_m9jV6Z",
  "04_oed_ve_tyd.pdf":
    "https://drive.google.com/uc?id=1fXj0g5w3yQy0z7O9X4t5a-pL8y_N4bVz",
  "05_havayolu_tikanikliginda_ilkyardim.pdf":
    "https://drive.google.com/uc?id=16V2z0d8n6fI9oFj9t4A5F8h_Q6c5jD1a",
  "06_bilinc_bozukluklarinda_ve_ciddi_hastaliklarda_ilkyardim.pdf":
    "https://drive.google.com/uc?id=1tV8o1Z0w4p2-5hV9w7_o-d6O3fN4vF0c",
  "07_kanamalarda_ilkyardim.pdf":
    "https://drive.google.com/uc?id=19c5h0m3aY_5y_zL8o-f7hY6uK7h5gR1a",
  "08_sok_ve_gogus_agrisinda_ilkyardim.pdf":
    "https://drive.google.com/uc?id=18Z9e6k7fM4xJ3d-1-wz6pYv2g7h1w0aR",
  "09_yaralanmalarda_ilkyardim.pdf":
    "https://drive.google.com/uc?id=1-Z0h5xJ7l1qY-k8n7o2f7v0m3Z8-fJz4",
  "10_bogulmalarda_ilkyardim.pdf":
    "https://drive.google.com/uc?id=1_cZ6j1y5b0-m0o6-f8o3h2n_a3c4k7wT",
  "11_kirik_cikik_ve_burkulmalarda_ilkyardim.pdf":
    "https://drive.google.com/uc?id=1rU4y9q-0v1L8w0_O8h-o3u-0j5a7y-n1",
  "12_bocek_sokmalari_ve_hayvan_isiriklarinda_ilkyardim.pdf":
    "https://drive.google.com/uc?id=1_g3W1q0v-K6k9d8-m8t4u6p5o3c9b5zK",
  "13_zehirlenmelerde_ilkyardim.pdf":
    "https://drive.google.com/uc?id=1dO0h9c8w3-f5v2u2y_a6q9v-F8u4p0wJ",
  "14_yanik_soguk_ve_sicak_acillerinde_ilkyardim.pdf":
    "https://drive.google.com/uc?id=1yL0k1c9v-j7w8u_p5g2r-m3r6w7z0iXq",
  "15_goz_kulak_ve_buruna_yabanci_cisim_kacmasinda_ilkyardim.pdf":
    "https://drive.google.com/uc?id=1uT5q9h_9qH_j-l0_o4t-x8f-a6y9u8kL",
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
      let returnUri = localUri;
      if (Platform.OS === "android") {
        returnUri = await FileSystem.getContentUriAsync(localUri);
      }
      return {
        localUri: returnUri,
      };
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
      {},
      undefined
    );

    try {
      const downloadResult = await downloadResumable.downloadAsync();
      if (downloadResult) {
        let cleanedUri = downloadResult.uri;
        if (downloadResult.uri.startsWith("file://file://")) {
          cleanedUri = downloadResult.uri.substring(7);
        }
        console.log(`Downloaded file to: ${cleanedUri}`);
        let returnUri = cleanedUri;
        if (Platform.OS === "android") {
          returnUri = await FileSystem.getContentUriAsync(cleanedUri);
        }
        return {
          localUri: returnUri,
        };
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
