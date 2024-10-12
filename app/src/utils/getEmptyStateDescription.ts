import { ActivityContextType } from "@/pages/Activity/enums/ActivityContextType";
import { EmptyStateContext } from "@/enums/EmptyStateContext";
import { EmptyStateProps } from "@/components/EmptyState";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";

export function getEmptyStateDescription(props: EmptyStateProps) {
  const defaultDescription = "Revenez plus tard";
  const medicineDescription = "Tenez un registre des médicaments de votre bébé";
  const vitaminsAndSupplementsDescription =
    "Suivez de près les suppléments vitaminiques de votre bébé";
  const babyCareDescription =
    "Créez un historique détaillé des routines de soins de votre bébé";
  const vaccineDescription =
    "Tenez un registre précis des vaccins de votre bébé";
  const activityDescription =
    "Suivez les aventures de votre bébé avec précision";
  const sleepDescription =
    "Marquez les endroits préférés de votre bébé pour dormir";
  const babyMashDescription =
    "Suivez les aventures gourmandes de votre bébé en notant les purées consommées";
  const bottleFeedingDescription =
    "Suivez avec précision les tétées au biberon de votre bébé en spécifiant le type de lait ou de préparation utilisé";
  const solidFoodDescription =
    "Suivez chacun des repas solides de votre bébé en notant les aliments consommés";
  const symptomDescription =
    "Suivez facilement les symptômes de votre bébé pour une meilleure compréhension de sa santé";
  const temperatureDescription =
    "Surveillez la température de votre bébé pour vérifier quand il est malade";
  const nasalHygieneDescription =
    "Tenez un registre des soins nasaux de votre bébé";
  if (props.type != null) {
    switch (props.type) {
      case EntryTypeId.Medicine:
        return medicineDescription;
      case EntryTypeId.VitaminsAndSupplements:
        return vitaminsAndSupplementsDescription;
      case EntryTypeId.BabyCare:
        return babyCareDescription;
      case EntryTypeId.Vaccine:
        return vaccineDescription;
      case EntryTypeId.Activity:
        return activityDescription;
      case EntryTypeId.Sleep:
        return sleepDescription;
      case EntryTypeId.BabyMash:
        return babyMashDescription;
      case EntryTypeId.BottleFeeding:
        return bottleFeedingDescription;
      case EntryTypeId.SolidFood:
        return solidFoodDescription;
      case EntryTypeId.Symptom:
      case EntryTypeId.Hospital:
        return symptomDescription;
      case EntryTypeId.Temperature:
        return temperatureDescription;
      case EntryTypeId.NasalHygiene:
        return nasalHygieneDescription;
      default:
        return defaultDescription;
    }
  }
  if (props.context == EmptyStateContext.ActivityContextDrawer) {
    if (props.activityContextType != null) {
      switch (props.activityContextType) {
        case ActivityContextType.Medicine:
          return medicineDescription;
        case ActivityContextType.VitaminsAndSupplements:
          return vitaminsAndSupplementsDescription;
        case ActivityContextType.BabyCare:
          return babyCareDescription;
        case ActivityContextType.Vaccine:
          return vaccineDescription;
        case ActivityContextType.Activity:
          return activityDescription;
        case ActivityContextType.Sleep:
          return sleepDescription;
        case ActivityContextType.BabyMash:
          return babyMashDescription;
        case ActivityContextType.BottleFeeding:
          return bottleFeedingDescription;
        case ActivityContextType.SolidFood:
          return solidFoodDescription;
        case ActivityContextType.Symptom:
          return symptomDescription;
        case ActivityContextType.Temperature:
          return temperatureDescription;
        case ActivityContextType.NasalHygiene:
          return nasalHygieneDescription;
        default:
          return defaultDescription;
      }
    }
  } else if (props.context == EmptyStateContext.Entries) {
    return "Commencez dès maintenant à enregistrer l’activité de votre bébé";
  } else if (props.context == EmptyStateContext.Charts) {
    return "Ajoutez des entrées pour accéder au graphique de cette activité";
  }
  return defaultDescription;
}
