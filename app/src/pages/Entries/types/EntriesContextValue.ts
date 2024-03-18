import EntryModel from "@/pages/Entry/models/EntryModel";
import { TimePeriodId } from "@/enums/TimePeriodId";

export default interface EntriesContextValue {
  entries: EntryModel[];
  setEntries: React.Dispatch<React.SetStateAction<EntryModel[]>>;
  isLoading: boolean;
  getEntries: (params: { timePeriod: TimePeriodId }) => Promise<EntryModel[]>;
  deleteEntry: (entryId: string) => Promise<void>;
  saveEntry: (entry: EntryModel) => Promise<string | null>;
}
