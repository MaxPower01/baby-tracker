import { formatStopwatchTime } from "@/lib/utils";
import ActivityChip from "@/modules/activities/components/ActivityChip";
import SubActivityChip from "@/modules/activities/components/SubActivityChip";
import EntryModel from "@/modules/entries/models/EntryModel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import { Box, Grid, Stack, SxProps, Typography, useTheme } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
type Props = {
  entry: EntryModel;
  sx?: SxProps | undefined;
};

export default function EntryBody(props: Props) {
  const theme = useTheme();
  const { entry, sx } = props;
  if (!entry) return null;
  const hasStopwatchRunning =
    entry.leftStopwatchIsRunning || entry.rightStopwatchIsRunning;
  const textColor = hasStopwatchRunning
    ? theme.palette.primary.main
    : undefined;
  const [timeLabels, setTimeLabels] = useState<string[]>([]);
  const [volumeLabels, setVolumeLabels] = useState<string[]>([]);
  const iconFontSize = "1.5em";
  // const timeLabels: string[] = useMemo(() => {
  //   let result: string[] = [];
  //   if (!time) return result;
  //   if (entry?.activity?.hasSides) {
  //     if (leftTime && rightTime) {
  //       let leftLabel = `(G) ${formatStopwatchTime(
  //         entry.getTime({
  //           side: "left",
  //           upToDate: true,
  //         }),
  //         true
  //       )}`;
  //       let rightLabel = `(D) ${formatStopwatchTime(
  //         entry.getTime({ side: "right", upToDate: true }),
  //         true
  //       )}`;
  //       // if (entry.leftStopwatchIsRunning) leftLabel += " (en cours)";
  //       // if (entry.rightStopwatchIsRunning) rightLabel += " (en cours)";
  //       result.push(leftLabel);
  //       result.push(rightLabel);
  //     } else {
  //       let label = `${formatStopwatchTime(
  //         entry.getTime({ upToDate: true }),
  //         true
  //       )}`;
  //       // if (entry.leftStopwatchIsRunning) label += " (en cours)";
  //       result.push(label);
  //     }
  //   } else {
  //     let label = `${formatStopwatchTime(
  //       entry.getTime({ upToDate: true }),
  //       true
  //     )}`;
  //     // if (entry.leftStopwatchIsRunning) label += " (en cours)";
  //     result.push(label);
  //   }
  //   return result;
  // }, [time, leftTime, rightTime, entry]);

  // const volumeLabels = useMemo(() => {
  //   let result: string[] = [];
  //   if (!entry.volume) return result;
  //   if (entry?.activity?.hasSides) {
  //     if (entry.leftVolume && rightVolume) {
  //       let leftLabel = `${entry.leftVolume} ml (G)`;
  //       let rightLabel = `${rightVolume} ml (D)`;
  //       result.push(leftLabel);
  //       result.push(rightLabel);
  //     } else {
  //       let label = `${volume} ml`;
  //       result.push(label);
  //     }
  //   } else {
  //     let label = `${volume} ml`;
  //     result.push(label);
  //   }
  //   return result;
  // }, [volume, entry.leftVolume, rightVolume, entry]);

  // const shouldRenderCardContent = useMemo(() => {
  //   return (
  //     timeLabels.length > 0 ||
  //     note ||
  //     linkedActivities.length > 0 ||
  //     subActivities.length > 0 ||
  //     volumeLabels.length > 0
  //   );
  // }, [timeLabels, note, linkedActivities, volumeLabels]);

  // if (!shouldRenderCardContent) return null;

  const textStyle: SxProps = {
    // fontStyle: "italic",
    opacity: 0.8,
    color: textColor,
  };

  const computeTimeLabels = useCallback(() => {
    let result: string[] = [];
    if (!entry.time) {
      setTimeLabels(result);
      return;
    }
    if (entry?.activity?.hasSides) {
      if (entry.leftTime && entry.rightTime) {
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
    setTimeLabels(result);
  }, [entry]);

  const computeVolumeLabels = useCallback(() => {
    let result: string[] = [];
    if (!entry.volume) {
      setVolumeLabels(result);
      return;
    }
    if (entry?.activity?.hasSides) {
      if (entry.leftVolume && entry.rightVolume) {
        let leftLabel = `${entry.leftVolume} ml (G)`;
        let rightLabel = `${entry.rightVolume} ml (D)`;
        result.push(leftLabel);
        result.push(rightLabel);
      } else {
        let label = `${entry.volume} ml`;
        result.push(label);
      }
    } else {
      let label = `${entry.volume} ml`;
      result.push(label);
    }
    setVolumeLabels(result);
  }, [entry]);

  useEffect(() => {
    computeTimeLabels();
    computeVolumeLabels();
    const intervalId = setInterval(() => {
      computeTimeLabels();
      computeVolumeLabels();
    }, 1000);
    return () => clearInterval(intervalId);
  }, [entry]);

  return (
    <Stack
      spacing={1}
      sx={{
        ...sx,
      }}
    >
      {entry.linkedActivities.length > 0 && (
        <Grid justifyContent="flex-start" gap={1} container>
          {entry.linkedActivities.map((linkedActivity) => {
            if (entry.activity == null) return null;
            return (
              <ActivityChip
                key={`${entry.id}-${entry.activity.type}-${linkedActivity.type}`}
                activity={linkedActivity}
                size={"small"}
                isSelected={true}
              />
            );
          })}
        </Grid>
      )}
      {entry.subActivities.length > 0 && (
        <Grid justifyContent="flex-start" gap={1} container>
          {entry.subActivities.map((subActivity) => {
            if (entry.activity == null) return null;
            return (
              <SubActivityChip
                key={`${entry.id}-${entry.activity.type}-${subActivity.type}`}
                subActivity={subActivity}
                size={"small"}
                isSelected={true}
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
              color: textColor,
            }}
          />
          <Box>
            {volumeLabels.map((label, labelIndex) => (
              <Typography
                key={labelIndex}
                variant="body1"
                sx={{
                  display: "inline",
                  color: textColor,
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
            sx={{}}
          >
            <AccessTimeIcon
              sx={{
                color: textColor,
                fontSize: hasStopwatchRunning ? "2em" : iconFontSize,
              }}
            />
            <Box>
              <Typography
                variant="body1"
                sx={{
                  display: "inline",
                  color: textColor,
                  fontSize: hasStopwatchRunning ? "2em" : undefined,
                  fontWeight: hasStopwatchRunning ? "bold" : undefined,
                }}
              >
                {label}
              </Typography>
            </Box>
          </Stack>
        ))}

      {entry.note && (
        <Typography
          variant="body1"
          sx={{
            ...textStyle,
          }}
        >
          {entry.note}
        </Typography>
      )}
    </Stack>
  );
}
