import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export type TalkResponse = {
  name: string;
  talk: string;
};

export const post_talk = async (request: TalkResponse) => {
  try {
    const docRef = await addDoc(collection(db, "talk"), {
      request,
    });

    return docRef;
  } catch (error) {
    throw error;
  }
};

export const get_talks = async (): Promise<ITalk[]> => {
  const querySnapshot = await getDocs(collection(db, "talk"));

  const data = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<ITalk, "id">),
  }));

  return data;
};
