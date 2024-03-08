import { EntryType } from "@/pages/Entries/enums/EntryType";
import { parseEnumValue } from "@/utils/parseEnumValue";

const typesWithStopwatch = [
  EntryType.BreastFeeding,
  EntryType.MilkExtraction,
  EntryType.Walk,
  EntryType.Sleep,
  EntryType.Hiccups,
  EntryType.AwakeTime,
  EntryType.Activity,
  EntryType.Bath,
  EntryType.BellyTime,
];

export function entryTypeHasStopwatch(entryType: EntryType) {
  try {
    const parsedEntryType = parseEnumValue(entryType, EntryType);
    if (parsedEntryType === null) return false;
    return typesWithStopwatch.includes(parsedEntryType);
  } catch (error) {
    console.error(error);
    return false;
  }
}
