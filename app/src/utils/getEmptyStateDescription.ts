import { ActivityContextType } from "@/pages/Activity/enums/ActivityContextType";
import { EmptyStateContext } from "@/enums/EmptyStateContext";
import { EmptyStateProps } from "@/components/EmptyState";
import { EntryType } from "@/pages/Entries/enums/EntryType";

export function getEmptyStateDescription(props: EmptyStateProps) {
  const defaultDescription = "Revenez plus tard";
  // const medicineDescription = "Aucun type de médicament défini";
  // const vitaminsAndSupplementsDescription =
  //   "Aucun type de vitamines et suppléments défini";
  // const babyCareDescription = "Aucun type de soins pour bébé défini";
  // const vaccineDescription = "Aucun type de vaccin défini";
  // const activityDescription = "Aucun type d'activité défini";
  // const sleepDescription = "Aucun lieu de sommeil défini";
  // const babyMashDescription = "Aucun type de purée défini";
  // const bottleFeedingDescription = "Aucun type de lait ou préparation défini";
  // const solidFoodDescription = "Aucun type d'aliment solide défini";
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
  if (props.type != null) {
    switch (props.type) {
      case EntryType.Medicine:
        return medicineDescription;
      case EntryType.VitaminsAndSupplements:
        return vitaminsAndSupplementsDescription;
      case EntryType.BabyCare:
        return babyCareDescription;
      case EntryType.Vaccine:
        return vaccineDescription;
      case EntryType.Activity:
        return activityDescription;
      case EntryType.Sleep:
        return sleepDescription;
      case EntryType.BabyMash:
        return babyMashDescription;
      case EntryType.BottleFeeding:
        return bottleFeedingDescription;
      case EntryType.SolidFood:
        return solidFoodDescription;
      default:
        return defaultDescription;
    }
  }
  if (props.context === EmptyStateContext.ActivityContextDrawer) {
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
        default:
          return defaultDescription;
      }
    }
  }
  return defaultDescription;
}
