import { Box } from "@mui/material";
import ActivityType from "../enums/ActivityType";
import { ActivityModel } from "../models/ActivityModel";
import ActivityButton from "./ActivityButton";

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
            sx={{ paddingTop: 4, paddingBottom: 4 }}
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
