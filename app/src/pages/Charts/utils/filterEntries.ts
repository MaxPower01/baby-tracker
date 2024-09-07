import { Entry } from "@/pages/Entry/types/Entry";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { XAxisUnit } from "@/types/XAxisUnit";
import { getDateFromTimestamp } from "@/utils/getDateFromTimestamp";
import { isSameDay } from "@/utils/isSameDay";

export function filterEntries(
  entries: Entry[],
  date: Date,
  unit: XAxisUnit,
  entryTypeId: EntryTypeId
): Entry[] {
  return entries.filter((entry) => {
    const entryStartDate = getDateFromTimestamp(entry.startTimestamp);

    if (!isSameDay({ targetDate: entryStartDate, comparisonDate: date })) {
      return false;
    }

    if (entry.entryTypeId != entryTypeId) {
      return false;
    }

    if (unit === "hours") {
      return entryStartDate.getHours() === date.getHours();
    }

    return true;
  });
}
