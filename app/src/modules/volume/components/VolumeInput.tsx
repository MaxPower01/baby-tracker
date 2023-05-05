import {
  InputAdornment,
  Stack,
  SxProps,
  TextField,
  Typography,
} from "@mui/material";

type Props = {
  label?: string;
  sx?: SxProps | undefined;
  volume: number;
  inputsAreDisabled?: boolean;
  onChange: (params: { volume: number }) => void;
};

export default function VolumeInput(props: Props) {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    let newVolume = parseInt(value);
    if (newVolume < 0) {
      newVolume = 0;
    }
    if (newVolume > 1000) {
      newVolume = 1000;
    }
    if (isNaN(newVolume)) {
      newVolume = 0;
    }
    props.onChange({
      volume: newVolume,
    });
  };

  return (
    <Stack
      spacing={2}
      sx={props.sx}
      justifyContent={"center"}
      alignItems={"center"}
    >
      {props.label && (
        <Typography textAlign="center" variant="body1">
          {props.label}
        </Typography>
      )}
      <TextField
        variant="standard"
        type="number"
        name="volume"
        placeholder="00"
        value={props.volume}
        onChange={handleInputChange}
        sx={{
          maxWidth: "8em",
        }}
        InputProps={{
          endAdornment: <InputAdornment position="end">ml</InputAdornment>,
          onFocus: (event) => {
            event.target.select();
          },
          sx: {
            "& input": {
              textAlign: "center",
              fontSize: "1.5em",
              fontWeight: "bold",
            },
          },
        }}
        disabled={props.inputsAreDisabled}
      />
    </Stack>
  );
}
