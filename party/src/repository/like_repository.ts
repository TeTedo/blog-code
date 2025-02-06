import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export const get_likes_by_personal_number = async (personalNumber: number) => {
  try {
    const surveyRef = collection(db, "like");
    const q = query(surveyRef, where("toPersonalNumber", "==", personalNumber));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<ILike, "id">),
    }));

    return data;
  } catch (error) {
    return null;
  }
};

export const post_like = async (like: Omit<ILike, "createdAt" | "id">) => {
  const docRef = await addDoc(collection(db, "like"), {
    fromPersonalNumber: like.fromPersonalNumber,
    toPersonalNumber: like.toPersonalNumber,
    createdAt: serverTimestamp(),
  });

  return docRef;
};

export const delete_like = async (id: string) => {
  try {
    const commentDoc = doc(db, "like", id); // 특정 컬렉션과 문서 ID를 참조
    await deleteDoc(commentDoc); // 해당 문서 삭제
    return true;
  } catch (error) {
    return false;
  }
};
