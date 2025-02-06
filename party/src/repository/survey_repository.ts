import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

export const post_survey_response = async (response: SurveyResponse) => {
  try {
    const docRef = doc(db, "survey_responses", response.id);
    await setDoc(docRef, response);
  } catch (error) {
    throw error;
  }
};

export const get_survey_responses = async (): Promise<SurveyResponse[]> => {
  const querySnapshot = await getDocs(collection(db, "survey_responses"));

  const data = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<SurveyResponse, "id">),
  }));

  return data;
};

export const get_survey_response = async (id: string) => {
  try {
    const docRef = doc(db, "survey_responses", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...(docSnap.data() as Omit<SurveyResponse, "id">),
      };
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const get_survey_response_by_name = async (name: string) => {
  try {
    const surveyRef = collection(db, "survey_responses");
    const q = query(surveyRef, where("name", "==", name));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const surveyData = querySnapshot.docs[0].data(); // 첫 번째 결과 반환
    return {
      id: querySnapshot.docs[0].id,
      ...(surveyData as Omit<SurveyResponse, "id">),
    };
  } catch (error) {
    return null;
  }
};

export const get_survey_response_by_personal_number = async (
  personalNumber: string
) => {
  try {
    const surveyRef = collection(db, "survey_responses");
    const q = query(surveyRef, where("personalNumber", "==", personalNumber));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const surveyData = querySnapshot.docs[0].data(); // 첫 번째 결과 반환
    return {
      id: querySnapshot.docs[0].id,
      ...(surveyData as Omit<SurveyResponse, "id">),
    };
  } catch (error) {
    return null;
  }
};
