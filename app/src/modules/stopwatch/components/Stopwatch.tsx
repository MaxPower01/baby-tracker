import CSSBreakpoint from "@/common/enums/CSSBreakpoint";
import { formatStopwatchTime, isNullOrWhiteSpace } from "@/lib/utils";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
// import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  SwipeableDrawer,
  SxProps,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";

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
    // transform: "translateX(-0.5em)",
  };

  const textFieldVariant = "standard";

  const inputStyle: SxProps = {
    "& input": {
      textAlign: "center",
      fontSize: "2em",
      fontWeight: "bold",
      // width: "2em",
      // maxWidth: "5em",
      color: theme.palette.primary.main,
    },
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
          spacing={2}
          sx={{
            width: "100%",
          }}
        >
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
          <Stack
            direction={"row"}
            spacing={0}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Button
              id={props.editButtonId}
              variant="outlined"
              onClick={() => {
                setDrawerIsOpen(true);
              }}
              disabled={inputsAreReadOnly}
            >
              <Typography variant="h6">
                {formatStopwatchTime(time, false, true)}
              </Typography>
            </Button>
          </Stack>
        </Stack>
      </Stack>

      <SwipeableDrawer
        anchor="bottom"
        open={drawerIsOpen}
        onOpen={() => {}}
        onClose={() => setDrawerIsOpen(false)}
        disableSwipeToOpen={true}
      >
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            backgroundColor: "inherit",
            backgroundImage: "inherit",
          }}
        >
          <Container maxWidth={CSSBreakpoint.Small} disableGutters>
            <Toolbar>
              <Typography variant="h6">
                Modifier la durée
                {!isNullOrWhiteSpace(props.label) && ` (${props.label})`}
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton onClick={() => setDrawerIsOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Toolbar>
            <Divider
              sx={{
                marginLeft: 2,
                marginRight: 2,
              }}
            />
          </Container>
        </Box>
        <Container maxWidth={CSSBreakpoint.Small}>
          <Box
            sx={{
              maxHeight: "70vh",
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
              }}
            >
              <TextField
                variant={textFieldVariant}
                type="number"
                name="hours"
                placeholder="00"
                value={hours}
                onChange={handleInputChange}
                sx={{
                  ...textfieldStyle,
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">heures</InputAdornment>
                  ),
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
              />
              <TextField
                variant={textFieldVariant}
                type="number"
                name="minutes"
                placeholder="00"
                value={minutes}
                sx={{
                  ...textfieldStyle,
                }}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">minutes</InputAdornment>
                  ),
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
              />
              <TextField
                variant={textFieldVariant}
                type="number"
                name="seconds"
                placeholder="00"
                sx={{
                  ...textfieldStyle,
                }}
                value={seconds}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">secondes</InputAdornment>
                  ),
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
              />
            </Stack>
          </Box>
        </Container>
      </SwipeableDrawer>
    </>
  );
}
