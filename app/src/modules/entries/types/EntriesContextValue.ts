import EntryModel from "@/modules/entries/models/EntryModel";

export default interface EntriesContextValue {
  entries: EntryModel[];
  setEntries: React.Dispatch<React.SetStateAction<EntryModel[]>>;
  isLoading: boolean;
  getEntries: () => Promise<void>;
}
