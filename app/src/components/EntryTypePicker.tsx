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
import { getDefaultEntryTypesOrder } from "@/pages/Entry/utils/getDefaultEntryTypesOrder";
import { getEntryTypeName } from "@/utils/getEntryTypeName";
import { getPoopTextureName } from "@/utils/getPoopTextureName";
import { getTemperatureMethodName } from "@/utils/getTemperatureMethodName";
import { parseEnumValue } from "@/utils/parseEnumValue";
import { useAuthentication } from "@/components/Authentication/AuthenticationProvider";
import { useSelector } from "react-redux";
import { v4 as uuid } from "uuid";

type Props = {
  value: EntryTypeId;
  setValue: React.Dispatch<React.SetStateAction<EntryTypeId>>;
};

export function EntryTypePicker(props: Props) {
  const theme = useTheme();
  const { user } = useAuthentication();
  const renderItem = (entryTypeId: EntryTypeId) => {
    return (
      <Stack
        direction={"row"}
        spacing={1}
        justifyContent={"flex-start"}
        alignItems={"center"}
      >
        <EntryTypeIcon
          type={entryTypeId}
          sx={{
            fontSize: "1.5em",
            opacity: theme.opacity.secondary,
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

  const entryTypesOrder = user?.entryTypesOrder ?? getDefaultEntryTypesOrder();

  const renderValue = (selected: EntryTypeId | null) => {
    if (selected === null) {
      return "";
    }
    return selected;
  };

  const label = "Type d'entrée";

  return (
    <>
      <FormControl fullWidth variant="outlined">
        <InputLabel id="entry-type-picker-label">{label}</InputLabel>
        <Select
          id="entry-type-picker"
          labelId="entry-type-picker-label"
          value={props.value ?? ""}
          label={label}
          onChange={(e) => props.setValue(e.target.value as EntryTypeId)}
          renderValue={renderItem}
        >
          {entryTypesOrder.map((entryType: EntryTypeId, index) => {
            return (
              <MenuItem key={index} value={entryType}>
                {renderItem(entryType)}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </>
  );
}
