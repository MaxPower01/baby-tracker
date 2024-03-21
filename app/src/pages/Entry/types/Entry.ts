import { ActivityContext } from "@/pages/Activity/types/ActivityContext";
import { EntryLocation } from "@/types/EntryLocation";
import { EntryType } from "@/pages/Entries/enums/EntryType";
import { PoopColor } from "@/types/PoopColor";
import { PoopTexure } from "@/types/PoopTexure";
import { Stopwatch } from "@/types/Stopwatch";
import { Tag } from "@/pages/Tags/models/Tag";
import { Timestamp } from "firebase/firestore";

export interface Entry {
  id?: string;
  entryType: EntryType;
  startTimestamp: Timestamp;
  endTimestamp: Timestamp;
  note: string;
  imageURLs: string[];
  activityContexts: ActivityContext[];
  leftVolume?: number;
  rightVolume?: number;
  weight?: number;
  size?: number;
  temperature?: number;
  temperatureMethodId?: number;
  leftTime?: number;
  leftStopwatchIsRunning?: boolean;
  rightTime?: number;
  rightStopwatchIsRunning?: boolean;
  urineAmount?: number;
  poopAmount?: number;
  poopColorId?: number;
  poopTextureId?: number;
  nasalHygieneIds?: number[];
}
