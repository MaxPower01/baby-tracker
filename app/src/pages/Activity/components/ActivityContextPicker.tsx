import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";

import { ActivityContext } from "@/pages/Activity/types/ActivityContext";
import ActivityIcon from "@/pages/Activities/components/ActivityIcon";
import ActivityModel from "@/pages/Activity/models/ActivityModel";
import ActivityType from "@/pages/Activity/enums/ActivityType";
import { EntryType } from "@/pages/Entries/enums/EntryType";
import React from "react";
import { getActivityContextPickerPlaceholder } from "@/pages/Activity/utils/getActivityContextPickerPlaceholder";

type Props = {
  entryType: EntryType;
  activityContext: ActivityContextType | null;
  setActivityContext: React.Dispatch<
    React.SetStateAction<ActivityContextType | null>
  >;
};

export function ActivityContextPicker(props: Props) {
  const handleActivityContextChange = (
    event: SelectChangeEvent<ActivityContextType | null>
  ) => {
    const newValue = event.target.value;
    if (newValue === null) return;
    if (typeof newValue === "string") return;
    props.setActivityContext(newValue);
  };
  const placeholderName = getActivityContextPickerPlaceholder(props.entryType);
  const activityContexts: ActivityContext[] = []; // TODO: fetch activity contexts
  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel id="activity-context-label">{placeholderName}</InputLabel>
      <Select
        id="activity-context"
        labelId="activity-context-label"
        value={props.activityContext ?? ""}
        // SelectDisplayProps={{
        //   style: {
        //     padding: "0.5em",
        //   },
        // }}
        label={placeholderName}
        onChange={handleActivityContextChange}
        // error={sexError !== ""}
      >
        {activityContexts.map((activityContext) => {
          return (
            <MenuItem
              key={activityContext.type}
              value={activityContext.type}
              // sx={{
              //   padding: 1,
              // }}
            >
              <Stack direction={"row"} spacing={1} alignItems={"center"}>
                <ActivityIcon
                  type={props.entryType}
                  sx={{
                    fontSize: "1.5em",
                  }}
                />
                <Typography variant={"body1"} fontWeight={500}>
                  {activityContext.name}
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
