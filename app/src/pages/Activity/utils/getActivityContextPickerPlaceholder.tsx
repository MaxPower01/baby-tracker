import { ActivityContextType } from "@/pages/Activity/enums/ActivityContextType";
import { EntryType } from "@/pages/Entries/enums/EntryType";
import { parseEnumValue } from "@/utils/parseEnumValue";

export function getActivityContextPickerPlaceholder(
  type: ActivityContextType | null
) {
  let result = "";
  if (type == null) return result;
  const parsedType = parseEnumValue(type, ActivityContextType);
  if (parsedType === null) return result;
  switch (parsedType) {
    case ActivityContextType.Medicine:
      result = "Médicament";
      break;
    case ActivityContextType.VitaminsAndSupplements:
      result = "Vitamine ou un supplément";
      break;
    case ActivityContextType.BabyCare:
      result = "Soin de bébé";
      break;
    case ActivityContextType.Vaccine:
      result = "Vaccin";
      break;
    case ActivityContextType.Activity:
      result = "Type d'activité";
      break;
    case ActivityContextType.Sleep:
      result = "Lieu de sommeil";
      break;
    case ActivityContextType.BabyMash:
      result = "Type de purée";
      break;
    case ActivityContextType.BottleFeeding:
      result = "Type de lait ou préparation";
      break;
    default:
      break;
  }
  return result;
}

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
    default:
      break;
  }
  return result;
}
