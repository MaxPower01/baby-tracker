import EntryModel from "@/pages/Entry/models/EntryModel";
import { TimePeriod } from "@/enums/TimePeriod";

export default interface EntriesContextValue {
  entries: EntryModel[];
  setEntries: React.Dispatch<React.SetStateAction<EntryModel[]>>;
  isLoading: boolean;
  getEntries: (params: { timePeriod: TimePeriod }) => Promise<EntryModel[]>;
  deleteEntry: (entryId: string) => Promise<void>;
  saveEntry: (entry: EntryModel) => Promise<string | null>;
}
