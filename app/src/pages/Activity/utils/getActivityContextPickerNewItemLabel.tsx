import { ActivityContextType } from "@/pages/Activity/enums/ActivityContextType";
import { EntryType } from "@/pages/Entries/enums/EntryType";
import { parseEnumValue } from "@/utils/parseEnumValue";

export function getActivityContextPickerNewItemLabel(
  type: ActivityContextType | null
) {
  let result = "";
  if (type == null) return result;
  const parsedType = parseEnumValue(type, ActivityContextType);
  if (parsedType === null) return result;
  switch (parsedType) {
    case ActivityContextType.Medicine:
      result = "Ajouter un médicament";
      break;
    case ActivityContextType.VitaminsAndSupplements:
      result = "Ajouter une vitamine ou un supplément";
      break;
    case ActivityContextType.BabyCare:
      result = "Ajouter un soin de bébé";
      break;
    case ActivityContextType.Vaccine:
      result = "Ajouter un vaccin";
      break;
    case ActivityContextType.Activity:
      result = "Ajouter un type d'activité";
      break;
    case ActivityContextType.Sleep:
      result = "Ajouter un lieu de sommeil";
      break;
    case ActivityContextType.BabyMash:
      result = "Ajouter un type de purée";
      break;
    case ActivityContextType.BottleFeeding:
      result = "Ajouter un type de lait ou préparation";
      break;
    case ActivityContextType.SolidFood:
      result = "Ajouter un type de nourriture solide";
      break;
    case ActivityContextType.Symptom:
      result = "Ajouter un symptôme";
      break;
    default:
      break;
  }
  return result;
}
