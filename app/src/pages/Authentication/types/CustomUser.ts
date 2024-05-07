import Baby from "@/pages/Authentication/types/Baby";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { IntervalMethodId } from "@/pages/Settings/enums/IntervalMethodId";
import { User } from "firebase/auth";

export default interface CustomUser extends User {
  babyId: string;
  babies: Baby[];
  entryTypesOrder: EntryTypeId[];
  intervalMethodByEntryTypeId: Array<{
    entryTypeId: EntryTypeId;
    methodId: IntervalMethodId;
  }>;
}
