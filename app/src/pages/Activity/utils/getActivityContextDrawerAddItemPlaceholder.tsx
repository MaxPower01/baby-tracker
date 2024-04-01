import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { parseEnumValue } from "@/utils/parseEnumValue";

export function getActivityContextDrawerAddItemPlaceholder(
  entryType: EntryTypeId
) {
  let result = "";
  const parsedEntryType = parseEnumValue(entryType, EntryTypeId);
  if (parsedEntryType === null) return result;
  switch (parsedEntryType) {
    case EntryTypeId.Medicine:
      result = "Ajouter un médicament";
      break;
    case EntryTypeId.VitaminsAndSupplements:
      result = "Ajouter une vitamine ou un supplément";
      break;
    case EntryTypeId.BabyCare:
      result = "Ajouter un soin de bébé";
      break;
    case EntryTypeId.Vaccine:
      result = "Ajouter un vaccin";
      break;
    case EntryTypeId.Activity:
      result = "Ajouter un type d'activité";
      break;
    case EntryTypeId.Sleep:
      result = "Ajouter un lieu de sommeil";
      break;
    case EntryTypeId.BabyMash:
      result = "Ajouter un type de purée";
      break;
    case EntryTypeId.BottleFeeding:
      result = "Ajouter un type de lait ou préparation";
      break;
    case EntryTypeId.SolidFood:
      result = "Ajouter un type de nourriture solide";
      break;
    case EntryTypeId.Symptom:
    case EntryTypeId.Hospital:
      result = "Ajouter un symptôme";
      break;
    case EntryTypeId.NasalHygiene:
      result = "Ajouter un type de soin nasal";
      break;
    case EntryTypeId.Temperature:
      result = "Ajouter un type de température";
      break;
    default:
      break;
  }
  return result;
}
