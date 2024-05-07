import { InputAdornment, Stack, TextField } from "@mui/material";

import { ChangeEvent } from "react";
import { isNullOrWhiteSpace } from "@/utils/utils";

type Props = {
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
};

export function SizeInput(props: Props) {
  let centimeters = props.value.toFixed(2);
  if (centimeters.endsWith("0") && centimeters.indexOf(".") !== -1) {
    if (centimeters.endsWith("0") && centimeters.endsWith("00") === false) {
      centimeters = centimeters.slice(0, -1);
    } else if (centimeters.endsWith("00")) {
      centimeters = centimeters.slice(0, -3);
    }
  }

  let inches = (props.value / 2.54).toFixed(2);
  if (inches.endsWith("0") && inches.indexOf(".") !== -1) {
    if (inches.endsWith("0") && inches.endsWith("00") === false) {
      inches = inches.slice(0, -1);
    } else if (inches.endsWith("00")) {
      inches = inches.slice(0, -3);
    }
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    unit: "cm" | "in"
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

    if (unit === "cm") {
      props.setValue(parsedValue);
    } else {
      props.setValue(parsedValue * 2.54);
    }
  };

  return (
    <Stack direction={"row"} spacing={2} sx={{ width: "100%" }}>
      <TextField
        label="Centimètres"
        name="size-cm"
        type="number"
        value={centimeters}
        onChange={(e) => handleChange(e, "cm")}
        fullWidth
        InputProps={{
          endAdornment: <InputAdornment position="end">cm</InputAdornment>,
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
