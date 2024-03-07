import ActivityModel from "@/pages/Activity/models/ActivityModel";
import ActivityType from "@/pages/Activity/enums/ActivityType";

export default interface ActivitiesState {
  activities: string[];
  activitiesOrder: ActivityType[];
}
