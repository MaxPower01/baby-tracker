import { Timestamp, serverTimestamp } from "firebase/firestore";

export type FirestoreDocument = {
  createdAt?: Timestamp | ReturnType<typeof serverTimestamp>;
  lastUpdated?: Timestamp | ReturnType<typeof serverTimestamp>;
};
