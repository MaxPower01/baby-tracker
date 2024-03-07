import { Stopwatch } from "@/components/Stopwatch/types/Stopwatch";
import { parseStopwatchToJSON } from "@/components/Stopwatch/utils/parseStopwatchToJSON";

export class StopwatchHelper {
  private constructor() {}

  public static serialize(stopwatch: any): string {
    try {
      return JSON.stringify(parseStopwatchToJSON(stopwatch));
    } catch (error) {
      console.error("StopwatchHelper: Failed to parse data: ", error);
      return "";
    }
  }

  public static deserialize(data: any): Stopwatch | null {
    try {
      if (typeof data === "string") {
        data = JSON.parse(data);
      }
      const properties = Object.getOwnPropertyNames(data);
      const result = {} as any;
      for (const property of properties) {
        if (data[property] instanceof Date) {
          result[property] = new Date(data[property]);
          continue;
        }
        result[property] = data[property];
      }
      return result;
    } catch (error) {
      console.error("StopwatchHelper: Failed to parse data: ", error);
      return null;
    }
  }
}
