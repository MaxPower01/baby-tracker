import { formatStopwatchTime } from "@/lib/utils";
import ActivityChip from "@/modules/activities/components/ActivityChip";
import { EntryModel } from "@/modules/entries/models/EntryModel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Grid, Stack, SxProps, Typography } from "@mui/material";
import { useMemo } from "react";
type Props = {
  entry: EntryModel;
};

export default function EntryBody(props: Props) {
  const { entry } = props;
  if (!entry) return null;
  const { time, leftTime, rightTime, note, subActivities } = entry;
  const timeLabels: string[] = useMemo(() => {
    let result: string[] = [];
    if (!time) return result;
    if (entry?.activity?.hasSides) {
      if (leftTime && rightTime) {
        let leftLabel = `${formatStopwatchTime(
          entry.getTime({
            side: "left",
            upToDate: true,
          })
        )} (G)`;
        let rightLabel = `${formatStopwatchTime(
          entry.getTime({ side: "right", upToDate: true })
        )} (D)`;
        if (entry.leftStopwatchIsRunning) leftLabel += " (en cours)";
        if (entry.rightStopwatchIsRunning) rightLabel += " (en cours)";
        result.push(leftLabel);
        result.push(rightLabel);
      } else {
        let label = `${formatStopwatchTime(entry.getTime({ upToDate: true }))}`;
        if (entry.leftStopwatchIsRunning) label += " (en cours)";
        result.push(label);
      }
    } else {
      let label = `${formatStopwatchTime(entry.getTime({ upToDate: true }))}`;
      if (entry.leftStopwatchIsRunning) label += " (en cours)";
      result.push(label);
    }
    return result;
  }, [time, leftTime, rightTime, entry]);

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
            if (entry.activity == null) return null;
            return (
              <ActivityChip
                key={`${entry.id}-${entry.activity.type}-${subActivity.type}`}
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
