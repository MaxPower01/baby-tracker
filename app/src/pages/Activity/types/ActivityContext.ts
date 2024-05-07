import { ActivityContextType } from "@/pages/Activity/enums/ActivityContextType";

export interface ActivityContext {
  id: string;
  name: string;
  type: ActivityContextType;
  order: number;
}
