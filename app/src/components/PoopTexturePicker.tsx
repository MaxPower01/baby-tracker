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
import { PoopTextureId } from "@/enums/PoopTextureId";
import React from "react";
import { getPoopTextureName } from "@/utils/getPoopTextureName";
import { selectPoopTextures } from "@/state/slices/activitiesSlice";
import { useSelector } from "react-redux";

type Props = {
  value: PoopTextureId | null;
  setValue: React.Dispatch<React.SetStateAction<PoopTextureId | null>>;
};

export function PoopTexturePicker(props: Props) {
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
          type={EntryTypeId.Poop}
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
          Consistance
        </Box>
      </Stack>
    );
  };

  const items = useSelector(selectPoopTextures);

  const renderValue = (selected: PoopTextureId | null) => {
    if (selected === null) {
      return "";
    }
    return getPoopTextureName(selected);
  };

  return (
    <>
      <FormControl fullWidth variant="outlined">
        <InputLabel id="poop-texture-picker-label">{label()}</InputLabel>
        <Select
          id="poop-texture-picker"
          labelId="poop-texture-picker-label"
          value={props.value ?? ""}
          label={label()}
          onChange={(e) => props.setValue(e.target.value as PoopTextureId)}
          renderValue={renderValue}
        >
          {items.map((item: any) => {
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
