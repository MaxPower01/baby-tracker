import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Grid, Stack, SxProps, Typography } from "@mui/material";
import { useMemo } from "react";
import { formatStopwatchTime } from "../../../../lib/utils";
import ActivityChip from "../../../activities/components/ActivityChip";
import { EntryModel } from "../../models/EntryModel";
type Props = {
  entry: EntryModel;
};

export default function EntryBody(props: Props) {
  const { entry } = props;
  if (!entry) return null;
  const {
    time,
    leftTime,
    rightTime,
    note,
    startDate,
    activity,
    subActivities,
  } = entry;
  const { hasSides } = activity;
  const timeLabels: string[] = useMemo(() => {
    let result: string[] = [];
    if (!time) return result;
    if (hasSides) {
      if (leftTime && rightTime) {
        result.push(`${formatStopwatchTime(leftTime)} (G)`);
        result.push(`${formatStopwatchTime(rightTime)} (D)`);
      } else {
        result.push(`${formatStopwatchTime(time)}`);
      }
    } else {
      result.push(`${formatStopwatchTime(time)}`);
    }
    return result;
  }, []);

  const shouldRenderCardContent = useMemo(() => {
    return timeLabels.length > 0 || note || subActivities.length > 0;
  }, [timeLabels, note, subActivities]);

  if (!shouldRenderCardContent) return null;

  const textStyle: SxProps = {
    fontStyle: "italic",
    opacity: 0.8,
  };

  return (
    <Stack spacing={1}>
      {subActivities.length > 0 && (
        <Grid justifyContent="flex-start" gap={1} container>
          {subActivities.map((subActivity) => {
            return (
              <ActivityChip
                key={`${entry.id}-${activity.type}-${subActivity.type}`}
                activity={subActivity}
                size={"small"}
              />
            );
          })}
        </Grid>
      )}
      {timeLabels?.length > 0 && (
        <>
          <Stack spacing={1} direction={"row"} alignItems={"center"}>
            <AccessTimeIcon
              sx={{
                fontSize: "1.25em",
              }}
            />
            {timeLabels.map((label, labelIndex) => (
              <Typography key={labelIndex} variant="body1">
                {labelIndex > 0 && " • "}
                {label}
              </Typography>
            ))}
          </Stack>
        </>
      )}
      {note && (
        <Typography variant="body1" sx={textStyle}>
          {note}
        </Typography>
      )}
    </Stack>
  );
}
