import { EntryType } from "@/pages/Entries/enums/EntryType";

const entryTypesWithPoop = [EntryType.Diaper, EntryType.Poop];

export function entryTypeHasPoop(entryType: EntryType) {
  try {
    if (typeof entryType === "string") {
      const parsed = parseInt(entryType);
      if (!isNaN(parsed)) {
        return entryTypesWithPoop.includes(parsed);
      } else {
        return entryTypesWithPoop.includes(
          EntryType[entryType as keyof typeof EntryType]
        );
      }
    }
    return entryTypesWithPoop.includes(entryType);
  } catch (error) {
    console.error(error);
    return false;
  }
}
