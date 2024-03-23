import { ActivityContext } from "@/pages/Activity/types/ActivityContext";
import { EntryLocation } from "@/types/EntryLocation";
import { EntryType } from "@/pages/Entries/enums/EntryType";
import { PoopColor } from "@/types/PoopColor";
import { PoopTexure } from "@/types/PoopTexure";
import { Stopwatch } from "@/types/Stopwatch";
import { Tag } from "@/pages/Tags/models/Tag";

export interface Entry {
  id?: string;
  babyId: string;
  entryType: EntryType;
  /**
   * Represents the start date of the entry in seconds since the epoch.
   */
  startTimestamp: number;
  /**
   * Represents the end date of the entry in seconds since the epoch.
   */
  endTimestamp: number;
  /**
   * Represents the created date of the entry in seconds since the epoch.
   */
  createdTimestamp: number | null;
  /**
   * Represents the edited date of the entry in seconds since the epoch.
   */
  editedTimestamp: number | null;
  createdBy: string;
  editedBy: string;
  note: string;
  imageURLs: string[];
  activityContexts: ActivityContext[];
  leftVolume: number | null;
  rightVolume: number | null;
  weight: number | null;
  size: number | null;
  temperature: number | null;
  leftTime: number | null;
  leftStopwatchIsRunning: boolean;
  rightTime: number | null;
  rightStopwatchIsRunning: boolean;
  urineAmount: number | null;
  poopAmount: number | null;
  poopColorId: number | null;
  poopTextureId: number | null;
}
