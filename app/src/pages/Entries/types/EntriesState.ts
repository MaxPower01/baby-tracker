import { Entry } from "@/pages/Entry/types/Entry";

export default interface EntriesState {
  entries: Array<Entry>;
  status: "idle" | "loading";
  latestRecentEntriesFetchedTimestamp: number | null;
}
