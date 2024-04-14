import { Entry } from "@/pages/Entry/types/Entry";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";

export default interface EntriesState {
  entries: Array<Entry>;
  orderedEntryTypes: Array<EntryTypeId>;
  status: "idle" | "busy";
  latestRecentEntriesFetchedTimestamp: number | null;
}
