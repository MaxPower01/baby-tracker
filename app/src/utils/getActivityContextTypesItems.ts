import { ActivityContextType } from "@/pages/Activity/enums/ActivityContextType";
import { getActivityContextTypeLabel } from "@/utils/getActivityContextTypeLabel";

type ActivityContextTypeItem = {
  label: string;
  id: ActivityContextType;
};

export function getActivityContextTypesItems() {
  const enumValues = Object.values(ActivityContextType).filter(
    (value) => typeof value !== "string"
  );
  return enumValues.map(
    (value) =>
      ({
        id: value,
        label: getActivityContextTypeLabel(value as ActivityContextType),
      } as ActivityContextTypeItem)
  );
}
