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
  selectPoopTextures,
  selectTemperatureMethods,
} from "@/state/slices/activitiesSlice";

import { ActivityContext } from "@/pages/Activity/types/ActivityContext";
import { ActivityContextDrawer } from "@/pages/Activity/components/ActivityContextDrawer";
import { ActivityContextType } from "@/pages/Activity/enums/ActivityContextType";
import ActivityType from "@/pages/Activity/enums/ActivityType";
import AddIcon from "@mui/icons-material/Add";
import { EntryTypeIcon } from "@/pages/Activities/components/EntryTypeIcon";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { RootState } from "@/state/store";
import { TemperatureMethodId } from "@/enums/TemperatureMethodId";
import { activityContextTypeCanMultiSelect } from "@/pages/Activity/utils/activityContextTypeCanMultiSelect";
import { getActivityContextPickerNewItemLabel } from "@/pages/Activity/utils/getActivityContextPickerNewItemLabel";
import { getActivityContextPickerPlaceholder } from "@/pages/Activity/utils/getActivityContextPickerPlaceholder";
import { getActivityContextType } from "@/pages/Activity/utils/getActivityContextType";
import { getEntryTypeName } from "@/utils/getEntryTypeName";
import { getPoopTextureName } from "@/utils/getPoopTextureName";
import { getTemperatureMethodName } from "@/utils/getTemperatureMethodName";
import { parseEnumValue } from "@/utils/parseEnumValue";
import { selectEntryTypesOrder } from "@/state/slices/settingsSlice";
import { useSelector } from "react-redux";
import { v4 as uuid } from "uuid";

type Props = {
  value: EntryTypeId;
  setValue: React.Dispatch<React.SetStateAction<EntryTypeId>>;
};

export function EntryTypePicker(props: Props) {
  const theme = useTheme();
  const entryTypesOrder = useSelector(selectEntryTypesOrder);
  const renderItem = (entryTypeId: EntryTypeId) => {
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
        <EntryTypeIcon
          type={entryTypeId}
          sx={{
            fontSize: "1.5em",
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            opacity: theme.opacity.tertiary,
          }}
        />
        <ListItemText
          sx={{
            marginLeft: 1,
          }}
          primary={getEntryTypeName(entryTypeId)}
        />
      </Stack>
    );
  };

  const items = useSelector(selectEntryTypesOrder);

  const renderValue = (selected: EntryTypeId | null) => {
    if (selected === null) {
      return "";
    }
    return selected;
  };

  return (
    <>
      <FormControl fullWidth variant="outlined">
        <InputLabel id="entry-type-picker-label">Type d'entrée</InputLabel>
        <Select
          id="entry-type-picker"
          labelId="entry-type-picker-label"
          value={props.value ?? ""}
          label={renderItem(props.value)}
          onChange={(e) => props.setValue(e.target.value as EntryTypeId)}
          renderValue={renderValue}
        >
          {items.map((item: EntryTypeId, index) => {
            return (
              <MenuItem key={index} value={item}>
                {renderItem(item)}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </>
  );
}
