import { InputAdornment, Stack, TextField } from "@mui/material";

import { ChangeEvent } from "react";
import { isNullOrWhiteSpace } from "@/utils/utils";

type Props = {
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
};

export function TemperatureInput(props: Props) {
  let celsius = props.value.toFixed(2);
  if (celsius.endsWith("0") && celsius.indexOf(".") !== -1) {
    if (celsius.endsWith("0") && celsius.endsWith("00") === false) {
      celsius = celsius.slice(0, -1);
    } else if (celsius.endsWith("00")) {
      celsius = celsius.slice(0, -3);
    }
  }

  let fahrenheit = (props.value * 1.8 + 32).toFixed(2);
  if (fahrenheit.endsWith("0") && fahrenheit.indexOf(".") !== -1) {
    if (fahrenheit.endsWith("0") && fahrenheit.endsWith("00") === false) {
      fahrenheit = fahrenheit.slice(0, -1);
    } else if (fahrenheit.endsWith("00")) {
      fahrenheit = fahrenheit.slice(0, -3);
    }
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    unit: "c" | "f"
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

    if (unit === "c") {
      props.setValue(parsedValue);
    } else {
      props.setValue((parsedValue - 32) / 1.8);
    }
  };

  return (
    <Stack direction={"row"} spacing={2} sx={{ width: "100%" }}>
      <TextField
        label="Celsius"
        name="temperature-celsius"
        type="number"
        value={celsius}
        onChange={(e) => handleChange(e, "c")}
        fullWidth
        InputProps={{
          endAdornment: <InputAdornment position="end">°C</InputAdornment>,
        }}
      />
      <TextField
        label="Fahrenheit"
        name="temperature-fahrenheit"
        type="number"
        value={fahrenheit}
        onChange={(e) => handleChange(e, "f")}
        fullWidth
        InputProps={{
          endAdornment: <InputAdornment position="end">°F</InputAdornment>,
        }}
      />
    </Stack>
  );
}
