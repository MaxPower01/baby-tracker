import { BabyMash } from "@/types/BabyMash";
import { EntryLocation } from "@/types/EntryLocation";
import { EntryType } from "@/pages/Entries/enums/EntryType";
import { Medicine } from "@/types/Medicine";
import { PoopColor } from "@/types/PoopColor";
import { PoopTexure } from "@/types/PoopTexure";
import { Stopwatch } from "@/types/Stopwatch";
import { Tag } from "@/pages/Tags/models/Tag";

export interface BaseEntry {
  id: string;
  entryType: EntryType;
  startTimestamp: number;
  endTimeStamp: number;
  note: string;
  imageURLs: string[];
  tags: Tag[];
}

export interface Entry extends BaseEntry {
  amount?: number;
  amounts?: {
    side: string;
    value: number;
  }[];
  amountUnit?: string;
  poopAmount?: number;
  poopTexture?: PoopTexure;
  poopColor?: PoopColor;
  urineAmount?: number;
  weight?: number;
  weightUnit?: string;
  length?: number;
  lengthUnit?: string;
  temperature?: number;
  temperatureUnit?: string;
  stopwatch?: Stopwatch;
  stopwatches?: Stopwatch[];
  location?: EntryLocation;
  babyMashes?: BabyMash[];
}

export interface EntryWithAmount extends BaseEntry {
  amount: number;
  amountUnit: string;
}

export interface EntryWithAmountPerSide extends BaseEntry {
  amounts: {
    side: string;
    value: number;
  }[];
  amountUnit: string;
}

export interface EntryWithPoop extends BaseEntry {
  poopAmount: number;
  poopTexture: PoopTexure;
  poopColor: PoopColor;
}

export interface EntryWithUrine extends BaseEntry {
  urineAmount: number;
}

export interface EntryWithWeight extends BaseEntry {
  weight: number;
  weightUnit: string;
}

export interface EntryWithLength extends BaseEntry {
  length: number;
  lengthUnit: string;
}

export interface EntryWithTemperature extends BaseEntry {
  temperature: number;
  temperatureUnit: string;
}

export interface EntryWithDuration extends BaseEntry {
  stopwatch: Stopwatch;
}

export interface EntryWithDurationPerSide extends BaseEntry {
  stopwatches: Stopwatch[];
}

export interface EntryWithLocation extends BaseEntry {
  location: Location;
}

export interface EntryWithBabyMash extends BaseEntry {
  babyMashes: BabyMash[];
}

export interface EntryWithMedicine extends BaseEntry {
  medicines: Medicine[];
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

export interface HospitalEntry extends BaseEntry {
  entryType: EntryType.Hospital;
}

export interface MedicineEntry extends BaseEntry {
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

export interface SolidFoodEntry extends BaseEntry {
  entryType: EntryType.SolidFood;
}

export interface TemperatureEntry extends EntryWithTemperature {
  entryType: EntryType.Temperature;
}

export interface TeethEntry extends BaseEntry {
  entryType: EntryType.Teeth;
}

export interface UrineEntry extends EntryWithUrine {
  entryType: EntryType.Urine;
}

export interface VaccineEntry extends BaseEntry {
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

export interface BurpEntry extends BaseEntry {
  entryType: EntryType.Burp;
}

export interface BathEntry extends EntryWithDuration {
  entryType: EntryType.Bath;
}

export interface NasalHygieneEntry extends BaseEntry {
  entryType: EntryType.NasalHygiene;
}

export interface HiccupsEntry extends EntryWithDuration {
  entryType: EntryType.Hiccups;
}

export interface CarRideEntry extends EntryWithDuration {
  entryType: EntryType.CarRide;
}

export interface NailCuttingEntry extends BaseEntry {
  entryType: EntryType.NailCutting;
}

export interface MedicalFollowUpEntry extends BaseEntry {
  entryType: EntryType.MedicalFollowUp;
}

export interface HeadCircumferenceEntry extends EntryWithLength {
  entryType: EntryType.HeadCircumference;
}

export interface FartEntry extends BaseEntry {
  entryType: EntryType.Fart;
}

export interface NoteEntry extends BaseEntry {
  entryType: EntryType.Note;
}

export interface SymptomEntry extends BaseEntry {
  entryType: EntryType.Symptom;
}

export interface BabyMashEntry extends BaseEntry {
  entryType: EntryType.BabyMash;
}

export interface VitaminsAndSupplementsEntry extends BaseEntry {
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
