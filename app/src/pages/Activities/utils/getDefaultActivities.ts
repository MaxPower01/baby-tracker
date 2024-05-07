import ActivityModel from "@/pages/Activity/models/ActivityModel";
import ActivityType from "@/pages/Activity/enums/ActivityType";
import getDefaultActivitiesOrder from "@/pages/Activities/utils/getDefaultActivitiesOrder";

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
