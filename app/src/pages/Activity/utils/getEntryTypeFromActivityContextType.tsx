import { ActivityContextType } from "@/pages/Activity/enums/ActivityContextType";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";

export function getEntryTypeFromActivityContextType(
  activityContextType: ActivityContextType
): EntryTypeId | null {
  let result: EntryTypeId | null = null;
  switch (activityContextType) {
    case ActivityContextType.Medicine:
      result = EntryTypeId.Medicine;
      break;
    case ActivityContextType.VitaminsAndSupplements:
      result = EntryTypeId.VitaminsAndSupplements;
      break;
    case ActivityContextType.BabyCare:
      result = EntryTypeId.BabyCare;
      break;
    case ActivityContextType.Vaccine:
      result = EntryTypeId.Vaccine;
      break;
    case ActivityContextType.Activity:
      result = EntryTypeId.Activity;
      break;
    case ActivityContextType.Sleep:
      result = EntryTypeId.Sleep;
      break;
    case ActivityContextType.BabyMash:
      result = EntryTypeId.BabyMash;
      break;
    case ActivityContextType.BottleFeeding:
      result = EntryTypeId.BottleFeeding;
      break;
    case ActivityContextType.SolidFood:
      result = EntryTypeId.SolidFood;
      break;
    case ActivityContextType.Symptom:
      result = EntryTypeId.Symptom;
      break;
    case ActivityContextType.NasalHygiene:
      result = EntryTypeId.NasalHygiene;
      break;
    case ActivityContextType.Temperature:
      result = EntryTypeId.Temperature;
      break;
    default:
      break;
  }
  return result;
}
