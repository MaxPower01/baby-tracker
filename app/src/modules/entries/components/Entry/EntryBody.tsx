import { formatStopwatchTime } from "@/lib/utils";
import ActivityChip from "@/modules/activities/components/ActivityChip";
import SubActivityChip from "@/modules/activities/components/SubActivityChip";
import { EntryModel } from "@/modules/entries/models/EntryModel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import { Box, Grid, Stack, SxProps, Typography, useTheme } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
type Props = {
  entry: EntryModel;
  sx?: SxProps | undefined;
  textColor?: string;
};

export default function EntryBody(props: Props) {
  const [entry, setEntry] = useState<EntryModel>(props.entry);
  if (!entry) return null;
  const theme = useTheme();
  const {
    time,
    leftTime,
    rightTime,
    note,
    linkedActivities,
    subActivities,
    volume,
    leftVolume,
    rightVolume,
  } = entry;
  const iconFontSize = "1.5em";
  const timeLabels: string[] = useMemo(() => {
    let result: string[] = [];
    if (!time) return result;
    if (entry?.activity?.hasSides) {
      if (leftTime && rightTime) {
        let leftLabel = `(G) ${formatStopwatchTime(
          entry.getTime({
            side: "left",
            upToDate: true,
          }),
          true
        )}`;
        let rightLabel = `(D) ${formatStopwatchTime(
          entry.getTime({ side: "right", upToDate: true }),
          true
        )}`;
        // if (entry.leftStopwatchIsRunning) leftLabel += " (en cours)";
        // if (entry.rightStopwatchIsRunning) rightLabel += " (en cours)";
        result.push(leftLabel);
        result.push(rightLabel);
      } else {
        let label = `${formatStopwatchTime(
          entry.getTime({ upToDate: true }),
          true
        )}`;
        // if (entry.leftStopwatchIsRunning) label += " (en cours)";
        result.push(label);
      }
    } else {
      let label = `${formatStopwatchTime(
        entry.getTime({ upToDate: true }),
        true
      )}`;
      // if (entry.leftStopwatchIsRunning) label += " (en cours)";
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
      linkedActivities.length > 0 ||
      subActivities.length > 0 ||
      volumeLabels.length > 0
    );
  }, [timeLabels, note, linkedActivities, volumeLabels]);

  if (!shouldRenderCardContent) return null;

  const textStyle: SxProps = {
    fontStyle: "italic",
    opacity: 0.8,
    color: props.textColor,
  };

  useEffect(() => {
    if (entry.anyStopwatchIsRunning) {
      const intervalId = setInterval(() => {
        setEntry((prevEntry) => {
          return prevEntry.clone();
        });
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, []);

  return (
    <Stack
      spacing={1}
      sx={{
        ...props.sx,
      }}
    >
      {linkedActivities.length > 0 && (
        <Grid justifyContent="flex-start" gap={1} container>
          {linkedActivities.map((linkedActivity) => {
            if (entry.activity == null) return null;
            return (
              <ActivityChip
                key={`${entry.id}-${entry.activity.type}-${linkedActivity.type}`}
                activity={linkedActivity}
                size={"small"}
                isSelected={true}
                isSelectable={false}
              />
            );
          })}
        </Grid>
      )}
      {subActivities.length > 0 && (
        <Grid justifyContent="flex-start" gap={1} container>
          {subActivities.map((subActivity) => {
            if (entry.activity == null) return null;
            return (
              <SubActivityChip
                key={`${entry.id}-${entry.activity.type}-${subActivity.type}`}
                subActivity={subActivity}
                size={"small"}
                isSelected={true}
                isSelectable={false}
              />
            );
          })}
        </Grid>
      )}
      {volumeLabels?.length > 0 && (
        <Stack spacing={1} direction={"row"} alignItems={"center"}>
          <WaterDropIcon
            sx={{
              fontSize: iconFontSize,
              color: props.textColor,
            }}
          />
          <Box>
            {volumeLabels.map((label, labelIndex) => (
              <Typography
                key={labelIndex}
                variant="body1"
                sx={{
                  display: "inline",
                  color: props.textColor,
                }}
              >
                {labelIndex > 0 && " • "}
                {label}
              </Typography>
            ))}
          </Box>
        </Stack>
      )}
      {timeLabels?.length > 0 &&
        timeLabels.map((label, labelIndex) => (
          <Stack
            key={labelIndex}
            spacing={1}
            direction={"row"}
            alignItems={"center"}
          >
            <AccessTimeIcon
              sx={{
                fontSize: iconFontSize,
                color: props.textColor,
              }}
            />
            <Box>
              <Typography
                variant="body1"
                sx={{
                  display: "inline",
                  color: props.textColor,
                }}
              >
                {label}
              </Typography>
            </Box>
          </Stack>
        ))}

      {note && (
        <Typography variant="body1" sx={textStyle}>
          {note}
        </Typography>
      )}
    </Stack>
  );
}
