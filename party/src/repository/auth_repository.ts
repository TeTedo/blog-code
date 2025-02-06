import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";

export const validateLogin = async ({
  name,
  phoneNumber,
}: {
  name: string;
  phoneNumber: string;
}) => {
  try {
    const surveyRef = collection(db, "registration");
    const q = query(
      surveyRef,
      where("contact", "==", phoneNumber),
      where("name", "==", name)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return false;
    }

    const surveyData = querySnapshot.docs[0].data(); // 첫 번째 결과 반환
    return {
      id: querySnapshot.docs[0].id,
      ...(surveyData as Omit<SurveyResponse, "id">),
    };
  } catch (error) {
    return false;
  }
};
