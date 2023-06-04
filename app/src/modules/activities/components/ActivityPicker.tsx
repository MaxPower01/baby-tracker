import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";

import ActivityIcon from "@/modules/activities/components/ActivityIcon";
import ActivityModel from "@/modules/activities/models/ActivityModel";
import ActivityType from "@/modules/activities/enums/ActivityType";
import React from "react";

type Props = {
  activityType: ActivityType | null;
  setActivityType: React.Dispatch<React.SetStateAction<ActivityType | null>>;
};

export default function ActivityPicker({
  activityType,
  setActivityType,
}: Props) {
  const handleActivityTypeChange = (
    event: SelectChangeEvent<ActivityType | null>
  ) => {
    const newValue = event.target.value;
    if (newValue === null) return;
    if (typeof newValue === "string") return;
    setActivityType(newValue);
  };
  return (
    <FormControl fullWidth variant="standard">
      <InputLabel id="activity-label">Activité</InputLabel>
      <Select
        id="activity"
        labelId="activity-label"
        value={activityType}
        SelectDisplayProps={{
          style: {
            padding: "0.5em",
          },
        }}
        onChange={handleActivityTypeChange}
        autoFocus
        // error={sexError !== ""}
      >
        {Object.values(ActivityType).map((activityType) => {
          if (typeof activityType === "string") return null;
          const activity = new ActivityModel(activityType);
          return (
            <MenuItem
              value={activityType}
              sx={{
                padding: 1,
              }}
            >
              <Stack direction={"row"} spacing={1} alignItems={"center"}>
                <ActivityIcon
                  activity={activity}
                  sx={{
                    fontSize: "1.5em",
                  }}
                />
                <Typography variant={"body1"} fontWeight={500}>
                  {activity.name}
                </Typography>
              </Stack>
            </MenuItem>
          );
        })}
      </Select>
      {/* <FormHelperText error={sexError !== ""}>
    {sexError !== "" ? sexError : ""}
  </FormHelperText> */}
    </FormControl>
  );
}
