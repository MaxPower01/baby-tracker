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
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
};

export function VolumeInput(props: Props) {
  let milliliters = props.value.toFixed(2);
  if (milliliters.endsWith("0") && milliliters.indexOf(".") !== -1) {
    if (milliliters.endsWith("0") && milliliters.endsWith("00") === false) {
      milliliters = milliliters.slice(0, -1);
    } else if (milliliters.endsWith("00")) {
      milliliters = milliliters.slice(0, -3);
    }
  }

  let ounces = (props.value * 0.033814).toFixed(2);
  if (ounces.endsWith("0") && ounces.indexOf(".") !== -1) {
    if (ounces.endsWith("0") && ounces.endsWith("00") === false) {
      ounces = ounces.slice(0, -1);
    } else if (ounces.endsWith("00")) {
      ounces = ounces.slice(0, -3);
    }
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    unit: "ml" | "oz"
  ) => {
    const value = e.target.value;
    if (isNullOrWhiteSpace(value)) {
      props.setValue(0);
      return;
    }

    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue)) {
      return;
    }

    if (unit === "ml") {
      props.setValue(parsedValue);
    } else {
      props.setValue(parsedValue / 0.033814);
    }
  };

  return (
    <Stack direction={"row"} spacing={2} sx={{ width: "100%" }}>
      <TextField
        label="Millilitres"
        name="volume-ml"
        type="number"
        value={milliliters}
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
        value={ounces}
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
