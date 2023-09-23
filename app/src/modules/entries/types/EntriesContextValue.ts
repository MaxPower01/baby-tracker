import TimePeriod from "@/enums/TimePeriod";
import EntryModel from "@/modules/entries/models/EntryModel";

export default interface EntriesContextValue {
  entries: EntryModel[];
  setEntries: React.Dispatch<React.SetStateAction<EntryModel[]>>;
  isLoading: boolean;
  getEntries: (params: { timePeriod: TimePeriod }) => Promise<EntryModel[]>;
  deleteEntry: (entryId: string) => Promise<void>;
  saveEntry: (entry: EntryModel) => Promise<string | null>;
}
