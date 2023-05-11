import ActivityButton from "@/modules/activities/components/ActivityButton";
import ActivityType from "@/modules/activities/enums/ActivityType";
import ActivityModel from "@/modules/activities/models/ActivityModel";
import { Box } from "@mui/material";

type Props = {
  onClick?: (type: ActivityType) => void;
};

export default function ActivityButtons({ onClick }: Props) {
  const activities = Object.values(ActivityType)
    .map((value) => {
      const activityType = value as ActivityType;
      return new ActivityModel(activityType);
    })
    .sort((a, b) => a.order - b.order);
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 1,
      }}
    >
      {activities.map((activity) => {
        return (
          <ActivityButton
            key={activity.type}
            activity={activity}
            showLabel
            sx={{ paddingTop: 2, paddingBottom: 2, fontSize: "0.8em" }}
            onClick={() => {
              if (onClick) {
                onClick(activity.type);
              }
            }}
          />
        );
      })}
    </Box>
  );
}
