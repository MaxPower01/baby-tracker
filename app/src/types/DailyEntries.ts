import { Timestamp, serverTimestamp } from "firebase/firestore";

import { ExistingEntry } from "@/pages/Entry/types/Entry";
import { FirestoreDocument } from "@/types/FirestoreDocument";

export interface DailyEntries extends FirestoreDocument {
  /**
   * A Unix timestamp in seconds that corresponds to the start of the day in UTC time.
   */
  timestamp: number;
  entries: ExistingEntry[];
}
