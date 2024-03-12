import { ActivityContext } from "@/pages/Activity/types/ActivityContext";
import { ActivityContextType } from "@/pages/Activity/enums/ActivityContextType";
import ActivityType from "@/pages/Activity/enums/ActivityType";

export default function getDefaultActivitiesOrder(): ActivityType[] {
  return [
    ActivityType.BreastFeeding,
    ActivityType.BottleFeeding,
    ActivityType.Burp,
    ActivityType.Diaper,
    ActivityType.Poop,
    ActivityType.Urine,
    ActivityType.Sleep,
    ActivityType.Walk,
    ActivityType.Note,
    ActivityType.Play,
    ActivityType.Cry,
    ActivityType.Regurgitation,
    ActivityType.Vomit,
    ActivityType.Fart,
    ActivityType.MilkExtraction,
    ActivityType.CarRide,
    ActivityType.Hiccups,
    ActivityType.Weight,
    ActivityType.Size,
    ActivityType.HeadCircumference,
    ActivityType.Bath,
    ActivityType.NasalHygiene,
    ActivityType.NailCutting,
    ActivityType.Temperature,
    ActivityType.Teeth,
    ActivityType.Symptom,
    ActivityType.Medicine,
    ActivityType.MedicalFollowUp,
    ActivityType.Hospital,
    ActivityType.Vaccine,
    ActivityType.SolidFood,
    ActivityType.BabyMash,
    ActivityType.VitaminsAndSupplements,
    ActivityType.AwakeTime,
    ActivityType.Activity,
    ActivityType.BabyCare,
    ActivityType.BabyToilet,
    ActivityType.BellyTime,
  ];
}

export function getDefaultActivityContexts(): ActivityContext[] {
  return [];
}
