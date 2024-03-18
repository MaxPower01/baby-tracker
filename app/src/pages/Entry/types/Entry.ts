import { ActivityContext } from "@/pages/Activity/types/ActivityContext";
import { EntryLocation } from "@/types/EntryLocation";
import { EntryType } from "@/pages/Entries/enums/EntryType";
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
  activityContexts: ActivityContext[];
}
