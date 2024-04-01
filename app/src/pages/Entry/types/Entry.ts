import { ActivityContext } from "@/pages/Activity/types/ActivityContext";
import { EntryLocation } from "@/types/EntryLocation";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { PoopColor } from "@/types/PoopColor";
import { Stopwatch } from "@/types/Stopwatch";
import { Tag } from "@/pages/Tags/models/Tag";

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
  leftStopwatchLastUpdateTime: number | null;
  rightTime: number | null;
  rightStopwatchIsRunning: boolean;
  rightStopwatchLastUpdateTime: number | null;
  urineAmount: number | null;
  poopAmount: number | null;
  poopColorId: number | null;
  poopTextureId: number | null;
}
