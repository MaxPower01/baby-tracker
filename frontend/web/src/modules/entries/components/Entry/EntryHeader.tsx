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
  }, []);
  return (
    <Stack direction={"row"} spacing={2} alignItems={"center"}>
      {!props.hideIcon && (
        <Box
          sx={{
            fontSize: "80%",
          }}
        >
          <ActivityIcon activity={props.entry.activity} />
        </Box>
      )}
      <Stack>
        <Typography variant="h6" fontWeight={"bold"}>
          {title}
        </Typography>
        <Typography variant="subtitle1">
          {props.entry.startDate.toDate().toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Typography>
      </Stack>
    </Stack>
  );
}
