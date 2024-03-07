import { parseEntryToJSON } from "@/pages/Entry/utils/parseEntryToJSON";

export function serializeEntry(entry: any): string {
  try {
    return JSON.stringify(parseEntryToJSON(entry));
  } catch (error) {
    console.error("Failed to parse data: ", error);
    return "";
  }
}
