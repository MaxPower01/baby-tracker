export interface StopwatchAction {
  type: "start" | "stop";
  date: Date;
}

export interface Stopwatch {
  side: "left" | "right" | null;
  isRunning: boolean;
  duration: number | null;
  actions: StopwatchAction[];
}

export class StopwatchHelper {
  private constructor() {}

  public static toJSON(stopwatch: any): object {
    try {
      if (stopwatch == null) {
        return {};
      }
      const properties = Object.getOwnPropertyNames(stopwatch);
      const result = {} as any;
      for (const property of properties) {
        if (stopwatch[property] instanceof Date) {
          result[property] = (stopwatch[property] as Date).toISOString();
          continue;
        }
        result[property] = stopwatch[property];
      }
      return result;
    } catch (error) {
      console.error("StopwatchHelper: Failed to parse data: ", error);
      return {};
    }
  }

  public static serialize(stopwatch: any): string {
    try {
      return JSON.stringify(StopwatchHelper.toJSON(stopwatch));
    } catch (error) {
      console.error("StopwatchHelper: Failed to parse data: ", error);
      return "";
    }
  }

  public static deserialize(data: any): Stopwatch | null {
    try {
      if (typeof data === "string") {
        data = JSON.parse(data);
      }
      const properties = Object.getOwnPropertyNames(data);
      const result = {} as any;
      for (const property of properties) {
        if (data[property] instanceof Date) {
          result[property] = new Date(data[property]);
          continue;
        }
        result[property] = data[property];
      }
      return result;
    } catch (error) {
      console.error("StopwatchHelper: Failed to parse data: ", error);
      return null;
    }
  }
}

export enum EntryType {
  BottleFeeding = 1,
  BreastFeeding = 2,
  Cry = 3,
  Diaper = 4,
  Hospital = 6,
  Medicine = 7,
  MilkExtraction = 8,
  Play = 9,
  Poop = 10,
  Size = 11,
  Sleep = 12,
  SolidFood = 13,
  Temperature = 14,
  Teeth = 15,
  Urine = 16,
  Vaccine = 17,
  Walk = 18,
  Weight = 19,
  Regurgitation = 20,
  Vomit = 21,
  Burp = 22,
  Bath = 23,
  NasalHygiene = 24,
  Hiccups = 25,
  CarRide = 26,
  NailCutting = 27,
  MedicalFollowUp = 28,
  HeadCircumference = 29,
  Fart = 30,
  Note = 31,
  Symptom = 32,
  BabyMash = 33,
  VitaminsAndSupplements = 34,
  AwakeTime = 35,
  Activity = 36,
  BabyCare = 37,
  BabyToilet = 38,
  BellyTime = 39,
}

export interface Entry {
  id: string;
  startDate: Date;
  endDate: Date;
  note: string;
  imageURLs: string[];
  entryType: EntryType;
}

export interface EntryWithAmount extends Entry {
  amount: number;
  amountUnit: string;
}

export interface EntryWithAmountPerSide extends Entry {
  amounts: {
    side: string;
    value: number;
  }[];
  amountUnit: string;
}

export interface EntryWithPoop extends Entry {
  poopAmount: number;
  poopTexture: string;
  poopColor: string;
}

export interface EntryWithUrine extends Entry {
  urineAmount: number;
}

export interface EntryWithWeight extends Entry {
  weight: number;
  weightUnit: string;
}

export interface EntryWithLength extends Entry {
  length: number;
  lengthUnit: string;
}

export interface EntryWithTemperature extends Entry {
  temperature: number;
  temperatureUnit: string;
}

export interface EntryWithDuration extends Entry {
  stopwatch: Stopwatch;
}

export interface EntryWithDurationPerSide extends Entry {
  stopwatches: Stopwatch[];
}

export interface EntryWithLocation extends Entry {
  location: {
    id: string;
    name: string;
  };
}

export interface EntryWithBabyMash extends Entry {
  babyMashes: {
    id: string;
    name: string;
  }[];
}

export interface EntryWithMedicine extends Entry {
  medicines: {
    id: string;
    name: string;
  }[];
}

export class EntryHelper {
  private constructor() {}

  public static toJSON(entry: any): object {
    try {
      if (entry == null) {
        return {};
      }
      const properties = Object.getOwnPropertyNames(entry);
      const result = {} as any;
      for (const property of properties) {
        if (entry[property] instanceof Date) {
          result[property] = (entry[property] as Date).toISOString();
          continue;
        }
        if (property === "stopwatch") {
          result[property] = StopwatchHelper.toJSON(entry[property]);
          continue;
        }
        if (property === "stopwatches") {
          result[property] = entry[property].map((stopwatch: any) => {
            return StopwatchHelper.toJSON(stopwatch);
          });
          continue;
        }
        result[property] = entry[property];
      }
      return result;
    } catch (error) {
      console.error("EntryHelper: Failed to parse data: ", error);
      return {};
    }
  }

  public static serialize(entry: any): string {
    try {
      return JSON.stringify(EntryHelper.toJSON(entry));
    } catch (error) {
      console.error("EntryHelper: Failed to parse data: ", error);
      return "";
    }
  }

  public static deserialize(data: any): Entry | null {
    try {
      if (typeof data === "string") {
        data = JSON.parse(data);
      }
      const properties = Object.getOwnPropertyNames(data);
      const result = {} as any;
      for (const property of properties) {
        if (property === "entryType") {
          continue;
        }
        if (data[property] instanceof Date) {
          result[property] = new Date(data[property]);
          continue;
        }
        result[property] = data[property];
      }
      return result;
    } catch (error) {
      console.error("EntryHelper: Failed to parse data: ", error);
      return null;
    }
  }
}

export interface BottleFeedingEntry extends EntryWithAmount {
  entryType: EntryType.BottleFeeding;
}

export interface BreastFeedingEntry extends EntryWithDurationPerSide {
  entryType: EntryType.BreastFeeding;
}

export interface CryEntry extends EntryWithDuration {
  entryType: EntryType.Cry;
}

export interface DiaperEntry extends EntryWithPoop, EntryWithUrine {
  entryType: EntryType.Diaper;
}

export interface HospitalEntry extends Entry {
  entryType: EntryType.Hospital;
}

export interface MedicineEntry extends Entry {
  entryType: EntryType.Medicine;
}

export interface MilkExtractionEntry extends EntryWithAmount {
  entryType: EntryType.MilkExtraction;
}

export interface PlayEntry extends EntryWithDuration {
  entryType: EntryType.Play;
}

export interface PoopEntry extends EntryWithPoop {
  entryType: EntryType.Poop;
}

export interface SizeEntry extends EntryWithLength {
  entryType: EntryType.Size;
}

export interface SleepEntry extends EntryWithDuration {
  entryType: EntryType.Sleep;
}

export interface SolidFoodEntry extends Entry {
  entryType: EntryType.SolidFood;
}

export interface TemperatureEntry extends EntryWithTemperature {
  entryType: EntryType.Temperature;
}

export interface TeethEntry extends Entry {
  entryType: EntryType.Teeth;
}

export interface UrineEntry extends EntryWithUrine {
  entryType: EntryType.Urine;
}

export interface VaccineEntry extends Entry {
  entryType: EntryType.Vaccine;
}

export interface WalkEntry extends EntryWithDuration {
  entryType: EntryType.Walk;
}

export interface WeightEntry extends EntryWithWeight {
  entryType: EntryType.Weight;
}

export interface RegurgitationEntry extends EntryWithAmount {
  entryType: EntryType.Regurgitation;
}

export interface VomitEntry extends EntryWithAmount {
  entryType: EntryType.Vomit;
}

export interface BurpEntry extends Entry {
  entryType: EntryType.Burp;
}

export interface BathEntry extends EntryWithDuration {
  entryType: EntryType.Bath;
}

export interface NasalHygieneEntry extends Entry {
  entryType: EntryType.NasalHygiene;
}

export interface HiccupsEntry extends EntryWithDuration {
  entryType: EntryType.Hiccups;
}

export interface CarRideEntry extends EntryWithDuration {
  entryType: EntryType.CarRide;
}

export interface NailCuttingEntry extends Entry {
  entryType: EntryType.NailCutting;
}

export interface MedicalFollowUpEntry extends Entry {
  entryType: EntryType.MedicalFollowUp;
}

export interface HeadCircumferenceEntry extends EntryWithLength {
  entryType: EntryType.HeadCircumference;
}

export interface FartEntry extends Entry {
  entryType: EntryType.Fart;
}

export interface NoteEntry extends Entry {
  entryType: EntryType.Note;
}

export interface SymptomEntry extends Entry {
  entryType: EntryType.Symptom;
}

export interface BabyMashEntry extends Entry {
  entryType: EntryType.BabyMash;
}

export interface VitaminsAndSupplementsEntry extends Entry {
  entryType: EntryType.VitaminsAndSupplements;
}

export interface AwakeTimeEntry extends EntryWithDuration {
  entryType: EntryType.AwakeTime;
}

export interface ActivityEntry extends EntryWithDuration {
  entryType: EntryType.Activity;
}

export interface BabyCareEntry extends EntryWithDuration {
  entryType: EntryType.BabyCare;
}

export interface BabyToiletEntry extends EntryWithDuration {
  entryType: EntryType.BabyToilet;
}

export interface BellyTimeEntry extends EntryWithDuration {
  entryType: EntryType.BellyTime;
}
