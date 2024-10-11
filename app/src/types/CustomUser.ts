import { FieldValue, Timestamp, serverTimestamp } from "firebase/firestore";

import { Baby } from "@/types/Baby";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { FirestoreDocument } from "@/types/FirestoreDocument";
import { IntervalMethodId } from "@/pages/Settings/enums/IntervalMethodId";
import { User } from "firebase/auth";

export interface CustomUser extends FirestoreDocument, User {
  babyId: string;
  babies: string[];
  baby: Baby;
  entryTypesOrder: EntryTypeId[];
  intervalMethodByEntryTypeId: Array<{
    entryTypeId: EntryTypeId;
    methodId: IntervalMethodId;
  }>;
}
