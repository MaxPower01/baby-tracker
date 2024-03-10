import { StopwatchHelper } from "@/utils/StopwatchHelper";
import { parseStopwatchToJSON } from "@/utils/parseStopwatchToJSON";

export function parseEntryToJSON(entry: any): object | null {
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
        result[property] = parseStopwatchToJSON(entry[property]);
        continue;
      }
      if (property === "stopwatches") {
        result[property] = entry[property].map((stopwatch: any) => {
          return parseStopwatchToJSON(stopwatch);
        });
        continue;
      }
      result[property] = entry[property];
    }
    return result;
  } catch (error) {
    console.error("Failed to parse data: ", error);
    return null;
  }
}
