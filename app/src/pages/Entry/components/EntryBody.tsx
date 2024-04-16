import { Box, Stack, SxProps, Typography, useTheme } from "@mui/material";

import { Entry } from "@/pages/Entry/types/Entry";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { IntervalMethod } from "@/pages/Settings/enums/IntervalMethod";
import { entryTypeHasPoop } from "@/pages/Entry/utils/entryTypeHasPoop";
import formatStopwatchTime from "@/utils/formatStopwatchTime";
import { getPoopTextureName } from "@/utils/getPoopTextureName";
import { getPreviousEntryLabelPrefix } from "@/utils/getPreviousEntryLabelPrefix";
import { isNullOrWhiteSpace } from "@/utils/utils";
import { selectIntervalMethodByEntryTypeId } from "@/state/slices/settingsSlice";
import { useSelector } from "react-redux";

type Props = {
  entry: Entry;
  previousEntry?: Entry;
  sx?: SxProps | undefined;
};

export function EntryBody(props: Props) {
  const theme = useTheme();
  let poopTextureLabel = "";
  let poopTextureName = "";
  if (entryTypeHasPoop(props.entry.entryTypeId)) {
    if (props.entry.poopTextureId != null) {
      poopTextureName = getPoopTextureName(props.entry.poopTextureId);
    }
    if (props.entry.entryTypeId == EntryTypeId.Poop) {
      poopTextureLabel = `Consistance:`;
    } else {
      poopTextureLabel = `Consistance du caca:`;
    }
  }
  const intervalMethodByEntryTypeId = useSelector(
    selectIntervalMethodByEntryTypeId
  );

  let timeSincePreviousEntry = null;
  if (props.previousEntry != null) {
    const method = intervalMethodByEntryTypeId.find(
      (x) => x.entryTypeId == props.entry.entryTypeId
    )?.method;
    let previousEntryTimestamp = props.previousEntry.startTimestamp;
    if (method) {
      previousEntryTimestamp =
        method == IntervalMethod.BeginningToBeginning
          ? props.previousEntry.startTimestamp
          : props.previousEntry.endTimestamp;
    }
    const currentEntryTimestamp = props.entry.startTimestamp;
    const differenceInMilliseconds =
      currentEntryTimestamp * 1000 - previousEntryTimestamp * 1000;
    const time =
      (props.previousEntry.leftTime ?? 0) +
      (props.previousEntry.rightTime ?? 0);
    const duration = time > 0 ? formatStopwatchTime(time, false) : null;
    let timeLabel = formatStopwatchTime(differenceInMilliseconds, true, false);
    if (isNullOrWhiteSpace(timeLabel)) {
      timeLabel = "1 min";
    }
    timeSincePreviousEntry = {
      prefix: getPreviousEntryLabelPrefix(props.entry.entryTypeId),
      time: timeLabel,
      duration: duration,
    };
  }

  return (
    <Stack
      spacing={0.5}
      sx={{
        ...props.sx,
        width: "100%",
      }}
    >
      {!isNullOrWhiteSpace(props.entry.note) && (
        <Typography
          variant={"body2"}
          sx={{
            opacity: theme.opacity.tertiary,
            fontWeight: 400,
          }}
        >
          {props.entry.note}
        </Typography>
      )}
      {!isNullOrWhiteSpace(poopTextureLabel) &&
        !isNullOrWhiteSpace(poopTextureName) && (
          <Box>
            <Typography
              variant={"body2"}
              sx={{
                opacity: theme.opacity.tertiary,
                fontWeight: 400,
                display: "inline",
              }}
            >
              {poopTextureLabel}
            </Typography>
            <Typography
              variant={"body2"}
              sx={{
                opacity: theme.opacity.secondary,
                fontWeight: 400,
                display: "inline",
              }}
            >
              {" "}
              {poopTextureName}
            </Typography>
          </Box>
        )}
      {timeSincePreviousEntry != null && (
        <Typography
          variant={"caption"}
          sx={{
            opacity: theme.opacity.disabled,
            fontWeight: 300,
            display: "inline",
          }}
        >
          {timeSincePreviousEntry.prefix}{" "}
          <span
            style={{
              fontWeight: 400,
              whiteSpace: "nowrap",
            }}
          >
            {timeSincePreviousEntry.time}
          </span>
        </Typography>
      )}
    </Stack>
  );
}
