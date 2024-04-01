import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";

const entryTypesWithUrine = [EntryTypeId.Diaper, EntryTypeId.Urine];

export function entryTypeHasUrine(entryType: EntryTypeId) {
  try {
    if (typeof entryType === "string") {
      const parsed = parseInt(entryType);
      if (!isNaN(parsed)) {
        return entryTypesWithUrine.includes(parsed);
      } else {
        return entryTypesWithUrine.includes(
          EntryTypeId[entryType as keyof typeof EntryTypeId]
        );
      }
    }
    return entryTypesWithUrine.includes(entryType);
  } catch (error) {
    console.error(error);
    return false;
  }
}
