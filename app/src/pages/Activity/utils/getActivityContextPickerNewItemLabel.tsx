import { EntryType } from "@/pages/Entries/enums/EntryType";
import { parseEnumValue } from "@/utils/parseEnumValue";

export function getActivityContextPickerNewItemLabel(entryType: EntryType) {
  let result = "";
  const parsedEntryType = parseEnumValue(entryType, EntryType);
  if (parsedEntryType === null) return result;
  switch (parsedEntryType) {
    case EntryType.Medicine:
      result = "Ajouter un médicament";
      break;
    case EntryType.VitaminsAndSupplements:
      result = "Ajouter une vitamine ou un supplément";
      break;
    case EntryType.BabyCare:
      result = "Ajouter un soin de bébé";
      break;
    case EntryType.Vaccine:
      result = "Ajouter un vaccin";
      break;
    case EntryType.Activity:
      result = "Ajouter un type d'activité";
      break;
    case EntryType.Sleep:
      result = "Ajouter un lieu de sommeil";
      break;
    case EntryType.BabyMash:
      result = "Ajouter un type de purée";
      break;
    case EntryType.BottleFeeding:
      result = "Ajouter un type de lait ou préparation";
      break;
    default:
      break;
  }
  return result;
}
