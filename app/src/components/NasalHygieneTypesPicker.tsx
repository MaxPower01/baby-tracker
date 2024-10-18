import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  useTheme,
} from "@mui/material";

import { EntryTypeIcon } from "@/pages/Activities/components/EntryTypeIcon";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { NasalHygieneId } from "@/enums/NasalHygieneId";
import React from "react";
import { getNasalHygieneTypeName } from "@/utils/getNasalHygieneTypeName";
import { parseEnumValue } from "@/utils/parseEnumValue";
import { selectNasalHygieneTypes } from "@/state/slices/activitiesSlice";
import { useSelector } from "react-redux";

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
        <EntryTypeIcon
          type={EntryTypeId.NasalHygiene}
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
