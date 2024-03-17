import { EntryType } from "@/pages/Entries/enums/EntryType";
import { parseEnumValue } from "@/utils/parseEnumValue";

const nasalHygieneTypes = [EntryType.NasalHygiene];

export function entryTypeHasNasalHygiene(entryType: EntryType) {
  try {
    const parsedEntryType = parseEnumValue(entryType, EntryType);
    if (parsedEntryType === null) return false;
    return nasalHygieneTypes.includes(parsedEntryType);
  } catch (error) {
    console.error(error);
    return false;
  }
}
