import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { parseEnumValue } from "@/utils/parseEnumValue";

export function getActivityContextDrawerTitle(entryType: EntryTypeId) {
  let result = "";
  const parsedEntryType = parseEnumValue(entryType, EntryTypeId);
  if (parsedEntryType === null) return result;
  switch (parsedEntryType) {
    case EntryTypeId.Medicine:
      result = "Médicaments";
      break;
    case EntryTypeId.VitaminsAndSupplements:
      result = "Vitamines et suppléments";
      break;
    case EntryTypeId.BabyCare:
      result = "Soins de bébé";
      break;
    case EntryTypeId.Vaccine:
      result = "Vaccins";
      break;
    case EntryTypeId.Activity:
      result = "Activités";
      break;
    case EntryTypeId.Sleep:
      result = "Lieux de sommeil";
      break;
    case EntryTypeId.BabyMash:
      result = "Types de purée";
      break;
    case EntryTypeId.BottleFeeding:
      result = "Types de lait ou préparation";
      break;
    case EntryTypeId.SolidFood:
      result = "Types de nourriture solide";
      break;
    case EntryTypeId.Symptom:
    case EntryTypeId.Hospital:
      result = "Symptômes";
      break;
    case EntryTypeId.NasalHygiene:
      result = "Types de soin nasal";
      break;
    case EntryTypeId.Temperature:
      result = "Types de température";
      break;
    default:
      break;
  }
  return result;
}
