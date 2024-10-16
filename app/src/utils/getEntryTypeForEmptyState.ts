import { EmptyStateContext } from "@/enums/EmptyStateContext";
import { EmptyStateProps } from "@/components/EmptyState";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { getEntryTypeFromActivityContextType } from "@/pages/Activity/utils/getEntryTypeFromActivityContextType";

export function getEntryTypeForEmptyState(
  props: EmptyStateProps
): EntryTypeId | null {
  if (props.type != null) {
    return props.type;
  }
  if (props.context === EmptyStateContext.ActivityContextDrawer) {
    if (props.activityContextType != null) {
      return getEntryTypeFromActivityContextType(props.activityContextType);
    }
  }
  return null;
}
