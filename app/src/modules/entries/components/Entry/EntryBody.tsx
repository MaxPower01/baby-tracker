import { formatStopwatchTime } from "@/lib/utils";
import ActivityChip from "@/modules/activities/components/ActivityChip";
import { EntryModel } from "@/modules/entries/models/EntryModel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import { Box, Grid, Stack, SxProps, Typography } from "@mui/material";
import { useMemo } from "react";
type Props = {
  entry: EntryModel;
  sx?: SxProps | undefined;
};

export default function EntryBody(props: Props) {
  const { entry, sx } = props;
  if (!entry) return null;
  const {
    time,
    leftTime,
    rightTime,
    note,
    subActivities,
    volume,
    leftVolume,
    rightVolume,
  } = entry;
  const timeLabels: string[] = useMemo(() => {
    let result: string[] = [];
    if (!time) return result;
    if (entry?.activity?.hasSides) {
      if (leftTime && rightTime) {
        let leftLabel = `${formatStopwatchTime(
          entry.getTime({
            side: "left",
            upToDate: true,
          }),
          true
        )} (G)`;
        let rightLabel = `${formatStopwatchTime(
          entry.getTime({ side: "right", upToDate: true }),
          true
        )} (D)`;
        if (entry.leftStopwatchIsRunning) leftLabel += " (en cours)";
        if (entry.rightStopwatchIsRunning) rightLabel += " (en cours)";
        result.push(leftLabel);
        result.push(rightLabel);
      } else {
        let label = `${formatStopwatchTime(
          entry.getTime({ upToDate: true }),
          true
        )}`;
        if (entry.leftStopwatchIsRunning) label += " (en cours)";
        result.push(label);
      }
    } else {
      let label = `${formatStopwatchTime(
        entry.getTime({ upToDate: true }),
        true
      )}`;
      if (entry.leftStopwatchIsRunning) label += " (en cours)";
      result.push(label);
    }
    return result;
  }, [time, leftTime, rightTime, entry]);

  const volumeLabels = useMemo(() => {
    let result: string[] = [];
    if (!volume) return result;
    if (entry?.activity?.hasSides) {
      if (leftVolume && rightVolume) {
        let leftLabel = `${leftVolume} ml (G)`;
        let rightLabel = `${rightVolume} ml (D)`;
        result.push(leftLabel);
        result.push(rightLabel);
      } else {
        let label = `${volume} ml`;
        result.push(label);
      }
    } else {
      let label = `${volume} ml`;
      result.push(label);
    }
    return result;
  }, [volume, leftVolume, rightVolume, entry]);

  const shouldRenderCardContent = useMemo(() => {
    return (
      timeLabels.length > 0 ||
      note ||
      subActivities.length > 0 ||
      volumeLabels.length > 0
    );
  }, [timeLabels, note, subActivities, volumeLabels]);

  if (!shouldRenderCardContent) return null;

  const textStyle: SxProps = {
    fontStyle: "italic",
    opacity: 0.8,
  };

  return (
    <Stack
      spacing={1}
      sx={{
        ...sx,
      }}
    >
      {subActivities.length > 0 && (
        <Grid justifyContent="flex-start" gap={1} container>
          {subActivities.map((subActivity) => {
            if (entry.activity == null) return null;
            return (
              <ActivityChip
                key={`${entry.id}-${entry.activity.type}-${subActivity.type}`}
                activity={subActivity}
                size={"small"}
                variant="outlined"
              />
            );
          })}
        </Grid>
      )}
      {volumeLabels?.length > 0 && (
        <>
          <Stack spacing={1} direction={"row"} alignItems={"center"}>
            <WaterDropIcon
              sx={{
                fontSize: "2em",
              }}
            />
            <Box>
              {volumeLabels.map((label, labelIndex) => (
                <Typography
                  key={labelIndex}
                  variant="body1"
                  sx={{
                    display: "inline",
                  }}
                >
                  {labelIndex > 0 && " • "}
                  {label}
                </Typography>
              ))}
            </Box>
          </Stack>
        </>
      )}
      {timeLabels?.length > 0 && (
        <>
          <Stack spacing={1} direction={"row"} alignItems={"center"}>
            <AccessTimeIcon
              sx={{
                fontSize: "2em",
              }}
            />
            <Box>
              {timeLabels.map((label, labelIndex) => (
                <Typography
                  key={labelIndex}
                  variant="body1"
                  sx={{
                    display: "inline",
                  }}
                >
                  {labelIndex > 0 && " • "}
                  {label}
                </Typography>
              ))}
            </Box>
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
