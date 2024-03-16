import { ActivityContextType } from "@/pages/Activity/enums/ActivityContextType";

export function activityContextTypeCanMultiSelect(
  activityContextType: ActivityContextType | null
): boolean {
  return (
    activityContextType === ActivityContextType.BabyMash ||
    activityContextType === ActivityContextType.SolidFood ||
    activityContextType === ActivityContextType.Symptom
  );
}
