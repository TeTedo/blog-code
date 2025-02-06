interface IRegistration {
  id: string;
  name: string;
  contact: string;
  gender: string;
  deposit: boolean;
  personalNumber?: number;
  recommender: string;
  createdAt: FirestoreTimestamp;
}

interface IPostRegistration {
  name: string;
  contact: string;
  gender: string;
  recommender: string;
}
