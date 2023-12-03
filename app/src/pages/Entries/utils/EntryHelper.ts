import ActivityType from "@/pages/Activities/enums/ActivityType";
import { Entry } from "@/pages/Entries/types/Entry";
import EntryModel from "@/pages/Entries/models/EntryModel";
import { EntryType } from "@/pages/Entries/enums/EntryType";
import { StopwatchHelper } from "@/components/Stopwatch/utils/StopwatchHelper";

export class EntryHelper {
  private constructor() {}

  public static toJSON(entry: any): object | null {
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

  public static anyStopwatchRunning(entry: Entry): boolean {
    const result =
      entry.stopwatch?.isRunning ||
      entry.stopwatches?.some((stopwatch) => stopwatch.isRunning);
    return result || false;
  }

  public static clone(entry: Entry): Entry | null {
    return EntryHelper.deserialize(EntryHelper.serialize(entry));
  }
}
