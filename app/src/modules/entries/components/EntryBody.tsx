import { Box, Grid, Stack, SxProps, Typography, useTheme } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ActivityChip from "@/modules/activities/components/ActivityChip";
import EntryModel from "@/modules/entries/models/EntryModel";
import OpacityIcon from "@mui/icons-material/Opacity";
import SubActivityChip from "@/modules/activities/components/SubActivityChip";
import { formatStopwatchTime } from "@/utils/utils";

type Props = {
  entry: EntryModel;
  previousEntry?: EntryModel;
  sx?: SxProps | undefined;
  useCompactMode?: boolean;
};

export default function EntryBody(props: Props) {
  const theme = useTheme();
  const { entry, sx, previousEntry, useCompactMode } = props;
  if (!entry) return null;
  const hasStopwatchRunning =
    entry.leftStopwatchIsRunning || entry.rightStopwatchIsRunning;
  const textColor = hasStopwatchRunning
    ? theme.palette.primary.main
    : undefined;
  const [timeLabels, setTimeLabels] = useState<string[]>([]);
  const [volumeLabels, setVolumeLabels] = useState<string[]>([]);
  const iconFontSize = "1.5em";

  const textStyle: SxProps = {
    opacity: 0.8,
    color: textColor,
  };

  const timeElapsedSincePreviousEntryLabel = useMemo(() => {
    if (!entry || !entry.activity || !previousEntry) return null;
    const diff = entry.startDate.getTime() - previousEntry.endDate.getTime();
    const duration =
      previousEntry.time > 0
        ? formatStopwatchTime(
            previousEntry.time,
            true,
            previousEntry.time < 1000 * 60
          )
        : null;
    return {
      prefix: entry.activity.previousEntryLabelPrefix,
      time: formatStopwatchTime(diff, true),
      duration: duration,
    };
  }, [entry, previousEntry]);

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
      spacing={useCompactMode ? 0 : 1}
      sx={{
        ...sx,
      }}
    >
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
                textColor={textColor}
              />
            );
          })}
        </Grid>
      )}

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
                textColor={textColor}
              />
            );
          })}
        </Grid>
      )}

      {volumeLabels?.length > 0 &&
        volumeLabels.map((label, labelIndex) => (
          <Stack
            key={labelIndex}
            spacing={1}
            direction={"row"}
            alignItems={"center"}
            sx={{}}
          >
            <OpacityIcon
              sx={{
                color: textColor,
                fontSize: iconFontSize,
              }}
            />
            <Box>
              <Typography
                variant={useCompactMode ? "caption" : "body1"}
                sx={{
                  display: "inline",
                  color: textColor,
                  fontSize: undefined,
                  fontWeight: undefined,
                }}
              >
                {label}
              </Typography>
            </Box>
          </Stack>
        ))}

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
                fontSize: iconFontSize,
              }}
            />
            <Box>
              <Typography
                variant={
                  hasStopwatchRunning
                    ? useCompactMode
                      ? "body1"
                      : "h6"
                    : "caption"
                }
                sx={{
                  display: "inline",
                  color: textColor,
                  fontWeight: hasStopwatchRunning
                    ? useCompactMode
                      ? 600
                      : "bold"
                    : undefined,
                }}
              >
                {label}
              </Typography>
            </Box>
          </Stack>
        ))}

      {entry.note && (
        <Typography
          variant={useCompactMode ? "caption" : "body1"}
          sx={{
            ...textStyle,
          }}
        >
          {entry.note}
        </Typography>
      )}

      {timeElapsedSincePreviousEntryLabel != null && (
        <Typography
          variant={useCompactMode ? "caption" : "body2"}
          sx={{
            ...textStyle,
            opacity: 0.35,
            fontStyle: "italic",
            fontWeight: 300,
          }}
        >
          {timeElapsedSincePreviousEntryLabel.prefix}{" "}
          <span
            style={{
              fontWeight: 400,
              whiteSpace: "nowrap",
            }}
          >
            {timeElapsedSincePreviousEntryLabel.time}
          </span>
        </Typography>
      )}
    </Stack>
  );
}
