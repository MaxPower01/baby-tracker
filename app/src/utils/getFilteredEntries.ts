import { Entry } from "@/pages/Entry/types/Entry";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { SortOrderId } from "@/enums/SortOrderId";

export function getFilteredEntries(
  entries: Entry[],
  selectedEntryTypes: EntryTypeId[],
  selectedSortOrder: SortOrderId
): Entry[] {
  let newEntries = entries;

  if (selectedEntryTypes.length > 0) {
    newEntries = newEntries.filter((entry) =>
      selectedEntryTypes.includes(entry.entryTypeId)
    );
    const hasPoop = selectedEntryTypes.includes(EntryTypeId.Poop);
    const hasUrine = selectedEntryTypes.includes(EntryTypeId.Urine);

    if (hasPoop || hasUrine) {
      const diaperEntries = entries.filter(
        (entry) => entry.entryTypeId == EntryTypeId.Diaper
      );

      diaperEntries.forEach((entry) => {
        if (hasPoop && entry.poopAmount) {
          if (!newEntries.some((e) => e.id == entry.id)) {
            newEntries.push(entry);
          }
        }

        if (hasUrine && entry.urineAmount) {
          if (!newEntries.some((e) => e.id == entry.id)) {
            newEntries.push(entry);
          }
        }
      });
    }
  }

  if (selectedSortOrder === SortOrderId.DateDesc) {
    newEntries = newEntries.sort((a, b) => b.startTimestamp - a.startTimestamp);
  } else if (selectedSortOrder === SortOrderId.DateAsc) {
    newEntries = newEntries.sort((a, b) => a.startTimestamp - b.startTimestamp);
  }

  return newEntries;
}
