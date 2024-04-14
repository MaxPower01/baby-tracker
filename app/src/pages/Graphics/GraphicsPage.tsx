import { Box, Stack, Typography } from "@mui/material";

import ActivityGraphic from "@/pages/Graphics/components/ActivityGraphic";
import ActivityModel from "@/pages/Activity/models/ActivityModel";
import ActivityPicker from "@/pages/Activities/components/ActivityPicker";
import ActivityType from "@/pages/Activity/enums/ActivityType";
import { EmptyState } from "@/components/EmptyState";
import { EmptyStateContext } from "@/enums/EmptyStateContext";
import { useState } from "react";

export function GraphicsPage() {
  const [activityType, setActivityType] = useState<ActivityType | null>(null);
  return (
    <Stack
      spacing={2}
      sx={{
        width: "100%",
      }}
    >
      <EmptyState
        context={EmptyStateContext.Graphics}
        override={{
          title: "Bientôt disponible",
          description:
            "Revenez bientôt pour voir des graphiques de vos activités",
          stickerSource: "/stickers/empty-state--graphics.svg",
        }}
      />
      {/* <Stack>
        <Typography variant="h6" textAlign={"center"} fontWeight={"bold"}>
          {new ActivityModel(ActivityType.BreastFeeding).name}
        </Typography>
        <Typography variant="body1" textAlign={"center"}>
          Entrées des dernières 24 heures
        </Typography>
      </Stack> */}

      {/* <ActivityPicker
        activityType={activityType}
        setActivityType={setActivityType}
      />

      {activityType != null ? (
        <ActivityGraphic activityType={activityType} />
      ) : null} */}
    </Stack>
  );
}
