import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";

const entryTypesWithWeight = [EntryTypeId.Weight];

export function entryTypeHasWeight(entryType: EntryTypeId) {
  try {
    if (typeof entryType === "string") {
      const parsed = parseInt(entryType);
      if (!isNaN(parsed)) {
        return entryTypesWithWeight.includes(parsed);
      } else {
        return entryTypesWithWeight.includes(
          EntryTypeId[entryType as keyof typeof EntryTypeId]
        );
      }
    }
    return entryTypesWithWeight.includes(entryType);
  } catch (error) {
    console.error(error);
    return false;
  }
}
