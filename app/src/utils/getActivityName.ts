import { EntryType } from "@/pages/Entries/enums/EntryType";

export function getActivityName(type: EntryType) {
  switch (type) {
    case EntryType.Bath:
      return "Bain";
    case EntryType.BottleFeeding:
      return "Biberon";
    case EntryType.BreastFeeding:
      return "Allaitement";
    case EntryType.Burp:
      return "Rot";
    case EntryType.CarRide:
      return "Trajet en voiture";
    case EntryType.Cry:
      return "Pleurs";
    case EntryType.Diaper:
      return "Couche";
    case EntryType.Hiccups:
      return "Hoquet";
    case EntryType.Hospital:
      return "Visite à l'hôpital";
    case EntryType.HeadCircumference:
      return "Tour de tête";
    case EntryType.MedicalFollowUp:
      return "Suivi médical";
    case EntryType.Medicine:
      return "Médicament";
    case EntryType.MilkExtraction:
      return "Extraction de lait";
    case EntryType.NailCutting:
      return "Coupe d'ongles";
    case EntryType.NasalHygiene:
      return "Hygiène nasale";
    case EntryType.Play:
      return "Jeu";
    case EntryType.Poop:
      return "Caca";
    case EntryType.Size:
      return "Taille";
    case EntryType.Sleep:
      return "Sommeil";
    case EntryType.SolidFood:
      return "Nourriture solide";
    case EntryType.Regurgitation:
      return "Régurgitation";
    case EntryType.Temperature:
      return "Température";
    case EntryType.Teeth:
      return "Dents";
    case EntryType.Urine:
      return "Pipi";
    case EntryType.Vaccine:
      return "Vaccin";
    case EntryType.Vomit:
      return "Vomi";
    case EntryType.Walk:
      return "Marche";
    case EntryType.Weight:
      return "Poids";
    case EntryType.Fart:
      return "Pet";
    case EntryType.Symptom:
      return "Symptôme";
    case EntryType.Note:
      return "Note";
    case EntryType.BabyMash:
      return "Purée";
    case EntryType.VitaminsAndSupplements:
      return "Vitamines et suppléments";
    case EntryType.AwakeTime:
      return "Temps éveillé";
    case EntryType.Activity:
      return "Activité";
    case EntryType.BabyCare:
      return "Soins du bébé";
    case EntryType.BabyToilet:
      return "Petit pot";
    case EntryType.BellyTime:
      return "Temps sur le ventre";
    default:
      return "";
  }
}
