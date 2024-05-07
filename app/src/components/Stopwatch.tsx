import { Button, Stack, Typography, useTheme } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { StopwatchButton } from "@/components/StopwatchButton";
import formatStopwatchTime from "@/utils/formatStopwatchTime";
import { isNullOrWhiteSpace } from "@/utils/utils";

type Props = {
  size: "big" | "small";
  label?: string;
  hideTimeLabel?: boolean;
  time: number;
  showTitle?: boolean;
  setTime: React.Dispatch<React.SetStateAction<number>>;
  isRunning: boolean;
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
  lastUpdateTime: number | null;
  setLastUpdateTime: React.Dispatch<React.SetStateAction<number | null>>;
  onPlayPause?: (
    time: number,
    isRunning: boolean,
    lastUpdateTime: number | null
  ) => void;
};

export function Stopwatch(props: Props) {
  const theme = useTheme();
  const timeLabel = formatStopwatchTime(props.time);
  const title = timeLabel;
  // const title =
  //   props.label && !isNullOrWhiteSpace(props.label)
  //     ? `${timeLabel} (${props.label[0].toUpperCase()})`
  //     : timeLabel;
  const handleButtonClick = () => {
    const newTime = !props.isRunning && props.time == 0 ? 1000 : props.time;
    const newIsRunning = !props.isRunning;
    const newLastUpdateTime = Date.now();
    props.setTime(newTime);
    props.setLastUpdateTime(newLastUpdateTime);
    props.setIsRunning(newIsRunning);
    if (props.onPlayPause) {
      props.onPlayPause(newTime, newIsRunning, newLastUpdateTime);
    }
  };

  return (
    <Stack
      direction="column"
      spacing={0.5}
      justifyContent={"center"}
      alignItems={"center"}
    >
      {props.showTitle && (
        <Typography
          variant={props.size === "big" ? "h4" : "body2"}
          color={
            props.size === "big"
              ? theme.customPalette.text.primary
              : theme.palette.primary.main
          }
          fontWeight={props.size === "big" ? undefined : 600}
          textAlign={"center"}
        >
          {title}
        </Typography>
      )}
      <StopwatchButton
        time={props.time}
        isRunning={props.isRunning}
        size={props.size}
        label={props.label}
        handleClick={handleButtonClick}
        type="play/pause"
        hideTimeLabel={props.hideTimeLabel}
      />
    </Stack>
  );
}
