import { getDownloadURL, ref, listAll, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";

export const uploadImageToStorage = async (
  file: File,
  personalNumber: string
): Promise<string> => {
  try {
    const fileExtension = file.name.split(".").pop() || "jpg";
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const uniqueFileName = `${timestamp}_${randomString}.${fileExtension}`;

    // party_gallery 폴더에 직접 저장하도록 수정
    const storageRef = ref(storage, `party_gallery/${uniqueFileName}`);

    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const getGalleryImages = async (): Promise<string[]> => {
  try {
    const storageRef = ref(storage, "party_gallery");
    const result = await listAll(storageRef);

    // 모든 이미지의 다운로드 URL을 가져옴
    const urlPromises = result.items.map((imageRef) =>
      getDownloadURL(imageRef)
    );
    const urls = await Promise.all(urlPromises);

    // 최신 이미지가 앞에 오도록 정렬
    return urls.reverse();
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    return [];
  }
};
