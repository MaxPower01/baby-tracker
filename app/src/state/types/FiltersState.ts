import { ActivityContext } from "@/pages/Activity/types/ActivityContext";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { SortOrderId } from "@/enums/SortOrderId";

export interface FiltersState {
  entryTypes: Array<EntryTypeId>;
  activityContexts: Array<ActivityContext>;
  sortOrder: SortOrderId;
}
