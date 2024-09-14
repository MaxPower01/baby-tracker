import { FieldValue, Timestamp, serverTimestamp } from "firebase/firestore";

import { Baby } from "@/pages/Authentication/types/Baby";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { FirestoreDocument } from "@/types/FirestoreDocument";
import { IntervalMethodId } from "@/pages/Settings/enums/IntervalMethodId";
import { User } from "firebase/auth";

export default interface CustomUser extends FirestoreDocument, User {
  babyId: string;
  babies: Baby[];
  entryTypesOrder: EntryTypeId[];
  intervalMethodByEntryTypeId: Array<{
    entryTypeId: EntryTypeId;
    methodId: IntervalMethodId;
  }>;
}
