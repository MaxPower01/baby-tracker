import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  MenuItem,
  MenuList,
  Select,
  Stack,
  SxProps,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import formatStopwatchTime from "@/utils/formatStopwatchTime";

type Props = {
  time: number;
  setTime: (time: number) => void;
  sx?: SxProps;
};

export function StopwatchTimePicker(props: Props) {
  const theme = useTheme();
  const propsSeconds = props.time ? Math.floor((props.time % 60000) / 1000) : 0;
  const propsMinutes = props.time
    ? Math.floor((props.time % 3600000) / 60000)
    : 0;
  const propsHours = props.time ? Math.floor(props.time / 3600000) : 0;
  const propsTimeLabel = formatStopwatchTime(props.time);
  const [seconds, setSeconds] = useState(propsSeconds);
  const [minutes, setMinutes] = useState(propsMinutes);
  const [hours, setHours] = useState(propsHours);
  useEffect(() => {
    setSeconds(propsSeconds);
    setMinutes(propsMinutes);
    setHours(propsHours);
  }, [propsSeconds, propsMinutes, propsHours]);
  const timeLabel = useMemo(() => {
    return formatStopwatchTime(
      hours * 3600000 + minutes * 60000 + seconds * 1000
    );
  }, [hours, minutes, seconds]);
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const handleDialogClose = useCallback(
    (confirmed: boolean) => {
      setDialogIsOpen(false);
      if (confirmed) {
        // Call the setTime function with the new time
        props.setTime(hours * 3600000 + minutes * 60000 + seconds * 1000);
      } else {
        // Reset to the initial values
        setHours(propsHours);
        setMinutes(propsMinutes);
        setSeconds(propsSeconds);
      }
    },
    [hours, propsHours, minutes, propsMinutes, seconds, propsSeconds, props]
  );
  const menuListMaxHeight = 200;
  return (
    <>
      <Box
        onClick={() => {
          setDialogIsOpen(true);
        }}
        sx={{
          ...props.sx,
          cursor: "pointer",
        }}
      >
        <Typography>{timeLabel}</Typography>
      </Box>

      <Dialog
        open={dialogIsOpen}
        onClose={() => handleDialogClose(false)}
        aria-labelledby="stopwatch-time-picker-dialog-title"
        aria-describedby="stopwatch-time-picker-dialog-description"
      >
        <DialogTitle id="stopwatch-time-picker-dialog-title">
          {timeLabel}
        </DialogTitle>
        <DialogContent>
          <Stack direction="row" spacing={2}>
            <Stack spacing={1}>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                }}
              >
                Heures
              </Typography>
              <MenuList
                id="stopwatch-time-picker-menu-hours"
                sx={{
                  maxHeight: menuListMaxHeight,
                  overflow: "auto",
                }}
              >
                {Array.from(Array(24).keys()).map((h) => (
                  <MenuItem
                    key={h}
                    onClick={() => {
                      setHours(h);
                    }}
                    selected={h == hours}
                  >
                    {h}
                  </MenuItem>
                ))}
              </MenuList>
            </Stack>

            <Stack spacing={1}>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                }}
              >
                minutes
              </Typography>
              <MenuList
                id="stopwatch-time-picker-menu-minutes"
                sx={{
                  maxHeight: menuListMaxHeight,
                  overflow: "auto",
                }}
              >
                {Array.from(Array(60).keys()).map((m) => (
                  <MenuItem
                    key={m}
                    onClick={() => {
                      setMinutes(m);
                    }}
                    selected={m == minutes}
                  >
                    {m}
                  </MenuItem>
                ))}
              </MenuList>
            </Stack>
            <Stack spacing={1}>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                }}
              >
                secondes
              </Typography>
              <MenuList
                id="stopwatch-time-picker-menu-seconds"
                sx={{
                  maxHeight: menuListMaxHeight,
                  overflow: "auto",
                }}
              >
                {Array.from(Array(60).keys()).map((s) => (
                  <MenuItem
                    key={s}
                    onClick={() => {
                      setSeconds(s);
                    }}
                    selected={s == seconds}
                  >
                    {s}
                  </MenuItem>
                ))}
              </MenuList>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose(false)}>Annuler</Button>
          <Button
            variant="contained"
            // color="error"
            onClick={() => handleDialogClose(true)}
            autoFocus
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
