import { Box, Stack, Typography } from "@mui/material";

import ActivityIcon from "@/modules/activities/components/ActivityIcon";
import EntryModel from "@/modules/entries/models/EntryModel";
import { useMemo } from "react";

type Props = {
  entry: EntryModel;
  hideIcon?: boolean;
  textColor?: string;
  useCompactMode?: boolean;
};

export default function EntryHeader(props: Props) {
  const { entry } = props;
  if (!entry) return null;
  const {
    time,
    leftTime,
    rightTime,
    note,
    startDate,
    activity,
    volume,
    leftVolume,
    rightVolume,
  } = entry;
  if (!props.entry) return null;
  const title = useMemo(() => {
    let result = activity?.name ?? "";
    if (activity?.hasSides) {
      if (time || volume) {
        const bothVolumes = leftVolume && rightVolume;
        const onlyLeftVolume = !bothVolumes && leftVolume;
        const onlyRightVolume = !bothVolumes && rightVolume;
        const bothTimes = leftTime && rightTime;
        const onlyLeftTime = !bothTimes && leftTime;
        const onlyRightTime = !bothTimes && rightTime;
        const shouldRenderLeftSideSuffix =
          !bothVolumes && !bothTimes && (onlyLeftTime || onlyLeftVolume);
        const shouldRenderRightSideSuffix =
          !bothVolumes && !bothTimes && (onlyRightTime || onlyRightVolume);
        if (shouldRenderLeftSideSuffix) {
          result += ` (G)`;
        } else if (shouldRenderRightSideSuffix) {
          result += ` (D)`;
        }
      }
    }
    return result;
  }, [activity, leftTime, rightTime, time]);
  const subtitle = useMemo(() => {
    let result = entry.startDate.toLocaleTimeString("fr-CA", {
      hour: "2-digit",
      minute: "2-digit",
    });
    if (entry.startDate.getTime() == entry.endDate.getTime()) {
      return result;
    }
    if (entry.anyStopwatchIsRunning) {
      result += " – en cours";
    } else {
      const isDifferentDay =
        entry.startDate.getDate() !== entry.endDate.getDate();
      const isDifferentMonth =
        entry.startDate.getMonth() !== entry.endDate.getMonth();
      const isDifferentYear =
        entry.startDate.getFullYear() !== entry.endDate.getFullYear();
      result += ` – ${entry.endDate.toLocaleTimeString("fr-CA", {
        minute: "2-digit",
        hour: "2-digit",
        day: isDifferentDay || isDifferentMonth ? "numeric" : undefined,
        month: isDifferentDay || isDifferentMonth ? "long" : undefined,
        year: isDifferentYear ? "numeric" : undefined,
      })}`;
    }
    return result;
  }, [entry]);
  return (
    <Stack direction={"row"} spacing={2} alignItems={"center"}>
      {!props.hideIcon && entry.activity != null && (
        <Box
          sx={{
            fontSize: "80%",
          }}
        >
          <ActivityIcon activity={entry.activity} />
        </Box>
      )}
      <Stack spacing={props.useCompactMode ? 0.25 : 0}>
        <Typography
          variant={props.useCompactMode ? "caption" : "body2"}
          sx={{
            lineHeight: 1,
            opacity: 0.6,
            color: props.textColor,
          }}
        >
          {subtitle}
        </Typography>
        <Typography
          variant={props.useCompactMode ? "body1" : "h6"}
          fontWeight={props.useCompactMode ? 600 : "bold"}
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
