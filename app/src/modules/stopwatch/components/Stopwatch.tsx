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
        const newTime = time + delta;
        onChange({
          time: newTime,
          isRunning,
          lastUpdateTime: now,
        });
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [isRunning, lastUpdateTime]);

  const seconds = useMemo(() => Math.floor((time % 60000) / 1000), [time]);
  const minutes = useMemo(() => Math.floor((time % 3600000) / 60000), [time]);
  const hours = useMemo(() => Math.floor(time / 3600000), [time]);

  const handleStartStop = () => {
    onChange({
      time: time,
      isRunning: !isRunning,
      lastUpdateTime: Date.now(),
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const name = event.target.name;
    let newSeconds = seconds;
    let newMinutes = minutes;
    let newHours = hours;
    if (name === "seconds") {
      newSeconds = parseInt(value);
    } else if (name === "minutes") {
      newMinutes = parseInt(value);
    } else if (name === "hours") {
      newHours = parseInt(value);
    }
    if (isNaN(newSeconds)) {
      newSeconds = 0;
    }
    if (isNaN(newMinutes)) {
      newMinutes = 0;
    }
    if (isNaN(newHours)) {
      newHours = 0;
    }
    if (newSeconds > 59) {
      newSeconds = 59;
    }
    if (newMinutes > 59) {
      newMinutes = 59;
    }
    if (newHours > 99) {
      newHours = 99;
    }
    onChange({
      time: newSeconds * 1000 + newMinutes * 60000 + newHours * 3600000,
      isRunning,
      lastUpdateTime: Date.now(),
    });
  };

  const inputWidth = undefined;
  const inputFontSize = "1.2em";

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
          name="hours"
          placeholder="00"
          value={hours}
          onChange={handleInputChange}
          sx={
            {
              // "& *:before": {
              //   borderBottom: "none !important",
              // },
            }
          }
          InputProps={{
            endAdornment: <InputAdornment position="end">h</InputAdornment>,
            onFocus: (event) => {
              event.target.select();
            },
            "aria-valuemin": 0,
            "aria-colcount": 2,
            sx: {
              "& input": {
                textAlign: "right",
                fontSize: inputFontSize,
                fontWeight: "bold",
                width: inputWidth,
              },
            },
          }}
          disabled={props.inputsAreDisabled}
        />
        <TextField
          variant="standard"
          type="number"
          name="minutes"
          placeholder="00"
          value={minutes}
          onChange={handleInputChange}
          sx={
            {
              // "& *:before": {
              //   borderBottom: "none !important",
              // },
            }
          }
          InputProps={{
            endAdornment: <InputAdornment position="end">m</InputAdornment>,
            onFocus: (event) => {
              event.target.select();
            },
            "aria-valuemin": 0,
            "aria-valuemax": 59,
            "aria-colcount": 2,
            sx: {
              "& input": {
                textAlign: "right",
                fontWeight: "bold",
                fontSize: inputFontSize,
                width: inputWidth,
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
          onChange={handleInputChange}
          sx={
            {
              // "& *:before": {
              //   borderBottom: "none !important",
              // },
            }
          }
          InputProps={{
            endAdornment: <InputAdornment position="end">s</InputAdornment>,
            onFocus: (event) => {
              event.target.select();
            },
            "aria-valuemin": 0,
            "aria-valuemax": 59,
            "aria-colcount": 2,
            sx: {
              "& input": {
                textAlign: "right",
                fontWeight: "bold",
                fontSize: inputFontSize,
                width: inputWidth,
              },
            },
          }}
          disabled={props.inputsAreDisabled}
        />
      </Stack>
    </Stack>
  );
}
