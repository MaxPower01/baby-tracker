import { EntryType } from "@/pages/Entries/enums/EntryType";
import { activityContextTypeCanMultiSelect } from "@/pages/Activity/utils/activityContextTypeCanMultiSelect";
import { getActivityContextType } from "@/pages/Activity/utils/getActivityContextType";

export function entryTypeCanHaveMultipleContexts(entryType: EntryType) {
  const activityContextType = getActivityContextType(entryType);
  if (activityContextType == null) {
    return false;
  }
  return activityContextTypeCanMultiSelect(activityContextType);
}
