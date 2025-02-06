import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export const get_comments_by_personal_number = async (
  personalNumber: number
) => {
  try {
    const surveyRef = collection(db, "comment");
    const q = query(surveyRef, where("personalNumber", "==", personalNumber));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    let data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<IComment, "id">),
    }));

    data = data.sort((a, b) => a.createdAt.seconds - b.createdAt.seconds);

    return data;
  } catch (error) {
    return null;
  }
};

export const post_comment = async (
  comment: Omit<IComment, "createdAt" | "id">
) => {
  const docRef = await addDoc(collection(db, "comment"), {
    writerId: comment.writerId,
    writerName: comment.writerName,
    writerImg: comment.writerImg,
    writerPersonalNumber: comment.writerPersonalNumber,
    comment: comment.comment,
    personalNumber: comment.personalNumber,
    createdAt: serverTimestamp(),
  });

  return docRef;
};

export const patch_comment = async (id: string, comment: string) => {
  try {
    const commentDoc = doc(db, "comment", id);
    await updateDoc(commentDoc, { comment });
    return true;
  } catch (error) {
    return false;
  }
};

export const delete_comment = async (id: string) => {
  try {
    const commentDoc = doc(db, "comment", id); // 특정 컬렉션과 문서 ID를 참조
    await deleteDoc(commentDoc); // 해당 문서 삭제
    return true;
  } catch (error) {
    return false;
  }
};
