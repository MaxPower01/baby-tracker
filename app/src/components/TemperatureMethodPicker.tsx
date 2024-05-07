import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import {
  selectActivityContexts,
  selectActivityContextsOfType,
  selectTemperatureMethods,
} from "@/state/slices/activitiesSlice";

import { ActivityContext } from "@/pages/Activity/types/ActivityContext";
import { ActivityContextDrawer } from "@/pages/Activity/components/ActivityContextDrawer";
import { ActivityContextType } from "@/pages/Activity/enums/ActivityContextType";
import ActivityIcon from "@/pages/Activities/components/ActivityIcon";
import ActivityModel from "@/pages/Activity/models/ActivityModel";
import ActivityType from "@/pages/Activity/enums/ActivityType";
import AddIcon from "@mui/icons-material/Add";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { RootState } from "@/state/store";
import { TemperatureMethodId } from "@/enums/TemperatureMethodId";
import { activityContextTypeCanMultiSelect } from "@/pages/Activity/utils/activityContextTypeCanMultiSelect";
import { getActivityContextPickerNewItemLabel } from "@/pages/Activity/utils/getActivityContextPickerNewItemLabel";
import { getActivityContextPickerPlaceholder } from "@/pages/Activity/utils/getActivityContextPickerPlaceholder";
import { getActivityContextType } from "@/pages/Activity/utils/getActivityContextType";
import { getTemperatureMethodName } from "@/utils/getTemperatureMethodName";
import { parseEnumValue } from "@/utils/parseEnumValue";
import { useSelector } from "react-redux";
import { v4 as uuid } from "uuid";

type Props = {
  value: TemperatureMethodId | null;
  setValue: React.Dispatch<React.SetStateAction<TemperatureMethodId | null>>;
};

export function TemperatureMethodPicker(props: Props) {
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
          type={EntryTypeId.Temperature}
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
          Méthode utilisée
        </Box>
      </Stack>
    );
  };

  const items = useSelector(selectTemperatureMethods);

  const renderValue = (selected: TemperatureMethodId | null) => {
    if (selected === null) {
      return "";
    }
    return getTemperatureMethodName(selected);
  };

  return (
    <>
      <FormControl fullWidth variant="outlined">
        <InputLabel id="temperature-method-picker-label">{label()}</InputLabel>
        <Select
          id="temperature-method-picker"
          labelId="temperature-method-picker-label"
          value={props.value ?? ""}
          label={label()}
          onChange={(e) =>
            props.setValue(e.target.value as TemperatureMethodId)
          }
          renderValue={renderValue}
        >
          {items.map((item) => {
            return (
              <MenuItem key={item.id} value={item.id}>
                <ListItemText primary={item.label} />
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </>
  );
}
