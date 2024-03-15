import { InputAdornment, Stack, TextField } from "@mui/material";

import { ChangeEvent } from "react";
import { isNullOrWhiteSpace } from "@/utils/utils";

type Props = {
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
};

export function SizeInput(props: Props) {
  let millimeters = props.value.toFixed(2);
  if (millimeters.endsWith("0") && millimeters.indexOf(".") !== -1) {
    if (millimeters.endsWith("0") && millimeters.endsWith("00") === false) {
      millimeters = millimeters.slice(0, -1);
    } else if (millimeters.endsWith("00")) {
      millimeters = millimeters.slice(0, -3);
    }
  }

  let inches = (props.value * 0.0393701).toFixed(2);
  if (inches.endsWith("0") && inches.indexOf(".") !== -1) {
    if (inches.endsWith("0") && inches.endsWith("00") === false) {
      inches = inches.slice(0, -1);
    } else if (inches.endsWith("00")) {
      inches = inches.slice(0, -3);
    }
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    unit: "mm" | "in"
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

    if (unit === "mm") {
      props.setValue(parsedValue);
    } else {
      props.setValue(parsedValue / 0.0393701);
    }
  };

  return (
    <Stack direction={"row"} spacing={2} sx={{ width: "100%" }}>
      <TextField
        label="Millimètres"
        name="size-mm"
        type="number"
        value={millimeters}
        onChange={(e) => handleChange(e, "mm")}
        fullWidth
        InputProps={{
          endAdornment: <InputAdornment position="end">mm</InputAdornment>,
          inputProps: {
            onSelect: (e: React.FocusEvent<HTMLInputElement>) =>
              e.target.select(),
          },
        }}
      />
      <TextField
        label="Pouces"
        name="size-in"
        type="number"
        value={inches}
        onChange={(e) => handleChange(e, "in")}
        fullWidth
        InputProps={{
          endAdornment: <InputAdornment position="end">in</InputAdornment>,
          inputProps: {
            onSelect: (e: React.FocusEvent<HTMLInputElement>) =>
              e.target.select(),
          },
        }}
      />
    </Stack>
  );
}
