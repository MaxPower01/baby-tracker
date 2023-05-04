import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {
  Button,
  InputAdornment,
  Stack,
  SxProps,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo } from "react";

type Props = {
  label?: string;
  sx?: SxProps | undefined;
  time: number;
  isRunning: boolean;
  lastUpdateTime: number | null;
  buttonIsDisabled?: boolean;
  inputsAreDisabled?: boolean;
  onChange: (params: {
    time: number;
    isRunning: boolean;
    lastUpdateTime: number | null;
  }) => void;
};

export default function Stopwatch(props: Props) {
  const { time, isRunning, lastUpdateTime, onChange } = props;

  useEffect(() => {
    if (isRunning) {
      const intervalId = setInterval(() => {
        const now = Date.now();
        const delta = now - (lastUpdateTime ?? now);
        onChange({
          time: time + delta,
          isRunning,
          lastUpdateTime: now,
        });
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [isRunning, lastUpdateTime]);

  const minutes = useMemo(() => Math.floor(time / 60000), [time]);
  const seconds = useMemo(() => Math.floor((time % 60000) / 1000), [time]);

  const handleStartStop = () => {
    onChange({
      time: time,
      isRunning: !isRunning,
      lastUpdateTime: Date.now(),
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
        <Typography textAlign="center" variant="h6">
          {props.label}
        </Typography>
      )}
      <Button
        onClick={handleStartStop}
        disabled={props.buttonIsDisabled}
        sx={{
          borderRadius: "9999px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          paddingLeft: 2,
          paddingRight: 2,
          paddingTop: 1,
          paddingBottom: 1,
        }}
        variant={isRunning ? "contained" : "outlined"}
      >
        {isRunning ? (
          <PauseIcon
            sx={{
              fontSize: "4em",
            }}
          />
        ) : (
          <PlayArrowIcon
            sx={{
              fontSize: "4em",
            }}
          />
        )}
      </Button>
      <Stack
        direction={"row"}
        spacing={0}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <TextField
          variant="standard"
          type="number"
          name="minutes"
          placeholder="00"
          value={minutes}
          // onChange={handleInputChange}
          sx={{
            maxWidth: "8em",
          }}
          InputProps={{
            endAdornment: <InputAdornment position="end">min</InputAdornment>,
            onFocus: (event) => {
              event.target.select();
            },
            "aria-valuemin": 0,
            "aria-valuemax": 59,
            "aria-colcount": 2,
            sx: {
              "& input": {
                textAlign: "right",
                fontSize: "1.35em",
              },
            },
          }}
          disabled={props.inputsAreDisabled}
        />
        <TextField
          variant="standard"
          type="number"
          name="seconds"
          placeholder="00"
          value={seconds}
          // onChange={handleInputChange}
          sx={{
            maxWidth: "8em",
          }}
          InputProps={{
            endAdornment: <InputAdornment position="end">sec</InputAdornment>,
            onFocus: (event) => {
              event.target.select();
            },
            "aria-valuemin": 0,
            "aria-valuemax": 59,
            "aria-colcount": 2,
            sx: {
              "& input": {
                textAlign: "right",
                fontSize: "1.35em",
              },
            },
          }}
          disabled={props.inputsAreDisabled}
        />
      </Stack>
    </Stack>
  );
}
