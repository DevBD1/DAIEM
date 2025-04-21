export const list_files = async (path: string): Promise<string[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockFiles = ['(1) Genel İlkyardım Bilgileri.pptx', '(2) Vücut Sistemleri.pptx', '(3) Acil Taşıma Teknikleri.pptx', '(4) OED Kullanımı.pptx'];
      resolve(mockFiles);
    }, 500);
  });
};