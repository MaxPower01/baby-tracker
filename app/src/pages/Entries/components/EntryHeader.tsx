import { Box, Stack, Typography } from "@mui/material";

import ActivityIcon from "@/pages/Activities/components/ActivityIcon";
import { Entry } from "@/pages/Entry/types/Entry";
import EntryModel from "@/pages/Entry/models/EntryModel";
import { entryTypeHasSides } from "@/pages/Entry/utils/entryTypeHasSides";
import { entryTypeHasStopwatch } from "@/pages/Entry/utils/entryTypeHasStopwatch";
import { entryTypeHasVolume } from "@/pages/Entry/utils/entryTypeHasVolume";
import { getActivityName } from "@/utils/getActivityName";
import { getDateFromTimestamp } from "@/utils/getDateFromTimestamp";
import { useMemo } from "react";
import { useSelector } from "react-redux";

type Props = {
  entry: Entry;
  hideIcon?: boolean;
  textColor?: string;
};

export default function EntryHeader(props: Props) {
  let title = getActivityName(props.entry.entryType);
  let titleSuffix: "left" | "right" | null = null;
  if (entryTypeHasSides(props.entry.entryType)) {
    if (entryTypeHasVolume(props.entry.entryType)) {
      const hasLeftVolume = props.entry.leftVolume != null;
      const hasRightVolume = props.entry.rightVolume != null;
      const hasBothVolume = hasLeftVolume && hasRightVolume;
      if (!hasBothVolume) {
        titleSuffix = hasLeftVolume ? "left" : "right";
      }
    } else if (entryTypeHasStopwatch(props.entry.entryType)) {
      const hasLeftTime = props.entry.leftTime != null;
      const hasRightTime = props.entry.rightTime != null;
      const hasBothTime = hasLeftTime && hasRightTime;
      if (!hasBothTime) {
        titleSuffix = hasLeftTime ? "left" : "right";
      }
    }
  }
  if (titleSuffix != null) {
    title += ` (${titleSuffix === "left" ? "G" : "D"})`;
  }
  const startDate = getDateFromTimestamp(props.entry.startTimestamp);
  const endDate = getDateFromTimestamp(props.entry.endTimestamp);
  let subtitle = startDate.toLocaleTimeString("fr-CA", {
    hour: "2-digit",
    minute: "2-digit",
  });
  if (props.entry.startTimestamp !== props.entry.endTimestamp) {
    if (
      props.entry.leftStopwatchIsRunning ||
      props.entry.rightStopwatchIsRunning
    ) {
      subtitle += " - en cours";
    } else {
      const isDifferentDay = startDate.getDate() !== endDate.getDate();
      const isDifferentMonth = startDate.getMonth() !== endDate.getMonth();
      const isDifferentYear = startDate.getFullYear() !== endDate.getFullYear();
      subtitle += ` – ${endDate.toLocaleTimeString("fr-CA", {
        minute: "2-digit",
        hour: "2-digit",
        day: isDifferentDay || isDifferentMonth ? "numeric" : undefined,
        month: isDifferentDay || isDifferentMonth ? "long" : undefined,
        year: isDifferentYear ? "numeric" : undefined,
      })}`;
    }
  }
  return (
    <Stack direction={"row"} spacing={2} alignItems={"center"}>
      {!props.hideIcon && (
        <Box
          sx={{
            fontSize: "80%",
          }}
        >
          <ActivityIcon type={props.entry.entryType} />
        </Box>
      )}
      <Stack spacing={0.25}>
        <Typography
          variant={"caption"}
          sx={{
            lineHeight: 1,
            opacity: 0.6,
            color: props.textColor,
          }}
        >
          {subtitle}
        </Typography>
        <Typography
          variant={"body1"}
          fontWeight={600}
          sx={{
            color: props.textColor,
          }}
        >
          {title}
        </Typography>
      </Stack>
    </Stack>
  );
}
