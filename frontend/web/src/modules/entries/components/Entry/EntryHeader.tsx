import { Box, Stack, Typography } from "@mui/material";
import { useMemo } from "react";
import ActivityIcon from "../../../activities/components/ActivityIcon";
import { EntryModel } from "../../models/EntryModel";

type Props = {
  entry: EntryModel;
  hideIcon?: boolean;
};

export default function EntryHeader(props: Props) {
  const { entry } = props;
  if (!entry) return null;
  const { time, leftTime, rightTime, note, startDate, activity } = entry;
  const { hasSides } = activity;
  if (!props.entry) return null;
  const title = useMemo(() => {
    let result = `${activity.name}`;
    if (time && hasSides) {
      if (leftTime && !rightTime) {
        result += ` (G)`;
      } else if (!leftTime && rightTime) {
        result += ` (D)`;
      }
    }
    return result;
  }, [activity, hasSides, leftTime, rightTime, time]);
  const subtitle = useMemo(() => {
    let result = startDate.toDate().toLocaleTimeString("fr-CA", {
      hour: "2-digit",
      minute: "2-digit",
    });
    if (time != null) {
      const endDate = startDate.clone().add(time, "seconds");
      result += ` à ${endDate.toDate().toLocaleTimeString("fr-CA", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }
    return result;
  }, []);
  return (
    <Stack direction={"row"} spacing={2} alignItems={"center"}>
      {!props.hideIcon && (
        <Box
          sx={{
            fontSize: "80%",
          }}
        >
          <ActivityIcon activity={activity} />
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
