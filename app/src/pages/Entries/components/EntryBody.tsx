import {
  Box,
  Grid,
  ImageList,
  ImageListItem,
  LinearProgress,
  Slider,
  Stack,
  SxProps,
  Typography,
  useTheme,
} from "@mui/material";
import {
  selectShowPoopQuantityInHomePage,
  selectShowUrineQuantityInHomePage,
} from "@/pages/Settings/state/settingsSlice";
import { useCallback, useEffect, useMemo, useState } from "react";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ActivityChip from "@/pages/Activities/components/ActivityChip";
import ActivityIcon from "@/pages/Activities/components/ActivityIcon";
import ActivityModel from "@/pages/Activities/models/ActivityModel";
import ActivityType from "@/pages/Activities/enums/ActivityType";
import EntryModel from "@/pages/Entries/models/EntryModel";
import OpacityIcon from "@mui/icons-material/Opacity";
import ScaleIcon from "@mui/icons-material/Scale";
import StraightenIcon from "@mui/icons-material/Straighten";
import SubActivityChip from "@/pages/Activities/components/SubActivityChip";
import formatStopwatchTime from "@/utils/formatStopwatchTime";
import { isNullOrWhiteSpace } from "@/utils/utils";
import poopMarks from "@/utils/poopMarks";
import urineMarks from "@/utils/urineMarks";
import { useSelector } from "react-redux";

type Props = {
  entry: EntryModel;
  previousEntry?: EntryModel;
  sx?: SxProps | undefined;
};

export default function EntryBody(props: Props) {
  const theme = useTheme();
  const { entry, sx, previousEntry } = props;
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

  const showPoopQuantityInHomePage = useSelector(
    selectShowPoopQuantityInHomePage
  );
  const showUrineQuantityInHomePage = useSelector(
    selectShowUrineQuantityInHomePage
  );

  const activityTypesThatDisplayPoopAndUrineSliders = [
    ActivityType.Diaper,
    ActivityType.Urine,
    ActivityType.Poop,
  ];

  const timeElapsedSincePreviousEntryLabel = useMemo(() => {
    if (!entry || !entry.activity || !previousEntry) return null;
    const diff = entry.startDate.getTime() - previousEntry.endDate.getTime();
    const duration =
      previousEntry.time > 0
        ? formatStopwatchTime(previousEntry.time, false)
        : null;
    return {
      prefix: entry.activity.previousEntryLabelPrefix,
      time: formatStopwatchTime(diff, true),
      duration: duration,
    };
  }, [entry, previousEntry]);

  const computeTimeLabels = useCallback(() => {
    let result: string[] = [];
    if (
      !entry.time ||
      entry.time == 0 ||
      entry.activity?.hasDuration !== true
    ) {
      setTimeLabels(result);
      return;
    }
    if (entry?.activity?.hasSides) {
      if (entry.leftTime && entry.rightTime) {
        let leftLabel = `${formatStopwatchTime(
          entry.getTime({
            side: "left",
            upToDate: true,
          }),
          false
        )} • Gauche`;
        let rightLabel = `${formatStopwatchTime(
          entry.getTime({ side: "right", upToDate: true }),
          false
        )} • Droite`;
        // if (entry.leftStopwatchIsRunning) leftLabel += " (en cours)";
        // if (entry.rightStopwatchIsRunning) rightLabel += " (en cours)";
        result.push(leftLabel);
        result.push(rightLabel);
      } else {
        let label = `${formatStopwatchTime(
          entry.getTime({ upToDate: true }),
          false
        )}`;
        // if (entry.leftStopwatchIsRunning) label += " (en cours)";
        result.push(label);
      }
    } else {
      let label = `${formatStopwatchTime(
        entry.getTime({ upToDate: true }),
        false
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

  const urineLabel = useMemo(() => {
    if (entry.urineValue === 0) return urineMarks[0].label ?? "";
    return (
      urineMarks.find((m) => m.value === Math.ceil(entry.urineValue / 25) * 25)
        ?.label ?? ""
    );
  }, [entry.urineValue]);

  const poopLabel = useMemo(() => {
    if (entry.poopValue === 0) return poopMarks[0].label ?? "";
    return (
      poopMarks.find((m) => m.value === Math.ceil(entry.poopValue / 25) * 25)
        ?.label ?? ""
    );
  }, [entry.poopValue]);

  return (
    <Stack
      spacing={0.5}
      sx={{
        ...sx,
        width: "100%",
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
                isFilled={true}
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
            let text = linkedActivity.name;
            if (
              activityTypesThatDisplayPoopAndUrineSliders.includes(
                entry.activity.type
              )
            ) {
              if (linkedActivity.type == ActivityType.Poop) {
                if (entry.poopValue > 0) {
                  return null;
                  // const suffix =
                  //   poopMarks.find((m) => m.value == entry.poopValue)?.label ??
                  //   "";
                  // if (!isNullOrWhiteSpace(suffix)) text = `${text} – ${suffix}`;
                }
              } else if (linkedActivity.type == ActivityType.Urine) {
                if (entry.urineValue > 0) {
                  return null;
                  // const suffix =
                  //   urineMarks.find((m) => m.value == entry.urineValue)?.label ??
                  //   "";
                  // if (!isNullOrWhiteSpace(suffix)) text = `${text} – ${suffix}`;
                }
              }
            }
            return (
              <ActivityChip
                key={`${entry.id}-${entry.activity.type}-${linkedActivity.type}`}
                activity={linkedActivity}
                size={"small"}
                isFilled={true}
                textColor={textColor}
                overrideText={text}
              />
            );
          })}
        </Grid>
      )}

      {entry.activity != null &&
        activityTypesThatDisplayPoopAndUrineSliders.includes(
          entry.activity.type
        ) &&
        entry.poopValue > 0 &&
        showPoopQuantityInHomePage && (
          <Box
            sx={{
              // paddingLeft: 1,
              // paddingRight: 1,
              width: "100%",
            }}
          >
            <Stack
              direction={"row"}
              justifyContent={"flex-start"}
              alignItems={"center"}
              spacing={1}
              sx={{
                width: "100%",
              }}
            >
              <ActivityIcon
                activity={new ActivityModel(ActivityType.Poop)}
                sx={{
                  fontSize: "1.25rem",
                }}
              />
              <Typography
                id="poop-slider-entry-body"
                textAlign={"center"}
                variant="caption"
                color={
                  entry.poopValue == 0
                    ? theme.customPalette.text.secondary
                    : theme.customPalette.text.primary
                }
              >
                {poopLabel}
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={entry.poopValue}
              color="inherit"
              sx={{
                width: "80%",
                opacity: 0.5,
              }}
            />
          </Box>
        )}

      {entry.activity != null &&
        activityTypesThatDisplayPoopAndUrineSliders.includes(
          entry.activity.type
        ) &&
        entry.urineValue > 0 &&
        showUrineQuantityInHomePage && (
          <Stack
            sx={{
              // paddingLeft: 1,
              // paddingRight: 1,
              width: "100%",
            }}
            spacing={0.5}
          >
            <Stack
              direction={"row"}
              justifyContent={"flex-start"}
              alignItems={"center"}
              spacing={1}
              sx={{
                width: "100%",
              }}
            >
              <ActivityIcon
                activity={new ActivityModel(ActivityType.Urine)}
                sx={{
                  fontSize: "1.25rem",
                }}
              />
              <Typography
                textAlign={"center"}
                variant="caption"
                color={
                  entry.urineValue == 0
                    ? theme.customPalette.text.secondary
                    : theme.customPalette.text.primary
                }
              >
                {urineLabel}
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={entry.urineValue}
              color="inherit"
              sx={{
                width: "80%",
                opacity: 0.5,
              }}
            />
          </Stack>
        )}

      {volumeLabels?.length > 0 &&
        volumeLabels.map((label, labelIndex) => (
          <Stack
            key={labelIndex}
            spacing={0.5}
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
                variant={"caption"}
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
            spacing={0.5}
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
                variant={hasStopwatchRunning ? "body1" : "caption"}
                sx={{
                  display: "inline",
                  color: textColor,
                  fontWeight: hasStopwatchRunning ? 600 : undefined,
                }}
              >
                {label}
              </Typography>
            </Box>
          </Stack>
        ))}

      {entry.length > 0 && (
        <Stack spacing={0.5} direction={"row"} alignItems={"center"} sx={{}}>
          <StraightenIcon
            sx={{
              color: textColor,
              fontSize: iconFontSize,
            }}
          />
          <Box>
            <Typography
              variant={"caption"}
              sx={{
                display: "inline",
                color: textColor,
                fontSize: undefined,
                fontWeight: undefined,
              }}
            >
              {`${Math.round((entry.length / 10) * 100) / 100} cm | ${
                Math.round((entry.length / 10 / 2.54) * 100) / 100
              } pouces`}
            </Typography>
          </Box>
        </Stack>
      )}

      {entry.weight > 0 && (
        <Stack spacing={0.5} direction={"row"} alignItems={"center"} sx={{}}>
          <ScaleIcon
            sx={{
              color: textColor,
              fontSize: iconFontSize,
            }}
          />
          <Box>
            <Typography
              variant={"caption"}
              sx={{
                display: "inline",
                color: textColor,
                fontSize: undefined,
                fontWeight: undefined,
              }}
            >
              {`${Math.round((entry.weight / 1000) * 100) / 100} kg | ${
                Math.round((entry.weight / 1000 / 0.45359237) * 100) / 100
              } lbs`}
            </Typography>
          </Box>
        </Stack>
      )}

      {entry.note && (
        <Typography
          variant={"caption"}
          sx={{
            ...textStyle,
          }}
        >
          {entry.note}
        </Typography>
      )}

      {(entry.imageURLs?.length ?? 0) > 0 && (
        <ImageList>
          {entry.imageURLs.map((imageURL, index) => {
            return (
              <ImageListItem
                key={`${index}-${imageURL}`}
                sx={{
                  borderRadius: 1,
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <img src={`${imageURL}`} loading="lazy" />
              </ImageListItem>
            );
          })}
        </ImageList>
      )}

      {timeElapsedSincePreviousEntryLabel != null && (
        <Typography
          variant={"caption"}
          sx={{
            ...textStyle,
            opacity: 0.35,
            // fontStyle: "italic",
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
