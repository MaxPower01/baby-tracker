import { DatapointCategory } from "@/pages/Charts/enums/DatapointCategory";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";

export function getChartColor(
  entryTypeId: EntryTypeId,
  category?: DatapointCategory
) {
  if (category === DatapointCategory.Right) {
    return "lightGreen";
  }

  if (category === DatapointCategory.Left) {
    return "lightBlue";
  }

  if (category === DatapointCategory.Nap) {
    return "deepPurple";
  }

  if (category === DatapointCategory.Awake) {
    return "amber";
  }

  if (entryTypeId == EntryTypeId.Diaper) {
    return "grey";
  }

  if (entryTypeId == EntryTypeId.Poop) {
    return "brown";
  }

  if (entryTypeId == EntryTypeId.Urine) {
    return "yellow";
  }

  if (entryTypeId == EntryTypeId.Sleep) {
    return "indigo";
  }

  return "lightBlue";
}
