import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
// import RestartAltIcon from "@mui/icons-material/RestartAlt";
import {
  Button,
  // IconButton,
  InputAdornment,
  Stack,
  SxProps,
  TextField,
  Typography,
  useTheme,
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
  inputsAreReadOnly?: boolean;
  onChange: (params: {
    time: number;
    isRunning: boolean;
    lastUpdateTime: number | null;
  }) => void;
};

export default function Stopwatch(props: Props) {
  const { time, isRunning, lastUpdateTime, onChange, inputsAreReadOnly } =
    props;

  const theme = useTheme();

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
      time: !isRunning && time == 0 ? 1000 : time,
      isRunning: !isRunning,
      lastUpdateTime: Date.now(),
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
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

  const textfieldStyle: SxProps = {
    "& *:before": {
      border: "none !important",
    },
    "& *:after": {
      border: "none !important",
    },
    // transform: "translateX(-0.5em)",
  };

  const inputStyle: SxProps = {
    "& input": {
      textAlign: "right",
      fontSize: "1.5em",
      fontWeight: "bold",
      // width: "2em",
      maxWidth: "3em",
      color: theme.palette.primary.main,
    },
  };

  const playPauseButtonFontSize = "3em";

  return (
    <Stack spacing={2} sx={props.sx}>
      {props.label && (
        <Typography textAlign="center" variant="body1">
          {props.label}
        </Typography>
      )}
      <Stack
        // direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        spacing={2}
        sx={{
          width: "100%",
        }}
      >
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
                fontSize: playPauseButtonFontSize,
              }}
            />
          ) : (
            <PlayArrowIcon
              sx={{
                fontSize: playPauseButtonFontSize,
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
            sx={{
              ...textfieldStyle,
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">h</InputAdornment>,
              onFocus: (event) => {
                if (inputsAreReadOnly) {
                  event.target.blur();
                } else {
                  event.target.select();
                }
              },
              readOnly: inputsAreReadOnly,
              "aria-valuemin": 0,
              "aria-colcount": 2,
              sx: {
                ...inputStyle,
              },
            }}
            // disabled={props.inputsAreDisabled}
          />
          <TextField
            variant="standard"
            type="number"
            name="minutes"
            placeholder="00"
            value={minutes}
            sx={{
              ...textfieldStyle,
            }}
            onChange={handleInputChange}
            InputProps={{
              endAdornment: <InputAdornment position="end">m</InputAdornment>,
              onFocus: (event) => {
                if (inputsAreReadOnly) {
                  event.target.blur();
                } else {
                  event.target.select();
                }
              },
              readOnly: inputsAreReadOnly,
              "aria-valuemin": 0,
              "aria-valuemax": 59,
              "aria-colcount": 2,
              sx: {
                ...inputStyle,
              },
            }}
            // disabled={props.inputsAreDisabled}
          />
          <TextField
            variant="standard"
            type="number"
            name="seconds"
            placeholder="00"
            sx={{
              ...textfieldStyle,
            }}
            value={seconds}
            onChange={handleInputChange}
            InputProps={{
              endAdornment: <InputAdornment position="end">s</InputAdornment>,
              onFocus: (event) => {
                if (inputsAreReadOnly) {
                  event.target.blur();
                } else {
                  event.target.select();
                }
              },
              readOnly: inputsAreReadOnly,
              "aria-valuemin": 0,
              "aria-valuemax": 59,
              "aria-colcount": 2,
              sx: {
                ...inputStyle,
              },
            }}
            // disabled={props.inputsAreDisabled}
          />
        </Stack>
      </Stack>
    </Stack>
  );
}
