import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { parseEnumValue } from "@/utils/parseEnumValue";

const typesWithStopwatch = [
  EntryTypeId.BreastFeeding,
  EntryTypeId.MilkExtraction,
  EntryTypeId.Walk,
  EntryTypeId.Sleep,
  EntryTypeId.Hiccups,
  EntryTypeId.AwakeTime,
  EntryTypeId.Activity,
  EntryTypeId.Bath,
  EntryTypeId.BellyTime,
  EntryTypeId.Play,
];

export function entryTypeHasStopwatch(entryType: EntryTypeId) {
  try {
    const parsedEntryType = parseEnumValue(entryType, EntryTypeId);
    if (parsedEntryType === null) return false;
    return typesWithStopwatch.includes(parsedEntryType);
  } catch (error) {
    console.error(error);
    return false;
  }
}
