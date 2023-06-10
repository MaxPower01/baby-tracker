import ActivityModel from "@/modules/activities/models/ActivityModel";
import ActivityType from "@/modules/activities/enums/ActivityType";
import getDefaultActivitiesOrder from "@/modules/activities/utils/getDefaultActivitiesOrder";

export default function getDefaultActivities(): ActivityModel[] {
  const activitiesOrder = getDefaultActivitiesOrder();
  const activities = Object.values(ActivityType)
    .map((value) => {
      if (typeof value === "string") return null;
      const activityType = value as ActivityType;
      const activity = new ActivityModel(activityType);
      activity.order = activitiesOrder.indexOf(activityType);
      return activity;
    })
    .filter((a) => a != null) as ActivityModel[];
  return activities;
}
