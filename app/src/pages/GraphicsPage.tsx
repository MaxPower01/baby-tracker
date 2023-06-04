import { Box, Stack, Typography } from "@mui/material";

import ActivityBarChart from "@/modules/graphics/components/ActivityBarChart";
import ActivityModel from "@/modules/activities/models/ActivityModel";
import ActivityPicker from "@/modules/activities/components/ActivityPicker";
import ActivityType from "@/modules/activities/enums/ActivityType";
import { useState } from "react";

export default function GraphicsPage() {
  const [activityType, setActivityType] = useState<ActivityType | null>(null);
  return (
    <Stack
      spacing={2}
      sx={{
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* <Stack>
        <Typography variant="h6" textAlign={"center"} fontWeight={"bold"}>
          {new ActivityModel(ActivityType.BreastFeeding).name}
        </Typography>
        <Typography variant="body1" textAlign={"center"}>
          Entrées des dernières 24 heures
        </Typography>
      </Stack> */}

      <ActivityPicker
        activityType={activityType}
        setActivityType={setActivityType}
      />

      {activityType != null ? (
        <ActivityBarChart activityType={activityType} />
      ) : null}
    </Stack>
  );
}
