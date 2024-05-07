import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { parseEnumValue } from "@/utils/parseEnumValue";

const typesWithSides = [EntryTypeId.BreastFeeding, EntryTypeId.MilkExtraction];

export function entryTypeHasSides(entryType: EntryTypeId) {
  try {
    const parsedEntryType = parseEnumValue(entryType, EntryTypeId);
    if (parsedEntryType === null) return false;
    return typesWithSides.includes(parsedEntryType);
  } catch (error) {
    console.error(error);
    return false;
  }
}
