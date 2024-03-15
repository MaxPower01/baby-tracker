import { EntryType } from "@/pages/Entries/enums/EntryType";

const entryTypesWithWeight = [EntryType.Weight];

export function entryTypeHasWeight(entryType: EntryType) {
  try {
    if (typeof entryType === "string") {
      const parsed = parseInt(entryType);
      if (!isNaN(parsed)) {
        return entryTypesWithWeight.includes(parsed);
      } else {
        return entryTypesWithWeight.includes(
          EntryType[entryType as keyof typeof EntryType]
        );
      }
    }
    return entryTypesWithWeight.includes(entryType);
  } catch (error) {
    console.error(error);
    return false;
  }
}
