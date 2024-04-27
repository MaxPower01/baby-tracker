import React, { useEffect, useMemo } from "react";
import { Stack, SxProps, Typography, useTheme } from "@mui/material";

import { ActivityContext } from "@/pages/Activity/types/ActivityContext";
import ActivityIcon from "@/pages/Activities/components/ActivityIcon";
import { Entry } from "@/pages/Entry/types/Entry";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
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
import { getPoopColor } from "@/utils/getPoopColor";
import { isNullOrWhiteSpace } from "@/utils/utils";
import { selectActivityContexts } from "@/state/slices/activitiesSlice";
import { useSelector } from "react-redux";

type Props = {
  entry: Entry;
  textColor?: string;
  sx?: SxProps;
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
  const hasStopwatch = entryTypeHasStopwatch(props.entry.entryTypeId);
  const activityContexts = useSelector(selectActivityContexts);
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
    entryTypeHasPoop(props.entry.entryTypeId) &&
    (props.entry.poopAmount ?? 0) > 0;
  const hasUrine =
    entryTypeHasUrine(props.entry.entryTypeId) &&
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
    const poopColor = getPoopColor(props.entry.poopColorId);
    const poopColorId = poopColor?.id ?? "";
    return (
      <Stack
        direction={"row"}
        // justifyContent={"center"}
        alignItems={"center"}
        flexWrap={"wrap"}
        sx={{
          ...props.sx,
        }}
      >
        {urineArray.length > 0 && (
          <Stack direction={"row"}>
            {urineArray.map((_, index) => (
              <ActivityIcon
                key={index}
                type={EntryTypeId.Urine}
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
                type={EntryTypeId.Poop}
                color={poopColorId}
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
    entryTypeHasContextSelector(props.entry.entryTypeId) &&
    props.entry.activityContexts.length > 0;
  if (hasContext && activityContexts.length > 0) {
    const activityContextsOfEntry = props.entry.activityContexts
      .map((context) => activityContexts.find((c) => c.id === context.id))
      .filter((context) => context != null) as ActivityContext[];
    if (activityContextsOfEntry.length > 0) {
      const contextsLabel = activityContextsOfEntry
        .map((context) => context.name)
        .join(" • ");
      subtitle = contextsLabel;
    }
  }
  let volumeDisplayed = false;
  const hasVolume = entryTypeHasVolume(props.entry.entryTypeId);
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
  // if (!volumeDisplayed) {
  if (hasStopwatch) {
    if (totalTime > 0) {
      if (!isNullOrWhiteSpace(subtitle)) {
        subtitle += " • ";
      }
      subtitle += formatStopwatchTime(totalTime);
      timeDisplayed = true;
    }
  }
  // }
  let weightDisplayed = false;
  const hasWeight =
    entryTypeHasWeight(props.entry.entryTypeId) &&
    (props.entry.weight ?? 0) > 0;
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
    entryTypeHasSize(props.entry.entryTypeId) && (props.entry.size ?? 0) > 0;
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

  if (isNullOrWhiteSpace(subtitle)) {
    return null;
  }

  return (
    <Typography
      variant={"body2"}
      fontWeight={400}
      sx={{
        color: props.textColor,
        opacity: theme.opacity.secondary,
        ...props.sx,
      }}
    >
      {subtitle}
    </Typography>
  );
}
