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
  return [
    {
      id: "test-1",
      name: "Lait maternel",
      order: 0,
      type: ActivityContextType.BottleFeeding,
    },
    {
      id: "test-2",
      name: "Prépartion pour nourrisson",
      order: 1,
      type: ActivityContextType.BottleFeeding,
    },
    {
      id: "test-3",
      name: "Item 3",
      order: 2,
      type: ActivityContextType.BottleFeeding,
    },
    {
      id: "test-4",
      name: "Item 4",
      order: 3,
      type: ActivityContextType.BottleFeeding,
    },
    {
      id: "test-5",
      name: "Item 5",
      order: 4,
      type: ActivityContextType.BottleFeeding,
    },
    {
      id: "test-6",
      name: "Item 6",
      order: 5,
      type: ActivityContextType.BottleFeeding,
    },
    {
      id: "test-7",
      name: "Item 7",
      order: 6,
      type: ActivityContextType.BottleFeeding,
    },
    {
      id: "test-8",
      name: "Item 8",
      order: 7,
      type: ActivityContextType.BottleFeeding,
    },
    {
      id: "test-9",
      name: "Item 9",
      order: 8,
      type: ActivityContextType.BottleFeeding,
    },
    {
      id: "test-10",
      name: "Item 10",
      order: 9,
      type: ActivityContextType.BottleFeeding,
    },
  ];
}
