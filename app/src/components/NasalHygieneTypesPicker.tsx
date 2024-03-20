import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  FormGroup,
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
  selectNasalHygieneTypes,
} from "@/state/slices/activitiesSlice";

import { ActivityContext } from "@/pages/Activity/types/ActivityContext";
import { ActivityContextDrawer } from "@/pages/Activity/components/ActivityContextDrawer";
import { ActivityContextType } from "@/pages/Activity/enums/ActivityContextType";
import ActivityIcon from "@/pages/Activities/components/ActivityIcon";
import ActivityModel from "@/pages/Activity/models/ActivityModel";
import ActivityType from "@/pages/Activity/enums/ActivityType";
import AddIcon from "@mui/icons-material/Add";
import { EntryType } from "@/pages/Entries/enums/EntryType";
import { NasalHygieneId } from "@/enums/NasalHygieneId";
import { RootState } from "@/state/store";
import { activityContextTypeCanMultiSelect } from "@/pages/Activity/utils/activityContextTypeCanMultiSelect";
import { getActivityContextPickerNewItemLabel } from "@/pages/Activity/utils/getActivityContextPickerNewItemLabel";
import { getActivityContextPickerPlaceholder } from "@/pages/Activity/utils/getActivityContextPickerPlaceholder";
import { getActivityContextType } from "@/pages/Activity/utils/getActivityContextType";
import { getNasalHygieneTypeName } from "@/utils/getNasalHygieneTypeName";
import { parseEnumValue } from "@/utils/parseEnumValue";
import { useSelector } from "react-redux";
import { v4 as uuid } from "uuid";

type Props = {
  values: NasalHygieneId[];
  setValues: React.Dispatch<React.SetStateAction<NasalHygieneId[]>>;
};

export function NasalHygieneTypesPicker(props: Props) {
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
          type={EntryType.NasalHygiene}
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

  const items = useSelector(selectNasalHygieneTypes);

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    const values =
      typeof value === "string"
        ? value.split(",").map((v) => parseInt(v))
        : value.map((v) => parseInt(v));
    const parsedValues = values
      .map((value) => {
        return parseEnumValue(value, NasalHygieneId);
      })
      .filter((value) => value != null && !isNaN(value)) as NasalHygieneId[];
    const duplicateValues = parsedValues.filter(
      (value, index) => parsedValues.indexOf(value) !== index
    );
    duplicateValues.forEach((value) => {
      while (parsedValues.indexOf(value) !== -1) {
        parsedValues.splice(parsedValues.indexOf(value), 1);
      }
    });

    props.setValues((prev) => {
      return parsedValues.sort();
    });
  };

  return (
    <>
      <FormControl fullWidth variant="outlined">
        <InputLabel id="nasal-hygiene-type-picker-label">{label()}</InputLabel>
        <Select
          id="nasal-hygiene-type-picker"
          labelId="nasal-hygiene-type-picker-label"
          value={props.values.map((item) => item.toString())}
          label={label()}
          multiple={true}
          onChange={handleChange}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => {
                const item = props.values.find(
                  (item) => item.toString() == value
                );
                if (!item) {
                  return null;
                }
                return (
                  <Chip
                    key={item.toString()}
                    label={getNasalHygieneTypeName(
                      parseEnumValue(value, NasalHygieneId)
                    )}
                  />
                );
              })}
            </Box>
          )}
        >
          {items.map((item) => {
            return (
              <MenuItem key={item.id} value={item.id}>
                <FormControlLabel
                  sx={{
                    pointerEvents: "none",
                  }}
                  control={
                    <Checkbox
                      checked={props.values.some(
                        (value) =>
                          value == parseEnumValue(item.id, NasalHygieneId)
                      )}
                      readOnly
                      name={item.label}
                    />
                  }
                  label={item.label}
                />
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </>
  );
}
