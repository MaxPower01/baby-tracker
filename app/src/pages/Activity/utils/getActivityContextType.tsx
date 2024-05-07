import { ActivityContextType } from "@/pages/Activity/enums/ActivityContextType";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { parseEnumValue } from "@/utils/parseEnumValue";

export function getActivityContextType(
  entryType: EntryTypeId
): ActivityContextType | null {
  let result = null;
  if (entryType == null) return result;
  const parsedType = parseEnumValue(entryType, EntryTypeId);
  if (parsedType === null) return result;
  switch (parsedType) {
    case EntryTypeId.Medicine:
      result = ActivityContextType.Medicine;
      break;
    case EntryTypeId.VitaminsAndSupplements:
      result = ActivityContextType.VitaminsAndSupplements;
      break;
    case EntryTypeId.BabyCare:
      result = ActivityContextType.BabyCare;
      break;
    case EntryTypeId.Vaccine:
      result = ActivityContextType.Vaccine;
      break;
    case EntryTypeId.Activity:
      result = ActivityContextType.Activity;
      break;
    case EntryTypeId.Sleep:
      result = ActivityContextType.Sleep;
      break;
    case EntryTypeId.BabyMash:
      result = ActivityContextType.BabyMash;
      break;
    case EntryTypeId.BottleFeeding:
      result = ActivityContextType.BottleFeeding;
      break;
    case EntryTypeId.SolidFood:
      result = ActivityContextType.SolidFood;
      break;
    case EntryTypeId.Symptom:
    case EntryTypeId.Hospital:
      result = ActivityContextType.Symptom;
      break;
    case EntryTypeId.NasalHygiene:
      result = ActivityContextType.NasalHygiene;
      break;
    case EntryTypeId.Temperature:
      result = ActivityContextType.Temperature;
      break;
    default:
      break;
  }
  return result;
}
