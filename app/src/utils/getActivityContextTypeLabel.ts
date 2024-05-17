import { ActivityContextType } from "@/pages/Activity/enums/ActivityContextType";
import { parseEnumValue } from "@/utils/parseEnumValue";

export function getActivityContextTypeLabel(
  activityContextType: ActivityContextType
) {
  let result = "";
  const parsedEnumValue = parseEnumValue(
    activityContextType,
    ActivityContextType
  );
  if (parsedEnumValue === null) return result;
  switch (parsedEnumValue) {
    case ActivityContextType.Medicine:
      result = "Médicaments";
      break;
    case ActivityContextType.VitaminsAndSupplements:
      result = "Vitamines et suppléments";
      break;
    case ActivityContextType.BabyCare:
      result = "Soins de bébé";
      break;
    case ActivityContextType.Vaccine:
      result = "Vaccins";
      break;
    case ActivityContextType.Activity:
      result = "Activités";
      break;
    case ActivityContextType.Sleep:
      result = "Lieux de sommeil";
      break;
    case ActivityContextType.BabyMash:
      result = "Types de purée";
      break;
    case ActivityContextType.BottleFeeding:
      result = "Types de lait ou préparation";
      break;
    case ActivityContextType.SolidFood:
      result = "Types de nourriture solide";
      break;
    case ActivityContextType.Symptom:
      //   case ActivityContextType.Hospital:
      result = "Symptômes";
      break;
    case ActivityContextType.NasalHygiene:
      result = "Types de soin nasal";
      break;
    case ActivityContextType.Temperature:
      result = "Types de température";
      break;
    default:
      break;
  }
  return result;
}
