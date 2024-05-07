import { DailyEntriesCollection } from "@/types/DailyEntriesCollection";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";

export default interface EntriesState {
  recentDailyEntries: DailyEntriesCollection;
  historyDailyEntries: DailyEntriesCollection;
  status: "idle" | "busy";
  latestRecentEntriesFetchedTimestamp: number | null;
}
