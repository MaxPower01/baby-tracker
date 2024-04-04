import { Button, Typography, useTheme } from "@mui/material";
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
    <StopwatchButton
      time={props.time}
      isRunning={props.isRunning}
      size={props.size}
      label={props.label}
      handleClick={handleButtonClick}
      type="play/pause"
      hideTimeLabel={props.hideTimeLabel}
    />
  );
}
