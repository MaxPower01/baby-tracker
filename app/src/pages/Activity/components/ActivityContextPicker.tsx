import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";

import { ActivityContext } from "@/pages/Activity/types/ActivityContext";
import { ActivityContextDrawer } from "@/pages/Activity/components/ActivityContextDrawer";
import { ActivityContextType } from "@/pages/Activity/enums/ActivityContextType";
import ActivityIcon from "@/pages/Activities/components/ActivityIcon";
import ActivityModel from "@/pages/Activity/models/ActivityModel";
import ActivityType from "@/pages/Activity/enums/ActivityType";
import AddIcon from "@mui/icons-material/Add";
import { EntryType } from "@/pages/Entries/enums/EntryType";
import { getActivityContextPickerNewItemLabel } from "@/pages/Activity/utils/getActivityContextPickerNewItemLabel";
import { getActivityContextPickerPlaceholder } from "@/pages/Activity/utils/getActivityContextPickerPlaceholder";

type Props = {
  entryType: EntryType;
  activityContext: ActivityContextType | null;
  setActivityContext: React.Dispatch<
    React.SetStateAction<ActivityContextType | null>
  >;
};

export function ActivityContextPicker(props: Props) {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const handleActivityContextChange = (
    event: SelectChangeEvent<ActivityContextType | null>
  ) => {
    const newValue = event.target.value;
    if (newValue === null) return;
    if (newValue === "add") return setDrawerIsOpen(true);
    if (typeof newValue === "string") return;
    props.setActivityContext(newValue);
  };
  const [activityContextId, setActivityContextId] = useState<string | null>(
    null
  );
  const placeholderName = getActivityContextPickerPlaceholder(props.entryType);
  const newItemLabel = getActivityContextPickerNewItemLabel(props.entryType);
  const activityContexts: ActivityContext[] = []; // TODO: fetch activity contexts
  const theme = useTheme();
  const label = () => {
    return (
      <Stack
        direction={"row"}
        spacing={1}
        justifyContent={"flex-start"}
        alignItems={"center"}
        sx={{
          paddingLeft: "1.5em",
          position: "relative",
        }}
      >
        <ActivityIcon
          type={props.entryType}
          sx={{
            fontSize: "1.5em",
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            opacity: theme.opacity.tertiary,
          }}
        />
        <Box
          sx={{
            marginLeft: 1,
            color: theme.customPalette.text.tertiary,
          }}
        >
          {placeholderName}
        </Box>
      </Stack>
    );
  };
  return (
    <>
      <FormControl fullWidth variant="outlined">
        <InputLabel id="activity-context-label">{label()}</InputLabel>
        <Select
          id="activity-context"
          labelId="activity-context-label"
          value={props.activityContext ?? ""}
          label={label()}
          onChange={handleActivityContextChange}
          // error={sexError !== ""}
        >
          {activityContexts.map((activityContext) => {
            return (
              <MenuItem key={activityContext.type} value={activityContext.type}>
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

          <MenuItem key={"add"} value={"add"}>
            <Stack direction={"row"} spacing={1} alignItems={"center"}>
              <AddIcon />
              <Typography variant={"body1"} fontWeight={500}>
                {newItemLabel}
              </Typography>
            </Stack>
          </MenuItem>
        </Select>
        {/* <FormHelperText error={sexError !== ""}>
{sexError !== "" ? sexError : ""}
</FormHelperText> */}
      </FormControl>

      <ActivityContextDrawer
        type={props.entryType}
        isOpen={drawerIsOpen}
        onClose={() => setDrawerIsOpen(false)}
        activityContextId={activityContextId}
        setActivityContextId={setActivityContextId}
      />
    </>
  );
}
