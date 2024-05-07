import { ActivityContextType } from "@/pages/Activity/enums/ActivityContextType";
import { EmptyStateContext } from "@/enums/EmptyStateContext";
import { EmptyStateProps } from "@/components/EmptyState";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";

export function getEmptyStateTitle(props: EmptyStateProps) {
  const defaultTitle = "Rien à voir ici pour le moment";
  const medicineTitle = "Aucun type de médicament défini";
  const vitaminsAndSupplementsTitle =
    "Aucun type de vitamines et suppléments défini";
  const babyCareTitle = "Aucun type de soins pour bébé défini";
  const vaccineTitle = "Aucun type de vaccin défini";
  const activityTitle = "Aucun type d'activité défini";
  const sleepTitle = "Aucun lieu de sommeil défini";
  const babyMashTitle = "Aucun type de purée défini";
  const bottleFeedingTitle = "Aucun type de lait ou préparation défini";
  const solidFoodTitle = "Aucun type d'aliment défini";
  const symptomTitle = "Aucun symptôme défini";
  const temperatureTitle = "Aucun type de prise de température défini";
  const nasalHygieneTitle = "Aucun type de soin nasal défini";
  if (props.type != null) {
    switch (props.type) {
      case EntryTypeId.Medicine:
        return medicineTitle;
      case EntryTypeId.VitaminsAndSupplements:
        return vitaminsAndSupplementsTitle;
      case EntryTypeId.BabyCare:
        return babyCareTitle;
      case EntryTypeId.Vaccine:
        return vaccineTitle;
      case EntryTypeId.Activity:
        return activityTitle;
      case EntryTypeId.Sleep:
        return sleepTitle;
      case EntryTypeId.BabyMash:
        return babyMashTitle;
      case EntryTypeId.BottleFeeding:
        return bottleFeedingTitle;
      case EntryTypeId.SolidFood:
        return solidFoodTitle;
      case EntryTypeId.Symptom:
      case EntryTypeId.Hospital:
        return symptomTitle;
      case EntryTypeId.Temperature:
        return temperatureTitle;
      case EntryTypeId.NasalHygiene:
        return nasalHygieneTitle;
      default:
        return defaultTitle;
    }
  }
  if (props.context == EmptyStateContext.ActivityContextDrawer) {
    if (props.activityContextType != null) {
      switch (props.activityContextType) {
        case ActivityContextType.Medicine:
          return medicineTitle;
        case ActivityContextType.VitaminsAndSupplements:
          return vitaminsAndSupplementsTitle;
        case ActivityContextType.BabyCare:
          return babyCareTitle;
        case ActivityContextType.Vaccine:
          return vaccineTitle;
        case ActivityContextType.Activity:
          return activityTitle;
        case ActivityContextType.Sleep:
          return sleepTitle;
        case ActivityContextType.BabyMash:
          return babyMashTitle;
        case ActivityContextType.BottleFeeding:
          return bottleFeedingTitle;
        case ActivityContextType.SolidFood:
          return solidFoodTitle;
        case ActivityContextType.Symptom:
          return symptomTitle;
        case ActivityContextType.Temperature:
          return temperatureTitle;
        case ActivityContextType.NasalHygiene:
          return nasalHygieneTitle;
        default:
          return defaultTitle;
      }
    }
  } else if (props.context == EmptyStateContext.Entries) {
    return "Aucune entrée pour le moment";
  }
  return defaultTitle;
}
