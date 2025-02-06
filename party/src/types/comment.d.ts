interface IComment {
  id: string;
  writerId: string;
  writerName: string;
  writerImg: string;
  writerPersonalNumber: number;
  comment: string;
  personalNumber: number;
  createdAt: FirestoreTimestamp;
}
