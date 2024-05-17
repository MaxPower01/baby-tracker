import { ActivityContextType } from "@/pages/Activity/enums/ActivityContextType";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { parseEnumValue } from "@/utils/parseEnumValue";

export function getEntryTypeIdFromActivityContextType(
  activityContextType: ActivityContextType
) {
  const parsedEnumValue = parseEnumValue(
    activityContextType,
    ActivityContextType
  );
  if (parsedEnumValue === null) return null;
  switch (parsedEnumValue) {
    case ActivityContextType.Medicine:
      return EntryTypeId.Medicine;
    case ActivityContextType.VitaminsAndSupplements:
      return EntryTypeId.VitaminsAndSupplements;
    case ActivityContextType.BabyCare:
      return EntryTypeId.BabyCare;
    case ActivityContextType.Vaccine:
      return EntryTypeId.Vaccine;
    case ActivityContextType.Activity:
      return EntryTypeId.Activity;
    case ActivityContextType.Sleep:
      return EntryTypeId.Sleep;
    case ActivityContextType.BabyMash:
      return EntryTypeId.BabyMash;
    case ActivityContextType.BottleFeeding:
      return EntryTypeId.BottleFeeding;
    case ActivityContextType.SolidFood:
      return EntryTypeId.SolidFood;
    case ActivityContextType.Symptom:
      return EntryTypeId.Symptom;
    case ActivityContextType.NasalHygiene:
      return EntryTypeId.NasalHygiene;
    case ActivityContextType.Temperature:
      return EntryTypeId.Temperature;
    default:
      return null;
  }
}
