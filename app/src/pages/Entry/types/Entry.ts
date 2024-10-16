import { ActivityContext } from "@/pages/Activity/types/ActivityContext";

export interface Entry {
  id?: string;
  babyId: string;
  entryTypeId: number;
  /**
   * Represents the start date of the entry in seconds since the epoch.
   */
  startTimestamp: number;
  /**
   * Represents the end date of the entry in seconds since the epoch.
   */
  endTimestamp: number;
  note: string;
  imageURLs: string[];
  activityContexts: ActivityContext[];
  leftVolume: number | null;
  rightVolume: number | null;
  /**
   * Unit used for weight is grams.
   */
  weight: number | null;
  /**
   * Unit used for size is centimeters.
   */
  size: number | null;
  temperature: number | null;
  /**
   * Represents the duration of the left stopwatch in milliseconds.
   */
  leftTime: number | null;
  leftStopwatchIsRunning: boolean;
  leftStopwatchLastUpdateTime: number | null;
  /**
   * Represents the duration of the right stopwatch in milliseconds.
   */
  rightTime: number | null;
  rightStopwatchIsRunning: boolean;
  rightStopwatchLastUpdateTime: number | null;
  /**
   * Represents the amount of urine as a number between 0 and 5.
   */
  urineAmount: number | null;
  /**
   * Represents the amount of poop as a number between 0 and 5.
   */
  poopAmount: number | null;
  poopColorId: number | null;
  poopTextureId: number | null;
  poopHasUndigestedPieces: boolean | null;
}

export type ExistingEntry = Entry & {
  id: string;
  originalStartTimestamp: number;
};
