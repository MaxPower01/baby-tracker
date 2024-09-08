import { DatapointCategory } from "@/pages/Charts/enums/DatapointCategory";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";

export function getColor(
  entryTypeId: EntryTypeId,
  category?: DatapointCategory
) {
  if (category != null) {
    if (category === DatapointCategory.Right) {
      return "lightGreen";
    }
  }
  return "lightBlue";
}
