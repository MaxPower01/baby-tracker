import { BaseEntry, Entry } from "@/pages/Entries/types/Entry";

import ActivityType from "@/pages/Activities/enums/ActivityType";
import EntryModel from "@/pages/Entries/models/EntryModel";
import { EntryType } from "@/pages/Entries/enums/EntryType";
import { StopwatchHelper } from "@/components/Stopwatch/utils/StopwatchHelper";

export class EntryHelper {
  static typesWithStopwatch = [
    EntryType.BreastFeeding,
    EntryType.MilkExtraction,
    EntryType.Walk,
    EntryType.Sleep,
    EntryType.Hiccups,
    EntryType.AwakeTime,
    EntryType.Activity,
    EntryType.Bath,
    EntryType.BellyTime,
  ];

  private constructor() {}

  static toJSON(entry: any): object | null {
    try {
      if (entry == null) {
        return null;
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
      return null;
    }
  }

  static serialize(entry: any): string {
    try {
      return JSON.stringify(EntryHelper.toJSON(entry));
    } catch (error) {
      console.error("EntryHelper: Failed to parse data: ", error);
      return "";
    }
  }

  static deserialize(data: any): Entry | null {
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

  static anyStopwatchRunning(entry: Entry): boolean {
    const result =
      entry.stopwatch?.isRunning ||
      entry.stopwatches?.some((stopwatch) => stopwatch.isRunning);
    return result || false;
  }

  static clone(entry: Entry): Entry | null {
    return EntryHelper.deserialize(EntryHelper.serialize(entry));
  }

  static getDefaultEntryFor(type: any): Entry | null {
    if (!EntryHelper.isValidEntryType(type)) {
      return null;
    }
    const entryType = type as EntryType;
    const now = Date.now();
    const baseEntry: BaseEntry = {
      id: "",
      startTimestamp: now,
      endTimeStamp: now,
      entryType,
      imageURLs: [],
      note: "",
      tags: [],
    };
    return baseEntry;
  }

  static isValidEntryType(type: any) {
    if (!type) {
      return false;
    }
    if (typeof type === "number") {
      return Object.values(EntryType).includes(type);
    }
    if (typeof type === "string") {
      return Object.values(EntryType).includes(parseInt(type));
    }
    return false;
  }

  static hasStopwatch(entryType: EntryType) {
    return EntryHelper.typesWithStopwatch.includes(entryType);
  }
}
