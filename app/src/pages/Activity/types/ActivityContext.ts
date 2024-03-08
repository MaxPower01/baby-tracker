import { ActivityContextType } from "@/pages/Activity/enums/ActivityContextType";

export interface ActivityContext {
  id: string;
  name: string;
  type: ActivityContextType;
  /**
   * Timestamp of the creation of the activity context.
   * If undefined, it means that the activity context is not created by the user,
   * but by the app and therefore should not be editable.
   */
  createdAtTimestamp?: number;
}
