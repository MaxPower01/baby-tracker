import { DailyEntriesCollection } from "@/types/DailyEntriesCollection";
import { Entry } from "@/pages/Entry/types/Entry";

export function getEntriesFromDailyEntries(
  dailyEntryCollection: DailyEntriesCollection
): Entry[] {
  const entries: Entry[] = [];

  Object.keys(dailyEntryCollection).forEach((dateKey) => {
    const dailyEntries = dailyEntryCollection[dateKey];
    entries.push(...dailyEntries.entries);
  });

  return entries;
}
