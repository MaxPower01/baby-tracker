import { Entry } from "@/pages/Entry/types/Entry";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";

export default interface EntriesState {
  recentEntries: Array<Entry>;
  historyEntries: Array<Entry>;
  status: "idle" | "busy";
  latestRecentEntriesFetchedTimestamp: number | null;
}
