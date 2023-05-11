import EntryModel from "@/modules/entries/models/EntryModel";

export default interface EntriesContextValue {
  entries: EntryModel[];
  isLoading: boolean;
  getEntries: () => Promise<void>;
}
