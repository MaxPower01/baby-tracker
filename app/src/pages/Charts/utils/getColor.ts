import { DatapointCategory } from "@/pages/Charts/enums/DatapointCategory";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";

export function getColor(
  entryTypeId: EntryTypeId,
  category?: DatapointCategory
) {
  if (entryTypeId == EntryTypeId.Diaper) {
    return "grey";
  }

  if (entryTypeId == EntryTypeId.Poop) {
    return "brown";
  }

  if (entryTypeId == EntryTypeId.Urine) {
    return "yellow";
  }

  if (category != null) {
    if (category === DatapointCategory.Right) {
      return "lightGreen";
    }
  }

  return "lightBlue";
}
