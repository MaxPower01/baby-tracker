import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";

export function getPreviousEntryLabelPrefix(entryTypeId: EntryTypeId) {
  switch (entryTypeId) {
    case EntryTypeId.Bath:
      return "Depuis le bain précédent:";
    case EntryTypeId.BottleFeeding:
      return "Depuis le biberon précédent:";
    case EntryTypeId.BreastFeeding:
      return "Depuis l'allaitement précédent:";
    case EntryTypeId.Burp:
      return "Depuis le rot précédent:";
    case EntryTypeId.CarRide:
      return "Depuis le trajet en voiture précédent:";
    case EntryTypeId.Cry:
      return "Depuis les pleurs précédents:";
    case EntryTypeId.Diaper:
      return "Depuis la couche précédente:";
    case EntryTypeId.Hiccups:
      return "Depuis le hoquet précédent:";
    case EntryTypeId.Hospital:
      return "Depuis la visite à l'hôpital précédente:";
    case EntryTypeId.HeadCircumference:
      return "Depuis le tour de tête précédent:";
    case EntryTypeId.MedicalFollowUp:
      return "Depuis le suivi médical précédent:";
    case EntryTypeId.Medicine:
      return "Depuis le médicament précédent:";
    case EntryTypeId.MilkExtraction:
      return "Depuis l'extraction de lait précédente:";
    case EntryTypeId.NailCutting:
      return "Depuis la coupe d'ongles précédente:";
    case EntryTypeId.NasalHygiene:
      return "Depuis l'hygiène nasale précédente:";
    case EntryTypeId.Play:
      return "Depuis le jeu précédent:";
    case EntryTypeId.Poop:
      return "Depuis le caca précédent:";
    case EntryTypeId.Size:
      return "Depuis la taille précédente:";
    case EntryTypeId.Sleep:
      return "Depuis le sommeil précédent:";
    case EntryTypeId.SolidFood:
      return "Depuis la nourriture solide précédente:";
    case EntryTypeId.Regurgitation:
      return "Depuis la régurgitation précédente:";
    case EntryTypeId.Temperature:
      return "Depuis la température précédente:";
    case EntryTypeId.Teeth:
      return "Depuis la dent précédente:";
    case EntryTypeId.Urine:
      return "Depuis le pipi précédent:";
    case EntryTypeId.Vaccine:
      return "Depuis le vaccin précédent:";
    case EntryTypeId.Vomit:
      return "Depuis le vomi précédent:";
    case EntryTypeId.Walk:
      return "Depuis la marche précédente:";
    case EntryTypeId.Weight:
      return "Depuis le poids précédent:";
    case EntryTypeId.Fart:
      return "Depuis le pet précédent:";
    case EntryTypeId.Symptom:
      return "Depuis le symptôme précédent:";
    case EntryTypeId.Note:
      return "Depuis la note précédente:";
    case EntryTypeId.BabyMash:
      return "Depuis la purée précédente:";
    case EntryTypeId.VitaminsAndSupplements:
      return "Depuis les vitamines et suppléments précédents:";
    case EntryTypeId.AwakeTime:
      return "Depuis le temps éveillé précédent:";
    case EntryTypeId.Activity:
      return "Depuis l'activité précédente:";
    case EntryTypeId.BabyCare:
      return "Depuis les soins du bébé précédents:";
    case EntryTypeId.BabyToilet:
      return "Depuis le petit pot précédent:";
    case EntryTypeId.BellyTime:
      return "Depuis le temps sur le ventre précédent:";
    default:
      return "";
  }
}
