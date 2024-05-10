import { Box, Stack, Typography, useTheme } from "@mui/material";

import ActivityIcon from "@/pages/Activities/components/ActivityIcon";
import { Entry } from "@/pages/Entry/types/Entry";
import EntryModel from "@/pages/Entry/models/EntryModel";
import { EntrySubtitle } from "@/pages/Entry/components/EntrySubtitle";
import { entryTypeHasSides } from "@/pages/Entry/utils/entryTypeHasSides";
import { entryTypeHasStopwatch } from "@/pages/Entry/utils/entryTypeHasStopwatch";
import { entryTypeHasVolume } from "@/pages/Entry/utils/entryTypeHasVolume";
import { getActivityName } from "@/utils/getActivityName";
import { getDateFromTimestamp } from "@/utils/getDateFromTimestamp";
import { getEntryTitle } from "@/utils/getEntryTitle";
import { getEntryTypeName } from "@/utils/getEntryTypeName";
import { useMemo } from "react";
import { useSelector } from "react-redux";

type Props = {
  entry: Entry;
  hideIcon?: boolean;
  textColor?: string;
};

export function EntryHeader(props: Props) {
  const theme = useTheme();
  const title = getEntryTitle(props.entry);
  const startTimestamp = useMemo(() => {
    return props.entry.startTimestamp;
  }, [props.entry.startTimestamp]);
  const endTimestamp = useMemo(() => {
    return entryTypeHasStopwatch(props.entry.entryTypeId)
      ? props.entry.endTimestamp
      : props.entry.startTimestamp;
  }, [
    props.entry.endTimestamp,
    props.entry.startTimestamp,
    props.entry.entryTypeId,
  ]);
  const startDate = getDateFromTimestamp(startTimestamp);
  const endDate = getDateFromTimestamp(endTimestamp);
  let caption = startDate.toLocaleTimeString("fr-CA", {
    hour: "2-digit",
    minute: "2-digit",
  });
  if (startTimestamp !== endTimestamp) {
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
          <ActivityIcon type={props.entry.entryTypeId} />
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
        <EntrySubtitle entry={props.entry} textColor={props.textColor} />
      </Stack>
    </Stack>
  );
}
