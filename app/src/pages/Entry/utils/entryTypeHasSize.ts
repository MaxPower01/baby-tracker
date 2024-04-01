import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";

const entryTypesWithSize = [EntryTypeId.Size, EntryTypeId.HeadCircumference];

export function entryTypeHasSize(entryType: EntryTypeId) {
  try {
    if (typeof entryType === "string") {
      const parsed = parseInt(entryType);
      if (!isNaN(parsed)) {
        return entryTypesWithSize.includes(parsed);
      } else {
        return entryTypesWithSize.includes(
          EntryTypeId[entryType as keyof typeof EntryTypeId]
        );
      }
    }
    return entryTypesWithSize.includes(entryType);
  } catch (error) {
    console.error(error);
    return false;
  }
}
