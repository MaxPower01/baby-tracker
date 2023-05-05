import ActivityIcon from "@/modules/activities/components/ActivityIcon";
import { EntryModel } from "@/modules/entries/models/EntryModel";
import { Box, Stack, Typography } from "@mui/material";
import { useMemo } from "react";

type Props = {
  entry: EntryModel;
  hideIcon?: boolean;
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
    let result = startDate.toDate().toLocaleTimeString("fr-CA", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return result;
  }, [startDate, time]);
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
      <Stack>
        <Typography
          variant="body2"
          sx={{
            lineHeight: 1,
            opacity: 0.6,
          }}
        >
          {subtitle}
        </Typography>
        <Typography variant="h6" fontWeight={"bold"} sx={{}}>
          {title}
        </Typography>
      </Stack>
    </Stack>
  );
}
