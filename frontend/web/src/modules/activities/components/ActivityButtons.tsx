import { Box, Container } from "@mui/material";
import { ActivityType, CSSBreakpoint } from "../../../lib/enums";
import { Activity } from "../models/Activity";
import ActivityButton from "./ActivityButton";

type Props = {
  onClick?: (type: ActivityType) => void;
};

export default function ActivityButtons({ onClick }: Props) {
  const activities = Object.values(ActivityType)
    .map((value) => {
      const activityType = value as ActivityType;
      return new Activity(activityType);
    })
    .sort((a, b) => a.order - b.order);
  return (
    <Container maxWidth={CSSBreakpoint.Medium}>
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
              key={activity.activityType}
              activity={activity}
              showLabel
              sx={{ paddingTop: 4, paddingBottom: 4 }}
              onClick={() => {
                if (onClick) {
                  onClick(activity.activityType);
                }
              }}
            />
          );
        })}
      </Box>
    </Container>
  );
}
