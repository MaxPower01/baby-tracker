import { EntryType } from "@/pages/Entries/enums/EntryType";

const entryTypesWithSize = [EntryType.Size, EntryType.HeadCircumference];

export function entryTypeHasSize(entryType: EntryType) {
  try {
    if (typeof entryType === "string") {
      const parsed = parseInt(entryType);
      if (!isNaN(parsed)) {
        return entryTypesWithSize.includes(parsed);
      } else {
        return entryTypesWithSize.includes(
          EntryType[entryType as keyof typeof EntryType]
        );
      }
    }
    return entryTypesWithSize.includes(entryType);
  } catch (error) {
    console.error(error);
    return false;
  }
}
