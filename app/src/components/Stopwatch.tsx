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
  time: number;
  setTime: React.Dispatch<React.SetStateAction<number>>;
  isRunning: boolean;
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
  lastUpdateTime: number | null;
  setLastUpdateTime: React.Dispatch<React.SetStateAction<number | null>>;
};

export function Stopwatch(props: Props) {
  const handleButtonClick = () => {
    props.setTime(!props.isRunning && props.time == 0 ? 1000 : props.time);
    props.setIsRunning(!props.isRunning);
    props.setLastUpdateTime(Date.now());
  };

  return (
    <StopwatchButton
      time={props.time}
      isRunning={props.isRunning}
      size={props.size}
      label={props.label}
      handleClick={handleButtonClick}
      type="play/pause"
    />
  );
}
