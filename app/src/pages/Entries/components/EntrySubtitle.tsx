import React, { useEffect, useMemo } from "react";
import { Stack, Typography, useTheme } from "@mui/material";

import ActivityIcon from "@/pages/Activities/components/ActivityIcon";
import { Entry } from "@/pages/Entry/types/Entry";
import { EntryType } from "@/pages/Entries/enums/EntryType";
import { entryHasStopwatchRunning } from "@/pages/Entry/utils/entryHasStopwatchRunning";
import { entryTypeCanHaveMultipleContexts } from "@/pages/Entry/utils/entryTypeCanHaveMultipleContexts";
import { entryTypeHasContextSelector } from "@/pages/Entry/utils/entryTypeHasContextSelector";
import { entryTypeHasPoop } from "@/pages/Entry/utils/entryTypeHasPoop";
import { entryTypeHasSize } from "@/pages/Entry/utils/entryTypeHasSize";
import { entryTypeHasStopwatch } from "@/pages/Entry/utils/entryTypeHasStopwatch";
import { entryTypeHasUrine } from "@/pages/Entry/utils/entryTypeHasUrine";
import { entryTypeHasVolume } from "@/pages/Entry/utils/entryTypeHasVolume";
import { entryTypeHasWeight } from "@/pages/Entry/utils/entryTypeHasWeight";
import { formatSize } from "@/utils/formatSize";
import formatStopwatchTime from "@/utils/formatStopwatchTime";
import { formatVolume } from "@/utils/formatVolume";
import { formatWeight } from "@/utils/formatWeight";
import { getEntryTime } from "@/pages/Entry/utils/getEntryTime";
import { isNullOrWhiteSpace } from "@/utils/utils";

type Props = {
  entry: Entry;
  textColor?: string;
};

export function EntrySubtitle(props: Props) {
  const theme = useTheme();
  const [leftTime, setLeftTime] = React.useState(
    getEntryTime(props.entry, "left", true)
  );
  const [rightTime, setRightTime] = React.useState(
    getEntryTime(props.entry, "right", true)
  );
  const totalTime = useMemo(() => leftTime + rightTime, [leftTime, rightTime]);
  const hasStopwatch = entryTypeHasStopwatch(props.entry.entryType);
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (hasStopwatch && entryHasStopwatchRunning(props.entry)) {
      intervalId = setInterval(() => {
        setLeftTime(getEntryTime(props.entry, "left", true));
        setRightTime(getEntryTime(props.entry, "right", true));
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [props.entry, hasStopwatch]);
  const hasPoop =
    entryTypeHasPoop(props.entry.entryType) &&
    (props.entry.poopAmount ?? 0) > 0;
  const hasUrine =
    entryTypeHasUrine(props.entry.entryType) &&
    (props.entry.urineAmount ?? 0) > 0;
  if (hasPoop || hasUrine) {
    const poopArray = Array.from(
      { length: props.entry.poopAmount ?? 0 },
      (_, i) => i
    );
    const urineArray = Array.from(
      { length: props.entry.urineAmount ?? 0 },
      (_, i) => i
    );
    return (
      <Stack direction={"row"} spacing={1}>
        {urineArray.length > 0 && (
          <Stack direction={"row"}>
            {urineArray.map((_, index) => (
              <ActivityIcon
                key={index}
                type={EntryType.Urine}
                sx={{
                  fontSize: theme.typography.body1.fontSize,
                  opacity: theme.opacity.secondary,
                }}
              />
            ))}
          </Stack>
        )}
        {poopArray.length > 0 && (
          <Stack direction={"row"}>
            {poopArray.map((_, index) => (
              <ActivityIcon
                key={index}
                type={EntryType.Poop}
                sx={{
                  fontSize: theme.typography.body1.fontSize,
                  opacity: theme.opacity.secondary,
                }}
              />
            ))}
          </Stack>
        )}
      </Stack>
    );
  }
  let subtitle = "";
  const hasContext =
    entryTypeHasContextSelector(props.entry.entryType) &&
    props.entry.activityContexts.length > 0;
  const canHaveMultipleContexts =
    hasContext && entryTypeCanHaveMultipleContexts(props.entry.entryType);
  if (hasContext) {
    const contextsLabel = props.entry.activityContexts
      .map((context) => context.name)
      .join(" • ");
    subtitle = contextsLabel;
  }
  let volumeDisplayed = false;
  const hasVolume = entryTypeHasVolume(props.entry.entryType);
  const totalVolume = hasVolume
    ? (props.entry.leftVolume ?? 0) + (props.entry.rightVolume ?? 0)
    : 0;
  if (totalVolume > 0) {
    if (!isNullOrWhiteSpace(subtitle)) {
      subtitle += " • ";
    }
    subtitle += `${formatVolume(totalVolume)} ml`;
    volumeDisplayed = true;
  }
  let timeDisplayed = false;
  if (!volumeDisplayed) {
    if (hasStopwatch) {
      if (totalTime > 0) {
        if (!isNullOrWhiteSpace(subtitle)) {
          subtitle += " • ";
        }
        subtitle += formatStopwatchTime(totalTime);
        timeDisplayed = true;
      }
    }
  }
  let weightDisplayed = false;
  const hasWeight =
    entryTypeHasWeight(props.entry.entryType) && (props.entry.weight ?? 0) > 0;
  if (hasWeight) {
    const weight = props.entry.weight ?? 0;
    if (weight > 0) {
      if (!isNullOrWhiteSpace(subtitle)) {
        subtitle += " • ";
      }
      subtitle += `${formatWeight(weight)} kg`;
      weightDisplayed = true;
    }
  }
  let sizeDisplayed = false;
  const hasSize =
    entryTypeHasSize(props.entry.entryType) && (props.entry.size ?? 0) > 0;
  if (hasSize) {
    const size = props.entry.size ?? 0;
    if (size > 0) {
      if (!isNullOrWhiteSpace(subtitle)) {
        subtitle += " • ";
      }
      subtitle += `${formatSize(size)} cm`;
      sizeDisplayed = true;
    }
  }

  return (
    <Typography
      variant={"body2"}
      fontWeight={400}
      sx={{
        color: props.textColor,
        opacity: theme.opacity.secondary,
      }}
    >
      {subtitle}
    </Typography>
  );
}
