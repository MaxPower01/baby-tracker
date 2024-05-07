import { InputAdornment, Stack, TextField } from "@mui/material";

import { ChangeEvent } from "react";
import { isNullOrWhiteSpace } from "@/utils/utils";

type Props = {
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
};

export function WeightInput(props: Props) {
  let kilos = props.value.toFixed(2);
  if (kilos.endsWith("0") && kilos.indexOf(".") !== -1) {
    if (kilos.endsWith("0") && kilos.endsWith("00") === false) {
      kilos = kilos.slice(0, -1);
    } else if (kilos.endsWith("00")) {
      kilos = kilos.slice(0, -3);
    }
  }

  let pounds = (props.value * 2.20462).toFixed(2);
  if (pounds.endsWith("0") && pounds.indexOf(".") !== -1) {
    if (pounds.endsWith("0") && pounds.endsWith("00") === false) {
      pounds = pounds.slice(0, -1);
    } else if (pounds.endsWith("00")) {
      pounds = pounds.slice(0, -3);
    }
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    unit: "kg" | "lb"
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

    if (unit === "kg") {
      props.setValue(parsedValue);
    } else {
      props.setValue(parsedValue / 2.20462);
    }
  };

  return (
    <Stack direction={"row"} spacing={2} sx={{ width: "100%" }}>
      <TextField
        label="Kilogrammes"
        name="weight-kg"
        type="number"
        value={kilos}
        onChange={(e) => handleChange(e, "kg")}
        fullWidth
        InputProps={{
          endAdornment: <InputAdornment position="end">kg</InputAdornment>,
          inputProps: {
            onSelect: (e: React.FocusEvent<HTMLInputElement>) =>
              e.target.select(),
          },
        }}
      />
      <TextField
        label="Livres"
        name="weight-lb"
        type="number"
        value={pounds}
        onChange={(e) => handleChange(e, "lb")}
        fullWidth
        InputProps={{
          endAdornment: <InputAdornment position="end">lb</InputAdornment>,
          inputProps: {
            onSelect: (e: React.FocusEvent<HTMLInputElement>) =>
              e.target.select(),
          },
        }}
      />
    </Stack>
  );
}
