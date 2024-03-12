import { EntryType } from "@/pages/Entries/enums/EntryType";
import { parseEnumValue } from "@/utils/parseEnumValue";

export function getActivityContextDrawerTitle(entryType: EntryType) {
  let result = "";
  const parsedEntryType = parseEnumValue(entryType, EntryType);
  if (parsedEntryType === null) return result;
  switch (parsedEntryType) {
    case EntryType.Medicine:
      result = "Médicaments";
      break;
    case EntryType.VitaminsAndSupplements:
      result = "Vitamines et suppléments";
      break;
    case EntryType.BabyCare:
      result = "Soins de bébé";
      break;
    case EntryType.Vaccine:
      result = "Vaccins";
      break;
    case EntryType.Activity:
      result = "Activités";
      break;
    case EntryType.Sleep:
      result = "Lieux de sommeil";
      break;
    case EntryType.BabyMash:
      result = "Types de purée";
      break;
    case EntryType.BottleFeeding:
      result = "Types de lait ou préparation";
      break;
    default:
      break;
  }
  return result;
}