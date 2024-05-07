import { DailyEntriesCollection } from "@/types/DailyEntriesCollection";
import { Entry } from "@/pages/Entry/types/Entry";

export function getEntriesFromDailyEntriesCollection(
  dailyEntriesCollection: DailyEntriesCollection
) {
  try {
    const entries: Entry[] = [];
    Object.keys(dailyEntriesCollection).forEach((k) => {
      const dailyEntries = dailyEntriesCollection[k];
      if (dailyEntries && dailyEntries.entries) {
        entries.push(...dailyEntries.entries);
      }
    });
    return entries;
  } catch (error) {
    console.error("Error getting entries from daily entries collection", error);
    return [];
  }
}
