import { EntryType } from "@/pages/Entries/enums/EntryType";

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
    if (typeof entryType === "string") {
      const parsed = parseInt(entryType);
      if (!isNaN(parsed)) {
        return typesWithStopwatch.includes(parsed);
      } else {
        return typesWithStopwatch.includes(
          EntryType[entryType as keyof typeof EntryType]
        );
      }
    }
    return typesWithStopwatch.includes(entryType);
  } catch (error) {
    console.error(error);
    return false;
  }
}
