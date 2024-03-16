import { ActivityContextType } from "@/pages/Activity/enums/ActivityContextType";
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
    case ActivityContextType.SolidFood:
      result = "Type de nourriture solide";
      break;
    case ActivityContextType.Symptom:
      result = "Symptômes";
      break;
    default:
      break;
  }
  return result;
}
