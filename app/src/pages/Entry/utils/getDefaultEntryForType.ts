import { BaseEntry, Entry } from "@/pages/Entry/types/Entry";

import { EntryType } from "@/pages/Entries/enums/EntryType";
import { entryTypeIsValid } from "@/pages/Entry/utils/entryTypeIsValid";

export function getDefaultEntryForType(type: any): Entry | null {
  if (!entryTypeIsValid(type)) {
    return null;
  }
  const entryType = type as EntryType;
  const now = Date.now();
  const baseEntry: BaseEntry = {
    id: "",
    startTimestamp: now,
    endTimeStamp: now,
    entryType,
    imageURLs: [],
    note: "",
    tags: [],
  };
  return baseEntry;
}
