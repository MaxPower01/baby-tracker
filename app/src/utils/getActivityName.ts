import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";

export function getActivityName(type: EntryTypeId) {
  switch (type) {
    case EntryTypeId.Bath:
      return "Bain";
    case EntryTypeId.BottleFeeding:
      return "Biberon";
    case EntryTypeId.BreastFeeding:
      return "Allaitement";
    case EntryTypeId.Burp:
      return "Rot";
    case EntryTypeId.CarRide:
      return "Trajet en voiture";
    case EntryTypeId.Cry:
      return "Pleurs";
    case EntryTypeId.Diaper:
      return "Couche";
    case EntryTypeId.Hiccups:
      return "Hoquet";
    case EntryTypeId.Hospital:
      return "Visite à l'hôpital";
    case EntryTypeId.HeadCircumference:
      return "Tour de tête";
    case EntryTypeId.MedicalFollowUp:
      return "Suivi médical";
    case EntryTypeId.Medicine:
      return "Médicament";
    case EntryTypeId.MilkExtraction:
      return "Extraction de lait";
    case EntryTypeId.NailCutting:
      return "Coupe d'ongles";
    case EntryTypeId.NasalHygiene:
      return "Hygiène nasale";
    case EntryTypeId.Play:
      return "Jeu";
    case EntryTypeId.Poop:
      return "Caca";
    case EntryTypeId.Size:
      return "Taille";
    case EntryTypeId.Sleep:
      return "Sommeil";
    case EntryTypeId.SolidFood:
      return "Nourriture solide";
    case EntryTypeId.Regurgitation:
      return "Régurgitation";
    case EntryTypeId.Temperature:
      return "Température";
    case EntryTypeId.Teeth:
      return "Dents";
    case EntryTypeId.Urine:
      return "Pipi";
    case EntryTypeId.Vaccine:
      return "Vaccin";
    case EntryTypeId.Vomit:
      return "Vomi";
    case EntryTypeId.Walk:
      return "Marche";
    case EntryTypeId.Weight:
      return "Poids";
    case EntryTypeId.Fart:
      return "Pet";
    case EntryTypeId.Symptom:
      return "Symptôme";
    case EntryTypeId.Note:
      return "Note";
    case EntryTypeId.BabyMash:
      return "Purée";
    case EntryTypeId.VitaminsAndSupplements:
      return "Vitamines et suppléments";
    case EntryTypeId.AwakeTime:
      return "Temps éveillé";
    case EntryTypeId.Activity:
      return "Activité";
    case EntryTypeId.BabyCare:
      return "Soins du bébé";
    case EntryTypeId.BabyToilet:
      return "Petit pot";
    case EntryTypeId.BellyTime:
      return "Temps sur le ventre";
    default:
      return "";
  }
}
