import { ActivityContextType } from "@/pages/Activity/enums/ActivityContextType";
import { EntryType } from "@/pages/Entries/enums/EntryType";
import { parseEnumValue } from "@/utils/parseEnumValue";

export function getActivityContextType(
  entryType: EntryType
): ActivityContextType | null {
  let result = null;
  if (entryType == null) return result;
  const parsedType = parseEnumValue(entryType, EntryType);
  if (parsedType === null) return result;
  switch (parsedType) {
    case EntryType.Medicine:
      result = ActivityContextType.Medicine;
      break;
    case EntryType.VitaminsAndSupplements:
      result = ActivityContextType.VitaminsAndSupplements;
      break;
    case EntryType.BabyCare:
      result = ActivityContextType.BabyCare;
      break;
    case EntryType.Vaccine:
      result = ActivityContextType.Vaccine;
      break;
    case EntryType.Activity:
      result = ActivityContextType.Activity;
      break;
    case EntryType.Sleep:
      result = ActivityContextType.Sleep;
      break;
    case EntryType.BabyMash:
      result = ActivityContextType.BabyMash;
      break;
    case EntryType.BottleFeeding:
      result = ActivityContextType.BottleFeeding;
      break;
    case EntryType.SolidFood:
      result = ActivityContextType.SolidFood;
      break;
    case EntryType.Symptom:
      result = ActivityContextType.Symptom;
      break;
    default:
      break;
  }
  return result;
}