import ActivityModel from "@/modules/activities/models/ActivityModel";
import ActivityType from "@/modules/activities/enums/ActivityType";

export default interface ActivitiesState {
  activities: string[];
  activitiesOrder: ActivityType[];
}
