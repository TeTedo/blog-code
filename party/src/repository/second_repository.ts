import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export const post_second = async (request: ISecond) => {
  try {
    const docRef = doc(db, "second", request.id);
    await setDoc(docRef, request);
  } catch (error) {
    throw error;
  }
};
