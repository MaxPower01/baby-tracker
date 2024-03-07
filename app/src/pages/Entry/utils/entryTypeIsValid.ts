import { EntryType } from "@/pages/Entries/enums/EntryType";

export function entryTypeIsValid(type: any) {
  if (!type) {
    return false;
  }
  if (typeof type === "string") {
    type = parseInt(type);
  }
  if (typeof type === "number") {
    return Object.values(EntryType).includes(type);
  }
  return false;
}
