import EntryModel from "@/modules/entries/models/EntryModel";

export default interface EntriesContextValue {
  entries: EntryModel[];
  setEntries: React.Dispatch<React.SetStateAction<EntryModel[]>>;
  isLoading: boolean;
  getEntries: () => Promise<void>;
  deleteEntry: (entryId: string) => Promise<void>;
  saveEntry: (entry: EntryModel) => Promise<void>;
}
