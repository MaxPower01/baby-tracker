import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";

export function entryTypeIsValid(type: any) {
  if (!type) {
    return false;
  }
  if (typeof type === "string") {
    type = parseInt(type);
  }
  if (typeof type === "number") {
    return Object.values(EntryTypeId).includes(type);
  }
  return false;
}
