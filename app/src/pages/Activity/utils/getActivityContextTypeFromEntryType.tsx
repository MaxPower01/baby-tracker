import { ActivityContextType } from "@/pages/Activity/enums/ActivityContextType";
import { EntryType } from "@/pages/Entries/enums/EntryType";
import { parseEnumValue } from "@/utils/parseEnumValue";

export function getActivityContextTypeFromEntryType(
  entryType: EntryType
): ActivityContextType | null {
  let result: ActivityContextType | null = null;
  const parsedEntryType = parseEnumValue(entryType, EntryType);
  if (parsedEntryType === null) return result;
  switch (parsedEntryType) {
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
    default:
      break;
  }
  return result;
}
