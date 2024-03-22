import { Entry } from "@/pages/Entry/types/Entry";

export default interface EntriesState {
  entries: Array<Entry>;
  status: "idle" | "loading" | "saving";
  latestRecentEntriesFetchedTimestamp: number | null;
}
