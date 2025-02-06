import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export const post_registration = async (registration: IPostRegistration) => {
  const docRef = await addDoc(collection(db, "registration"), {
    name: registration.name,
    contact: registration.contact,
    gender: registration.gender,
    deposit: false,
    personalNumber: 0,
    recommender: registration.recommender,
    createdAt: serverTimestamp(),
  });

  return docRef;
};

export const get_registration_by_id = async (id: string) => {
  try {
    const docRef = doc(db, "registration", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...(docSnap.data() as Omit<IRegistration, "id">),
      };
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const get_registrations = async (): Promise<IRegistration[]> => {
  const querySnapshot = await getDocs(collection(db, "registration"));

  const data = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<IRegistration, "id">),
  }));

  return data;
};

export const patch_deposit_state = async (
  id: string,
  currentStatus: boolean
) => {
  try {
    const registrationDoc = doc(db, "registration", id);
    await updateDoc(registrationDoc, { deposit: !currentStatus });
  } catch (error) {
    console.error("Error updating deposit status:", error);
  }
};

export const patch_personal_number = async (id: string) => {
  try {
    const personalNumber = await _generate_unique_personal_number();
    const registrationDoc = doc(db, "registration", id);
    await updateDoc(registrationDoc, { personalNumber });

    return personalNumber;
  } catch (error) {
    console.error("Error assigning personal number:", error);
  }
};

export const delete_registration = async (id: string) => {
  const registrationDoc = doc(db, "registration", id);
  await deleteDoc(registrationDoc);
};

const _generate_unique_personal_number = async (): Promise<number> => {
  const existingNumbers: number[] = [];
  const querySnapshot = await getDocs(collection(db, "registration"));

  // Collect existing personal numbers
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.personalNumber) {
      existingNumbers.push(data.personalNumber);
    }
  });

  // Generate a unique random number
  let personalNumber: number;
  do {
    personalNumber = Math.floor(Math.random() * 50) + 1; // Random number between 1 and 50
  } while (existingNumbers.includes(personalNumber));

  return personalNumber;
};
