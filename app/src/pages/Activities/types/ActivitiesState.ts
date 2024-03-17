import { ActivityContext } from "@/pages/Activity/types/ActivityContext";
import ActivityType from "@/pages/Activity/enums/ActivityType";
import { NasalHygieneType } from "@/enums/NasalHygieneType";
import { TemperatureMethod } from "@/enums/TemperatureMethod";

export default interface ActivitiesState {
  activities: string[];
  activitiesOrder: ActivityType[];
  activityContexts: ActivityContext[];
  temperatureMethods: {
    id: TemperatureMethod;
    label: string;
  }[];
  nasalHygieneTypes: {
    id: NasalHygieneType;
    label: string;
  }[];
}
