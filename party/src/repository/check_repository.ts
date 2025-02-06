import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export const post_check = async (response: ICheck) => {
  try {
    const docRef = doc(db, "check", response.id);
    await setDoc(docRef, response);
  } catch (error) {
    throw error;
  }
};
