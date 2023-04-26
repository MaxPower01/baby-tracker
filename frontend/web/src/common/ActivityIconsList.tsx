import { Box } from "@mui/material";
import { ActivityType } from "../lib/enums";
import { Activity } from "../lib/models";
import ActivityIcon from "./ActivityIcon";

type Props = {
  onActivityIconClick?: (type: ActivityType) => void;
};

export default function ActivityIconsList({ onActivityIconClick }: Props) {
  const activities = Object.values(ActivityType)
    .map((value) => {
      const activityType = value as ActivityType;
      return new Activity(activityType);
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
          <ActivityIcon
            key={activity.activityType}
            activity={activity}
            showLabel
            sx={{ paddingTop: 4, paddingBottom: 4 }}
            onClick={() => {
              if (onActivityIconClick) {
                onActivityIconClick(activity.activityType);
              }
            }}
          />
        );
      })}
    </Box>
  );
}
