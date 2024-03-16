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
  Fab,
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
  styled,
  useTheme,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import { CSSBreakpoint } from "@/enums/CSSBreakpoint";
import CloseIcon from "@mui/icons-material/Close";
import PauseIcon from "@mui/icons-material/Pause";
import { Stopwatch } from "@/components/Stopwatch";
import formatStopwatchTime from "@/utils/formatStopwatchTime";

type Props = {
  size: "big" | "small";
  hasSides?: boolean;
  leftTime: number;
  setLeftTime: React.Dispatch<React.SetStateAction<number>>;
  rightTime: number;
  setRightTime: React.Dispatch<React.SetStateAction<number>>;
  leftIsRunning: boolean;
  setLeftIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
  rightIsRunning: boolean;
  setRightIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
  leftLastUpdateTime: number | null;
  setLeftLastUpdateTime: React.Dispatch<React.SetStateAction<number | null>>;
  rightLastUpdateTime: number | null;
  setRightLastUpdateTime: React.Dispatch<React.SetStateAction<number | null>>;
};

export function StopwatchContainer(props: Props) {
  const time = props.leftTime + props.rightTime;
  const isRunning = props.leftIsRunning || props.rightIsRunning;
  const timeLabel = formatStopwatchTime(time);
  const lastUpdateTime =
    props.leftLastUpdateTime && props.rightLastUpdateTime
      ? Math.max(props.leftLastUpdateTime, props.rightLastUpdateTime)
      : props.leftLastUpdateTime ?? props.rightLastUpdateTime;

  const onLeftChange = (params: {
    time: number;
    isRunning: boolean;
    lastUpdateTime: number | null;
    isStartStop: boolean;
  }) => {
    props.setLeftTime(params.time);
    props.setLeftIsRunning(params.isRunning);
    props.setLeftLastUpdateTime(params.lastUpdateTime);
  };

  const onRightChange = (params: {
    time: number;
    isRunning: boolean;
    lastUpdateTime: number | null;
    isStartStop: boolean;
  }) => {
    props.setRightTime(params.time);
    props.setRightIsRunning(params.isRunning);
    props.setRightLastUpdateTime(params.lastUpdateTime);
  };

  const theme = useTheme();

  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [drawerTime, setDrawerTime] = useState(time);

  // useEffect(() => {
  //   if (isRunning) {
  //     const intervalId = setInterval(() => {
  //       const now = Date.now();
  //       const delta = now - (lastUpdateTime ?? now);
  //       const newTime = time + delta;
  //       onChange({
  //         time: newTime,
  //         isRunning,
  //         lastUpdateTime: now,
  //         isStartStop: false,
  //       });
  //     }, 1000);
  //     return () => clearInterval(intervalId);
  //   }
  // }, [isRunning, lastUpdateTime]);

  useEffect(() => {
    if (props.leftIsRunning || props.rightIsRunning) {
      const intervalId = setInterval(() => {
        const now = Date.now();
        if (props.leftIsRunning) {
          const leftDelta = now - (lastUpdateTime ?? now);
          const newLeftTime = props.leftTime + leftDelta;
          onLeftChange({
            time: newLeftTime,
            isRunning: props.leftIsRunning,
            lastUpdateTime: now,
            isStartStop: false,
          });
        }
        if (props.rightIsRunning) {
          const rightDelta = now - (lastUpdateTime ?? now);
          const newRightTime = props.rightTime + rightDelta;
          onRightChange({
            time: newRightTime,
            isRunning: props.rightIsRunning,
            lastUpdateTime: now,
            isStartStop: false,
          });
        }
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [lastUpdateTime, time]);

  const seconds = useMemo(() => Math.floor((time % 60000) / 1000), [time]);
  const minutes = useMemo(() => Math.floor((time % 3600000) / 60000), [time]);
  const hours = useMemo(() => Math.floor(time / 3600000), [time]);

  // const handleStartStop = () => {
  //   onChange({
  //     time: !isRunning && time == 0 ? 1000 : time,
  //     isRunning: !isRunning,
  //     lastUpdateTime: Date.now(),
  //     isStartStop: true,
  //   });
  // };

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
    // onChange({
    //   time: newSeconds * 1000 + newMinutes * 60000 + newHours * 3600000,
    //   isRunning,
    //   lastUpdateTime: Date.now(),
    //   isStartStop: false,
    // });
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

  return (
    <>
      <Stack
        spacing={1}
        direction={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        sx={{
          width: "100%",
        }}
      >
        <Stack
          sx={{
            width: "100%",
          }}
        >
          {props.size === "big" && (
            <Typography
              variant="body1"
              color={theme.customPalette.text.tertiary}
              textAlign={"center"}
            >
              Durée
            </Typography>
          )}
          <Typography
            variant="h4"
            color={theme.customPalette.text.primary}
            textAlign={"center"}
          >
            {timeLabel}
          </Typography>
        </Stack>

        <Stack
          direction={"row"}
          justifyContent={"space-around"}
          alignItems={"center"}
          spacing={2}
          sx={{
            width: "100%",
          }}
        >
          <Stopwatch
            size={props.size}
            label={props.hasSides ? "Gauche" : undefined}
            time={props.leftTime}
            setTime={props.setLeftTime}
            isRunning={props.leftIsRunning}
            setIsRunning={props.setLeftIsRunning}
            lastUpdateTime={props.leftLastUpdateTime}
            setLastUpdateTime={props.setLeftLastUpdateTime}
            hideTimeLabel={!props.hasSides}
          />

          {props.hasSides && (
            <Stopwatch
              size={props.size}
              label={"Droite"}
              time={props.rightTime}
              setTime={props.setRightTime}
              isRunning={props.rightIsRunning}
              setIsRunning={props.setRightIsRunning}
              lastUpdateTime={props.rightLastUpdateTime}
              setLastUpdateTime={props.setRightLastUpdateTime}
            />
          )}
        </Stack>
      </Stack>

      <Dialog
        open={dialogIsOpen}
        onClose={() => setDialogIsOpen(false)}
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
                  // onFocus: (event) => {
                  // if (inputsAreReadOnly) {
                  //   event.target.blur();
                  // } else {
                  //   // event.target.select();
                  // }
                  // },
                  // readOnly: inputsAreReadOnly,
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
                  // onFocus: (event) => {
                  // if (inputsAreReadOnly) {
                  //   event.target.blur();
                  // } else {
                  //   // event.target.select();
                  // }
                  // },
                  // readOnly: inputsAreReadOnly,
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
                  // onFocus: (event) => {
                  //   if (inputsAreReadOnly) {
                  //     event.target.blur();
                  //   } else {
                  //     // event.target.select();
                  //   }
                  // },
                  // readOnly: inputsAreReadOnly,
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
              // onChange({
              //   time: drawerTime,
              //   isRunning: false,
              //   isStartStop: false,
              //   lastUpdateTime: Date.now(),
              // });
              setDialogIsOpen(false);
            }}
          >
            Annuler
          </Button>
          <Button onClick={() => setDialogIsOpen(false)} variant="contained">
            Sauvegarder
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
