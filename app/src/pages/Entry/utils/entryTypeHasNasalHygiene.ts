import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { parseEnumValue } from "@/utils/parseEnumValue";

const nasalHygieneTypes = [EntryTypeId.NasalHygiene];

export function entryTypeHasNasalHygiene(entryType: EntryTypeId) {
  try {
    const parsedEntryType = parseEnumValue(entryType, EntryTypeId);
    if (parsedEntryType === null) return false;
    return nasalHygieneTypes.includes(parsedEntryType);
  } catch (error) {
    console.error(error);
    return false;
  }
}
