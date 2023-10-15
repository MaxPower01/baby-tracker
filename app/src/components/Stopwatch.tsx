import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  SwipeableDrawer,
  SxProps,
  TextField,
  TextFieldVariants,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import CSSBreakpoint from "@/enums/CSSBreakpoint";
import CloseIcon from "@mui/icons-material/Close";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import formatStopwatchTime from "@/utils/formatStopwatchTime";
import { isNullOrWhiteSpace } from "@/utils/utils";

// import RestartAltIcon from "@mui/icons-material/RestartAlt";

type Props = {
  playPauseButtonId: string;
  editButtonId: string;
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
    isStartStop: boolean;
  }) => void;
};

export default function Stopwatch(props: Props) {
  const { time, isRunning, lastUpdateTime, onChange, inputsAreReadOnly } =
    props;

  const theme = useTheme();

  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const [drawerTime, setDrawerTime] = useState(time);

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
          isStartStop: false,
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
      isStartStop: true,
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
      isStartStop: false,
    });
  };

  const textfieldStyle: SxProps = {
    "& *:before": {
      border: "none !important",
    },
    "& *:after": {
      border: "none !important",
    },
    flex: 1,
    // transform: "translateX(-0.5em)",
  };

  const textFieldVariant: TextFieldVariants = "outlined";

  const inputStyle: SxProps = {
    "& input": {
      // textAlign: "center",
      // fontSize: "2em",
      fontWeight: "bold",
      // width: "2em",
      // maxWidth: "5em",
      color: theme.palette.primary.main,
    },
  };

  const selectStyle: SxProps = {
    fontWeight: "bold",
    color: theme.customPalette.text.primary,
    fontSize: "1.25em",
  };

  const playPauseButtonFontSize = "3.5em";

  return (
    <>
      <Stack spacing={2} sx={props.sx}>
        {/* {props.label && (
        <Typography textAlign="center" variant="body1">
          {props.label}
        </Typography>
      )} */}
        <Stack
          // direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          spacing={1}
          sx={{
            width: "100%",
          }}
        >
          <Stack
            direction={"row"}
            spacing={0}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Button
              id={props.editButtonId}
              variant={inputsAreReadOnly ? "text" : "text"}
              onClick={() => {
                if (!inputsAreReadOnly) {
                  setDrawerTime(time);
                  setDrawerIsOpen(true);
                }
              }}
              // disabled={inputsAreReadOnly}
            >
              <Typography
                variant="h5"
                color={
                  inputsAreReadOnly
                    ? theme.customPalette.text.primary
                    : undefined
                }
              >
                {formatStopwatchTime(time, false, true)}
              </Typography>
            </Button>
          </Stack>
          <Button
            id={props.playPauseButtonId}
            onClick={handleStartStop}
            disabled={props.buttonIsDisabled}
            sx={{
              borderRadius: "9999px",
              paddingLeft: 2,
              paddingRight: 2,
              paddingTop: 1,
              paddingBottom: 1,
              minWidth: "10em",
            }}
            variant={isRunning ? "contained" : "outlined"}
          >
            <Stack spacing={0} justifyContent={"center"} alignItems={"center"}>
              {props.label && (
                <Typography
                  textAlign="center"
                  variant="body1"
                  textTransform={"none"}
                  fontWeight={"300"}
                >
                  {props.label}
                </Typography>
              )}
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
            </Stack>
          </Button>
        </Stack>
      </Stack>

      <Dialog
        open={drawerIsOpen}
        onClose={() => setDrawerIsOpen(false)}
        aria-labelledby="stopwatch-dialog-title"
        aria-describedby="stopwatch-dialog-description"
        fullWidth
      >
        <DialogTitle id="stopwatch-dialog-title">Modifier la durée</DialogTitle>
        <DialogContent
          sx={{
            width: "100%",
          }}
        >
          <Box
            sx={{
              maxHeight: "70vh",
              width: "100%",
            }}
          >
            <Stack
              direction={"row"}
              spacing={2}
              justifyContent={"center"}
              alignItems={"center"}
              sx={{
                marginTop: 2,
                marginBottom: 2,
                width: "100%",
              }}
            >
              <TextField
                variant={textFieldVariant}
                type="number"
                select
                label="Heures"
                name="hours"
                placeholder="00"
                value={hours}
                onChange={handleInputChange}
                sx={{
                  ...textfieldStyle,
                }}
                SelectProps={{
                  sx: {
                    ...selectStyle,
                  },
                }}
                InputProps={{
                  // endAdornment: (
                  //   <InputAdornment position="end">h</InputAdornment>
                  // ),
                  onFocus: (event) => {
                    if (inputsAreReadOnly) {
                      event.target.blur();
                    } else {
                      // event.target.select();
                    }
                  },
                  readOnly: inputsAreReadOnly,
                  "aria-valuemin": 0,
                  "aria-colcount": 2,
                  sx: {
                    ...inputStyle,
                  },
                }}
              >
                {Array.from(Array(100).keys()).map((value) => {
                  return (
                    <MenuItem key={`${value}-hours`} value={value}>
                      {value}
                    </MenuItem>
                  );
                })}
              </TextField>
              <TextField
                variant={textFieldVariant}
                type="number"
                name="minutes"
                placeholder="00"
                select
                label="Minutes"
                value={minutes}
                sx={{
                  ...textfieldStyle,
                }}
                onChange={handleInputChange}
                SelectProps={{
                  sx: {
                    ...selectStyle,
                  },
                }}
                InputProps={{
                  // endAdornment: (
                  //   <InputAdornment position="end">min</InputAdornment>
                  // ),
                  onFocus: (event) => {
                    if (inputsAreReadOnly) {
                      event.target.blur();
                    } else {
                      // event.target.select();
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
              >
                {Array.from(Array(60).keys()).map((value) => {
                  return (
                    <MenuItem key={`${value}-minutes`} value={value}>
                      {value}
                    </MenuItem>
                  );
                })}
              </TextField>
              <TextField
                select
                variant={textFieldVariant}
                type="number"
                name="seconds"
                label="Secondes"
                placeholder="00"
                sx={{
                  ...textfieldStyle,
                }}
                value={seconds}
                onChange={handleInputChange}
                SelectProps={{
                  sx: {
                    ...selectStyle,
                  },
                }}
                InputProps={{
                  // endAdornment: (
                  //   <InputAdornment position="end">s</InputAdornment>
                  // ),
                  onFocus: (event) => {
                    if (inputsAreReadOnly) {
                      event.target.blur();
                    } else {
                      // event.target.select();
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
              >
                {Array.from(Array(60).keys()).map((value) => {
                  return (
                    <MenuItem key={`${value}-seconds`} value={value}>
                      {value}
                    </MenuItem>
                  );
                })}
              </TextField>
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              onChange({
                time: drawerTime,
                isRunning: false,
                isStartStop: false,
                lastUpdateTime: Date.now(),
              });
              setDrawerIsOpen(false);
            }}
          >
            Annuler
          </Button>
          <Button onClick={() => setDrawerIsOpen(false)} variant="contained">
            Sauvegarder
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
