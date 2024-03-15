import { Button, Typography, useTheme } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import formatStopwatchTime from "@/utils/formatStopwatchTime";
import { isNullOrWhiteSpace } from "@/utils/utils";

// import RestartAltIcon from "@mui/icons-material/RestartAlt";
type StopwatchButtonProps = {
  size: "big" | "small";
  label?: string;
  time: number;
  setTime: React.Dispatch<React.SetStateAction<number>>;
  isRunning: boolean;
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
  lastUpdateTime: number | null;
  setLastUpdateTime: React.Dispatch<React.SetStateAction<number | null>>;
};

export function StopwatchButton(props: StopwatchButtonProps) {
  const theme = useTheme();
  const basePadding = props.size === "big" ? 8 : 4;
  const paddingTop = props.size === "big" ? basePadding : 0;
  const paddingBottom = props.size === "big" ? basePadding : 0;
  const paddingLeft = basePadding;
  const paddingRight = basePadding;
  const iconFontSize = props.size === "big" ? "5em" : "2em";
  const initialWidth = props.size === "big" ? "10em" : "2em";
  const aspectRatio = props.size === "big" ? "1/1" : undefined;
  const borderRadius = props.size === "big" ? "50%" : undefined;

  const timeLabel = formatStopwatchTime(props.time);

  const onChange = (params: {
    time: number;
    isRunning: boolean;
    lastUpdateTime: number | null;
    isStartStop: boolean;
  }) => {
    props.setTime(params.time);
    props.setIsRunning(params.isRunning);
    props.setLastUpdateTime(params.lastUpdateTime);
  };

  const handleStartStop = () => {
    onChange({
      time: !props.isRunning && props.time == 0 ? 1000 : props.time,
      isRunning: !props.isRunning,
      lastUpdateTime: Date.now(),
      isStartStop: true,
    });
  };

  return (
    <Button
      color="primary"
      variant={props.isRunning ? "contained" : "outlined"}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        width: `calc(${initialWidth} + ${basePadding * 2}px)`,
        height: "auto",
        aspectRatio: aspectRatio,
        borderRadius: borderRadius,
        padding: `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`,
        minWidth: "0",
      }}
      onClick={handleStartStop}
    >
      {props.size === "big" && (
        <>
          {props.label && !isNullOrWhiteSpace(props.label) && (
            <Typography
              variant="body2"
              textAlign={"center"}
              sx={{
                opacity: theme.opacity.secondary,
              }}
            >
              {props.label}
            </Typography>
          )}
          {timeLabel && !isNullOrWhiteSpace(timeLabel) && (
            <Typography
              variant="body1"
              textAlign={"center"}
              sx={{
                fontWeight: "bold",
              }}
            >
              {timeLabel}
            </Typography>
          )}
        </>
      )}

      {props.isRunning ? (
        <StopIcon sx={{ fontSize: iconFontSize }} />
      ) : (
        <PlayArrowIcon sx={{ fontSize: iconFontSize }} />
      )}
    </Button>
  );
}
