import ActivityModel from "@/pages/Activities/models/ActivityModel";
import ActivityType from "@/pages/Activities/enums/ActivityType";

export default interface ActivitiesState {
  activities: string[];
  activitiesOrder: ActivityType[];
}
