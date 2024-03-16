import { ActivityContextType } from "@/pages/Activity/enums/ActivityContextType";
import { EntryType } from "@/pages/Entries/enums/EntryType";

export function getEntryTypeFromActivityContextType(
  activityContextType: ActivityContextType
): EntryType | null {
  let result: EntryType | null = null;
  switch (activityContextType) {
    case ActivityContextType.Medicine:
      result = EntryType.Medicine;
      break;
    case ActivityContextType.VitaminsAndSupplements:
      result = EntryType.VitaminsAndSupplements;
      break;
    case ActivityContextType.BabyCare:
      result = EntryType.BabyCare;
      break;
    case ActivityContextType.Vaccine:
      result = EntryType.Vaccine;
      break;
    case ActivityContextType.Activity:
      result = EntryType.Activity;
      break;
    case ActivityContextType.Sleep:
      result = EntryType.Sleep;
      break;
    case ActivityContextType.BabyMash:
      result = EntryType.BabyMash;
      break;
    case ActivityContextType.BottleFeeding:
      result = EntryType.BottleFeeding;
      break;
    case ActivityContextType.SolidFood:
      result = EntryType.SolidFood;
      break;
    case ActivityContextType.Symptom:
      result = EntryType.Symptom;
      break;
    default:
      break;
  }
  return result;
}
