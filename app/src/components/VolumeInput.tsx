import {
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  SwipeableDrawer,
  SxProps,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { ChangeEvent, useState } from "react";

import { CSSBreakpoint } from "@/enums/CSSBreakpoint";
import CloseIcon from "@mui/icons-material/Close";
import { isNullOrWhiteSpace } from "@/utils/utils";

type Props = {
  volume: number;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
};

export function VolumeInput(props: Props) {
  let volumeMl = props.volume.toFixed(2);
  if (volumeMl.endsWith("0") && volumeMl.indexOf(".") !== -1) {
    if (volumeMl.endsWith("0") && volumeMl.endsWith("00") === false) {
      volumeMl = volumeMl.slice(0, -1);
    } else if (volumeMl.endsWith("00")) {
      volumeMl = volumeMl.slice(0, -3);
    }
  }

  let volumeOz = (props.volume * 0.033814).toFixed(2);
  if (volumeOz.endsWith("0") && volumeOz.indexOf(".") !== -1) {
    if (volumeOz.endsWith("0") && volumeOz.endsWith("00") === false) {
      volumeOz = volumeOz.slice(0, -1);
    } else if (volumeOz.endsWith("00")) {
      volumeOz = volumeOz.slice(0, -3);
    }
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    unit: "ml" | "oz"
  ) => {
    const value = e.target.value;
    if (isNullOrWhiteSpace(value)) {
      props.setVolume(0);
      return;
    }

    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue)) {
      return;
    }

    if (unit === "ml") {
      props.setVolume(parsedValue);
    } else {
      props.setVolume(parsedValue / 0.033814);
    }
  };

  return (
    <Stack direction={"row"} spacing={2} sx={{ width: "100%" }}>
      <TextField
        label="Millilitres"
        name="volume-ml"
        type="number"
        value={volumeMl}
        onChange={(e) => handleChange(e, "ml")}
        fullWidth
        InputProps={{
          endAdornment: <InputAdornment position="end">ml</InputAdornment>,
          inputProps: {
            onSelect: (e: React.FocusEvent<HTMLInputElement>) =>
              e.target.select(),
          },
        }}
      />
      <TextField
        label="Onces"
        name="volume-oz"
        type="number"
        value={volumeOz}
        onChange={(e) => handleChange(e, "oz")}
        fullWidth
        InputProps={{
          endAdornment: <InputAdornment position="end">oz</InputAdornment>,
          inputProps: {
            onSelect: (e: React.FocusEvent<HTMLInputElement>) =>
              e.target.select(),
          },
        }}
      />
    </Stack>
  );
}
