import { Entry } from "@/pages/Entry/types/Entry";
import { parseEntryToJSON } from "@/pages/Entry/utils/parseEntryToJSON";

export function deserializeEntry(data: any): Entry | null {
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
    console.error("Failed to parse data: ", error);
    return null;
  }
}
