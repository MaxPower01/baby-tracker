import { Box, Stack, Typography, useTheme } from "@mui/material";

import ActivityIcon from "@/pages/Activities/components/ActivityIcon";
import { Entry } from "@/pages/Entry/types/Entry";
import EntryModel from "@/pages/Entry/models/EntryModel";
import { entryTypeHasPoop } from "@/pages/Entry/utils/entryTypeHasPoop";
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

// function EntryHeaderSubtitle(props: Props) {
//   const theme = useTheme();
//   const hasPoop = entryTypeHasPoop(props.entry.entryType);
//   const hasUrine
//   if (entryTypeHasPoop(props.entry.entryType)) {
//   return (
//     <Typography
//       variant={"body2"}
//       fontWeight={400}
//       sx={{
//         color: props.textColor,
//         opacity: theme.opacity.secondary,
//       }}
//     >
//       {subtitle}
//     </Typography>
//   );

// }

export function EntryHeader(props: Props) {
  const theme = useTheme();
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
  let caption = startDate.toLocaleTimeString("fr-CA", {
    hour: "2-digit",
    minute: "2-digit",
  });
  if (props.entry.startTimestamp !== props.entry.endTimestamp) {
    if (
      props.entry.leftStopwatchIsRunning ||
      props.entry.rightStopwatchIsRunning
    ) {
      caption += " - en cours";
    } else {
      const isDifferentDay = startDate.getDate() !== endDate.getDate();
      const isDifferentMonth = startDate.getMonth() !== endDate.getMonth();
      const isDifferentYear = startDate.getFullYear() !== endDate.getFullYear();
      caption += ` – ${endDate.toLocaleTimeString("fr-CA", {
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
            opacity: theme.opacity.tertiary,
            color: props.textColor,
          }}
        >
          {caption}
        </Typography>
        <Typography
          variant={"body1"}
          fontWeight={600}
          sx={{
            color: props.textColor,
            opacity: theme.opacity.primary,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant={"body2"}
          fontWeight={400}
          sx={{
            color: props.textColor,
            opacity: theme.opacity.secondary,
          }}
        >
          {title}
        </Typography>
      </Stack>
    </Stack>
  );
}
