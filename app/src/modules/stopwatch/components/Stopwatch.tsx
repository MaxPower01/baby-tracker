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
import { useEffect, useMemo, useState } from "react";

type Props = {
  label?: string;
  sx?: SxProps | undefined;
};

export default function Stopwatch(props: Props) {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timePaused, setTimePaused] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const minutes = useMemo(() => Math.floor(elapsedTime / 60000), [elapsedTime]);
  const seconds = useMemo(
    () => Math.floor((elapsedTime % 60000) / 1000),
    [elapsedTime]
  );

  useEffect(() => {
    let intervalId: NodeJS.Timer;
    if (isRunning) {
      intervalId = setInterval(() => {
        setElapsedTime(Date.now() - (startTime ?? 0));
      }, 10);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, startTime]);

  const handleStartStop = () => {
    if (isRunning) {
      setIsRunning(false);
      setTimePaused(Date.now());
    } else if (timePaused) {
      setIsRunning(true);
      setStartTime((startTime ?? 0) + (Date.now() - timePaused));
      setTimePaused(null);
    } else {
      setIsRunning(true);
      setStartTime(Date.now() - elapsedTime);
    }
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
        // disabled={props.buttonIsDisabled}
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
          // disabled={props.inputsAreDisabled}
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
          // disabled={props.inputsAreDisabled}
        />
      </Stack>
    </Stack>
  );
}
