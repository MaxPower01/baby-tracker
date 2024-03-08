import { EntryType } from "@/pages/Entries/enums/EntryType";
import { parseEnumValue } from "@/utils/parseEnumValue";

export function getActivityContextPickerPlaceholder(entryType: EntryType) {
  let result = "";
  const parsedEntryType = parseEnumValue(entryType, EntryType);
  if (parsedEntryType === null) return result;
  switch (parsedEntryType) {
    case EntryType.Medicine:
      result = "Médicament";
      break;
    case EntryType.VitaminsAndSupplements:
      result = "Vitamine ou un supplément";
      break;
    case EntryType.BabyCare:
      result = "Soin de bébé";
      break;
    case EntryType.Vaccine:
      result = "Vaccin";
      break;
    case EntryType.Activity:
      result = "Type d'activité";
      break;
    case EntryType.Sleep:
      result = "Lieu de sommeil";
      break;
    case EntryType.BabyMash:
      result = "Type de purée";
      break;
    case EntryType.BottleFeeding:
      result = "Type de lait ou préparation";
      break;
    default:
      break;
  }
  return result;
}
