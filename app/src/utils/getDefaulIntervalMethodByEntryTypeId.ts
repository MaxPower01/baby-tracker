import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import GroupEntriesInterval from "@/pages/Settings/enums/GroupEntriesInterval";
import { IntervalMethodId } from "@/pages/Settings/enums/IntervalMethodId";
import { entryTypesWithStopwatch } from "@/pages/Entry/utils/entryTypeHasStopwatch";

const typesThatAreGroupedBetweenBeginnings = [EntryTypeId.BreastFeeding];

export function getDefaulIntervalMethodByEntryTypeId() {
  return entryTypesWithStopwatch.map((entryTypeId) => ({
    entryTypeId: entryTypeId,
    methodId: typesThatAreGroupedBetweenBeginnings.includes(entryTypeId)
      ? IntervalMethodId.BeginningToBeginning
      : IntervalMethodId.EndToBeginning,
  }));
}
