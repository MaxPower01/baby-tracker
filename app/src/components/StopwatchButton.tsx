import { Button, Typography, useTheme } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import formatStopwatchTime from "@/utils/formatStopwatchTime";
import { isNullOrWhiteSpace } from "@/utils/utils";

type Props = {
  size: "big" | "small";
  type: "play/pause" | "stop";
  label?: string;
  time: number;
  isRunning: boolean;
  hideTimeLabel?: boolean;
  handleClick: () => void;
};

export function StopwatchButton(props: Props) {
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
      onClick={props.handleClick}
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
          {timeLabel &&
            !isNullOrWhiteSpace(timeLabel) &&
            !props.hideTimeLabel && (
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

      {props.type === "play/pause" ? (
        props.isRunning ? (
          <PauseIcon sx={{ fontSize: iconFontSize }} />
        ) : (
          <PlayArrowIcon sx={{ fontSize: iconFontSize }} />
        )
      ) : (
        <StopIcon sx={{ fontSize: iconFontSize }} />
      )}
    </Button>
  );
}
