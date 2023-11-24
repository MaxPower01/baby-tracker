import { Entry } from "@/pages/Entries/types/Entry";

export default interface EntriesState {
  entries: Array<Entry>;
  status: "idle" | "loading";
}
