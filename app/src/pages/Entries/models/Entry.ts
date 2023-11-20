import { Stopwatch } from "@/components/Stopwatch/models/Stopwatch";

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

export interface BaseEntry {
  id: string;
  startDate: Date;
  endDate: Date;
  entryType: EntryType;
}

export interface EntryWithAmount extends BaseEntry {
  amount: number;
  unit: string;
}

export interface EntryWithSide extends BaseEntry {
  side: string;
}

export interface EntryWithPoop extends BaseEntry {
  poop: string;
}

export interface EntryWithUrine extends BaseEntry {
  urine: string;
}

export abstract class Entry implements BaseEntry {
  id: string;
  startDate: Date;
  endDate: Date;
  abstract entryType: EntryType;

  constructor(params: { id: string; startDate: Date; endDate: Date }) {
    this.id = params.id;
    this.startDate = params.startDate;
    this.endDate = params.endDate;
  }

  _toJSON(): object {
    return {
      id: this.id,
      startDate: this.startDate,
      endDate: this.endDate,
      entryType: this.entryType,
    };
  }

  abstract toJSON(): object;

  serialize(): string {
    return JSON.stringify(this.toJSON());
  }

  static parse<T extends Entry>(data: any): T {
    try {
      if (typeof data === "string") {
        data = JSON.parse(data);
      }
      switch (data.entryType) {
        case EntryType.BottleFeeding:
          return new BottleFeedingEntry({
            ...data,
          }) as unknown as T;
        case EntryType.BreastFeeding:
          return new BreastFeedingEntry({
            ...data,
          }) as unknown as T;
        case EntryType.Cry:
          return new CryEntry({
            ...data,
          }) as unknown as T;
        case EntryType.Diaper:
          return new DiaperEntry({
            ...data,
          }) as unknown as T;
        case EntryType.Hospital:
          return new HospitalEntry({
            ...data,
          }) as unknown as T;
        case EntryType.Medicine:
          return new MedicineEntry({
            ...data,
          }) as unknown as T;
        case EntryType.MilkExtraction:
          return new MilkExtractionEntry({
            ...data,
          }) as unknown as T;
        case EntryType.Play:
          return new PlayEntry({
            ...data,
          }) as unknown as T;
        case EntryType.Poop:
          return new PoopEntry({
            ...data,
          }) as unknown as T;
        case EntryType.Size:
          return new SizeEntry({
            ...data,
          }) as unknown as T;
        case EntryType.Sleep:
          return new SleepEntry({
            ...data,
          }) as unknown as T;
        case EntryType.SolidFood:
          return new SolidFoodEntry({
            ...data,
          }) as unknown as T;
        case EntryType.Temperature:
          return new TemperatureEntry({
            ...data,
          }) as unknown as T;
        case EntryType.Teeth:
          return new TeethEntry({
            ...data,
          }) as unknown as T;
        case EntryType.Urine:
          return new UrineEntry({
            ...data,
          }) as unknown as T;
        case EntryType.Vaccine:
          return new VaccineEntry({
            ...data,
          }) as unknown as T;
        case EntryType.Walk:
          return new WalkEntry({
            ...data,
          }) as unknown as T;
        case EntryType.Weight:
          return new WeightEntry({
            ...data,
          }) as unknown as T;
        case EntryType.Regurgitation:
          return new RegurgitationEntry({
            ...data,
          }) as unknown as T;
        case EntryType.Vomit:
          return new VomitEntry({
            ...data,
          }) as unknown as T;
        case EntryType.Burp:
          return new BurpEntry({
            ...data,
          }) as unknown as T;
        case EntryType.Bath:
          return new BathEntry({
            ...data,
          }) as unknown as T;
        case EntryType.NasalHygiene:
          return new NasalHygieneEntry({
            ...data,
          }) as unknown as T;
        case EntryType.Hiccups:
          return new HiccupsEntry({
            ...data,
          }) as unknown as T;
        case EntryType.CarRide:
          return new CarRideEntry({
            ...data,
          }) as unknown as T;
        case EntryType.NailCutting:
          return new NailCuttingEntry({
            ...data,
          }) as unknown as T;
        case EntryType.MedicalFollowUp:
          return new MedicalFollowUpEntry({
            ...data,
          }) as unknown as T;
        case EntryType.HeadCircumference:
          return new HeadCircumferenceEntry({
            ...data,
          }) as unknown as T;
        case EntryType.Fart:
          return new FartEntry({
            ...data,
          }) as unknown as T;
        case EntryType.Note:
          return new NoteEntry({
            ...data,
          }) as unknown as T;
        case EntryType.Symptom:
          return new SymptomEntry({
            ...data,
          }) as unknown as T;
        case EntryType.BabyMash:
          return new BabyMashEntry({
            ...data,
          }) as unknown as T;
        case EntryType.VitaminsAndSupplements:
          return new VitaminsAndSupplementsEntry({
            ...data,
          }) as unknown as T;
        case EntryType.AwakeTime:
          return new AwakeTimeEntry({
            ...data,
          }) as unknown as T;
        case EntryType.Activity:
          return new ActivityEntry({
            ...data,
          }) as unknown as T;
        case EntryType.BabyCare:
          return new BabyCareEntry({
            ...data,
          }) as unknown as T;
        case EntryType.BabyToilet:
          return new BabyToiletEntry({
            ...data,
          }) as unknown as T;
        case EntryType.BellyTime:
          return new BellyTimeEntry({
            ...data,
          }) as unknown as T;
        default:
          throw new Error(`Entry: Unknown entry type: ${data.entryType}`);
      }
    } catch (error) {
      throw new Error(`Entry: Failed to parse data: ${error}`);
    }
  }
}

export class BottleFeedingEntry extends Entry implements EntryWithAmount {
  amount: number;
  unit: string;
  entryType = EntryType.BottleFeeding;

  constructor(params: {
    id: string;
    startDate: Date;
    endDate: Date;
    amount: number;
    unit: string;
  }) {
    super(params);
    this.amount = params.amount;
    this.unit = params.unit;
  }

  toJSON(): object {
    return {
      ...super._toJSON(),
    };
  }
}
