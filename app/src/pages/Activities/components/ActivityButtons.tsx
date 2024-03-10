import ActivityButton from "@/pages/Activities/components/ActivityButton";
import ActivityModel from "@/pages/Activity/models/ActivityModel";
import ActivityType from "@/pages/Activity/enums/ActivityType";
import { Box } from "@mui/material";
import { selectActivities } from "@/state/activitiesSlice";
import { useSelector } from "react-redux";

type Props = {
  onClick?: (type: ActivityType) => void;
};

export default function ActivityButtons({ onClick }: Props) {
  const activities = useSelector(selectActivities);
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
