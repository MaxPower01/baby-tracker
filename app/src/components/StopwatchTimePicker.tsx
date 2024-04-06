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
  TextField,
} from "@mui/material";
import React, { useCallback, useMemo, useState } from "react";

import formatStopwatchTime from "@/utils/formatStopwatchTime";

type Props = {
  time: number;
  setTime: (time: number) => void;
};

export function StopwatchTimePicker(props: Props) {
  const initialSeconds = props.time / 1000;
  const initialMinutes = Math.floor(initialSeconds / 60);
  const initialHours = Math.floor(initialMinutes / 60);
  const [seconds, setSeconds] = useState(initialSeconds);
  const [minutes, setMinutes] = useState(initialMinutes);
  const [hours, setHours] = useState(initialHours);
  const initialTimeLabel = formatStopwatchTime(props.time);
  const newTimeLabel = useMemo(
    () =>
      formatStopwatchTime(hours * 3600000 + minutes * 60000 + seconds * 1000),
    [hours, minutes, seconds]
  );
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const handleDialogClose = useCallback(
    (confirmed: boolean) => {
      setDialogIsOpen(false);
      if (confirmed) {
        props.setTime(hours * 3600000 + minutes * 60000 + seconds * 1000);
      }
    },
    [hours, minutes, seconds, props]
  );
  const menuListMaxHeight = 300;
  return (
    <>
      <TextField
        label=""
        name="note"
        type="text"
        placeholder="Durée"
        value={initialTimeLabel}
        onClick={() => {
          setDialogIsOpen(true);
        }}
      />

      <Dialog
        open={dialogIsOpen}
        onClose={handleDialogClose}
        aria-labelledby="stopwatch-time-picker-dialog-title"
        aria-describedby="stopwatch-time-picker-dialog-description"
      >
        <DialogTitle id="stopwatch-time-picker-dialog-title">
          {newTimeLabel}
        </DialogTitle>
        <DialogContent>
          <Stack direction="row" spacing={1}>
            <MenuList
              id="stopwatch-time-picker-menu-hours"
              sx={{
                maxHeight: menuListMaxHeight,
                overflow: "auto",
              }}
            >
              {Array.from(Array(24).keys()).map((hour) => (
                <MenuItem
                  key={hour}
                  onClick={() => {
                    setHours(hour);
                  }}
                  selected={hour === hours}
                >
                  {hour}
                </MenuItem>
              ))}
            </MenuList>
            <MenuList
              id="stopwatch-time-picker-menu-minutes"
              sx={{
                maxHeight: menuListMaxHeight,
                overflow: "auto",
              }}
            >
              {Array.from(Array(60).keys()).map((minute) => (
                <MenuItem
                  key={minute}
                  onClick={() => {
                    setMinutes(minute);
                  }}
                  selected={minute === minutes}
                >
                  {minute}
                </MenuItem>
              ))}
            </MenuList>
            <MenuList
              id="stopwatch-time-picker-menu-seconds"
              sx={{
                maxHeight: menuListMaxHeight,
                overflow: "auto",
              }}
            >
              {Array.from(Array(60).keys()).map((second) => (
                <MenuItem
                  key={second}
                  onClick={() => {
                    setSeconds(second);
                  }}
                  selected={second === seconds}
                >
                  {second}
                </MenuItem>
              ))}
            </MenuList>
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
