import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { activityContextTypeCanMultiSelect } from "@/pages/Activity/utils/activityContextTypeCanMultiSelect";
import { getActivityContextType } from "@/pages/Activity/utils/getActivityContextType";

export function entryTypeCanHaveMultipleContexts(entryType: EntryTypeId) {
  const activityContextType = getActivityContextType(entryType);
  if (activityContextType == null) {
    return false;
  }
  return activityContextTypeCanMultiSelect(activityContextType);
}
