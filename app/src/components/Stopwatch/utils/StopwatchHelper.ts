import { Stopwatch } from "@/components/Stopwatch/types/Stopwatch";

export class StopwatchHelper {
  private constructor() {}

  public static toJSON(stopwatch: any): object {
    try {
      if (stopwatch == null) {
        return {};
      }
      const properties = Object.getOwnPropertyNames(stopwatch);
      const result = {} as any;
      for (const property of properties) {
        if (stopwatch[property] instanceof Date) {
          result[property] = (stopwatch[property] as Date).toISOString();
          continue;
        }
        result[property] = stopwatch[property];
      }
      return result;
    } catch (error) {
      console.error("StopwatchHelper: Failed to parse data: ", error);
      return {};
    }
  }

  public static serialize(stopwatch: any): string {
    try {
      return JSON.stringify(StopwatchHelper.toJSON(stopwatch));
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
