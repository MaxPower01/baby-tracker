import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Button, Stack, SxProps, Typography } from "@mui/material";
import { useEffect, useMemo } from "react";

type Props = {
  timeInSeconds: number;
  setTimeInSeconds: React.Dispatch<React.SetStateAction<number>>;
  isRunning: boolean;
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
  isDisabled?: boolean;
  label?: string;
  sx?: SxProps | undefined;
};

export default function Stopwatch(props: Props) {
  const timeLabel = useMemo(() => {
    if (props.timeInSeconds === 0) {
      return "00:00";
    }
    const minutes = Math.floor(props.timeInSeconds / 60);
    let minutesLabel = minutes.toString();
    if (minutes < 10) {
      minutesLabel = `0${minutesLabel}`;
    }
    const seconds = props.timeInSeconds % 60;
    let secondsLabel = seconds.toString();
    if (seconds < 10) {
      secondsLabel = `0${secondsLabel}`;
    }
    return `${minutesLabel}:${secondsLabel}`;
  }, [props.timeInSeconds]);

  useEffect(() => {
    let intervalId: NodeJS.Timer;
    if (props.isRunning) {
      intervalId = setInterval(() => {
        props.setTimeInSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [props.isRunning]);

  const handleClick = () => {
    if (props.isDisabled) {
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
      <Button
        onClick={handleClick}
        disabled={props.isDisabled}
        sx={{
          borderRadius: "9999px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          paddingLeft: 4,
          paddingRight: 4,
          paddingTop: 1,
          paddingBottom: 1,
        }}
        variant={props.isRunning ? "contained" : "outlined"}
      >
        <Typography textAlign="center" variant="h6">
          {timeLabel}
        </Typography>
        {props.isRunning ? (
          <PauseIcon
            sx={{
              fontSize: "2em",
            }}
          />
        ) : (
          <PlayArrowIcon
            sx={{
              fontSize: "2em",
            }}
          />
        )}
      </Button>
      {props.label && (
        <Typography textAlign="center" variant="h6">
          {props.label}
        </Typography>
      )}
    </Stack>
  );
}
