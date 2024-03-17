import { EntryType } from "@/pages/Entries/enums/EntryType";

const entryTypesWithUrine = [EntryType.Diaper, EntryType.Urine];

export function entryTypeHasUrine(entryType: EntryType) {
  try {
    if (typeof entryType === "string") {
      const parsed = parseInt(entryType);
      if (!isNaN(parsed)) {
        return entryTypesWithUrine.includes(parsed);
      } else {
        return entryTypesWithUrine.includes(
          EntryType[entryType as keyof typeof EntryType]
        );
      }
    }
    return entryTypesWithUrine.includes(entryType);
  } catch (error) {
    console.error(error);
    return false;
  }
}
