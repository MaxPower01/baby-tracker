import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import GroupEntriesInterval from "@/pages/Settings/enums/GroupEntriesInterval";
import { IntervalMethod } from "@/pages/Settings/enums/IntervalMethod";
import { entryTypesWithStopwatch } from "@/pages/Entry/utils/entryTypeHasStopwatch";

const typesThatAreGroupedBetweenBeginnings = [EntryTypeId.BreastFeeding];

export function getDefaulIntervalMethodByEntryTypeId() {
  return entryTypesWithStopwatch.map((entryTypeId) => ({
    entryTypeId: entryTypeId,
    method: typesThatAreGroupedBetweenBeginnings.includes(entryTypeId)
      ? IntervalMethod.BeginningToBeginning
      : IntervalMethod.EndToBeginning,
  }));
}
