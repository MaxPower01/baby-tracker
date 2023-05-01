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
import { useEffect } from "react";
type Props = {
  time: number;
  setTime: React.Dispatch<React.SetStateAction<number>>;
  isRunning: boolean;
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
  buttonIsDisabled?: boolean;
  inputsAreDisabled?: boolean;
  label?: string;
  sx?: SxProps | undefined;
};

export default function Stopwatch(props: Props) {
  const seconds = props.time % 60;
  const minutes = Math.floor(props.time / 60);

  let secondsLabel = seconds.toString();
  if (seconds < 10) {
    secondsLabel = `0${secondsLabel}`;
  }

  let minutesLabel = minutes.toString();
  if (minutes < 10) {
    minutesLabel = `0${minutesLabel}`;
  }

  // const timeLabel = useMemo(() => {
  //   if (props.time === 0) {
  //     return "00:00";
  //   }
  //   const minutes = Math.floor(props.time / 60);
  //   let minutesLabel = minutes.toString();
  //   if (minutes < 10) {
  //     minutesLabel = `0${minutesLabel}`;
  //   }
  //   const seconds = props.time % 60;
  //   let secondsLabel = seconds.toString();
  //   if (seconds < 10) {
  //     secondsLabel = `0${secondsLabel}`;
  //   }
  //   return `${minutesLabel}:${secondsLabel}`;
  // }, [props.time]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const name = event.target.name;
    let newSeconds = seconds;
    let newMinutes = minutes;
    if (name === "seconds") {
      newSeconds = parseInt(value);
    } else if (name === "minutes") {
      newMinutes = parseInt(value);
    }
    if (isNaN(newSeconds)) {
      newSeconds = 0;
    }
    if (isNaN(newMinutes)) {
      newMinutes = 0;
    }
    if (newSeconds > 59) {
      newSeconds = 59;
    }
    if (newMinutes > 59) {
      newMinutes = 59;
    }
    props.setTime(newMinutes * 60 + newSeconds);
  };

  useEffect(() => {
    let intervalId: NodeJS.Timer;
    if (props.isRunning) {
      intervalId = setInterval(() => {
        props.setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [props.isRunning]);

  const handleClick = () => {
    if (props.buttonIsDisabled) {
      return;
    }
    if (props.isRunning) {
      props.setIsRunning(false);
    } else {
      props.setIsRunning(true);
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
          onChange={handleInputChange}
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
          onChange={handleInputChange}
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
      <Button
        onClick={handleClick}
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
        variant={props.isRunning ? "contained" : "outlined"}
      >
        {/* <Typography textAlign="center" variant="h6">
          {timeLabel}
        </Typography> */}
        {props.isRunning ? (
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
    </Stack>
  );
}
