import {
  Box,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  useTheme,
} from "@mui/material";

import { EntryTypeIcon } from "@/pages/Activities/components/EntryTypeIcon";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import React from "react";
import { TemperatureMethodId } from "@/enums/TemperatureMethodId";
import { getTemperatureMethodName } from "@/utils/getTemperatureMethodName";
import { selectTemperatureMethods } from "@/state/slices/activitiesSlice";
import { useSelector } from "react-redux";

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
        <EntryTypeIcon
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
