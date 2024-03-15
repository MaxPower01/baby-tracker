import { EntryType } from "@/pages/Entries/enums/EntryType";
import { parseEnumValue } from "@/utils/parseEnumValue";

const typesWithSides = [EntryType.BreastFeeding, EntryType.MilkExtraction];

export function entryTypeHasSides(entryType: EntryType) {
  try {
    const parsedEntryType = parseEnumValue(entryType, EntryType);
    if (parsedEntryType === null) return false;
    return typesWithSides.includes(parsedEntryType);
  } catch (error) {
    console.error(error);
    return false;
  }
}
