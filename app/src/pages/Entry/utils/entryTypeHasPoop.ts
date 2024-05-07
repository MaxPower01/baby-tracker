import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";

const entryTypesWithPoop = [EntryTypeId.Diaper, EntryTypeId.Poop];

export function entryTypeHasPoop(entryType: EntryTypeId) {
  try {
    if (typeof entryType === "string") {
      const parsed = parseInt(entryType);
      if (!isNaN(parsed)) {
        return entryTypesWithPoop.includes(parsed);
      } else {
        return entryTypesWithPoop.includes(
          EntryTypeId[entryType as keyof typeof EntryTypeId]
        );
      }
    }
    return entryTypesWithPoop.includes(entryType);
  } catch (error) {
    console.error(error);
    return false;
  }
}
