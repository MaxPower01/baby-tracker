import {
  Box,
  ImageList,
  ImageListItem,
  Stack,
  SxProps,
  Typography,
  useTheme,
} from "@mui/material";

import { Entry } from "@/pages/Entry/types/Entry";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { IntervalMethodId } from "@/pages/Settings/enums/IntervalMethodId";
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
    const methodId = intervalMethodByEntryTypeId.find(
      (x) => x.entryTypeId == props.entry.entryTypeId
    )?.methodId;
    let previousEntryTimestamp = props.previousEntry.startTimestamp;
    if (methodId) {
      previousEntryTimestamp =
        methodId == IntervalMethodId.BeginningToBeginning
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

  const shouldRender =
    !isNullOrWhiteSpace(poopTextureLabel) ||
    !isNullOrWhiteSpace(props.entry.note) ||
    (props.entry.imageURLs?.length ?? 0) > 0 ||
    timeSincePreviousEntry != null;

  if (!shouldRender) {
    return null;
  }

  return (
    <Stack
      spacing={1}
      sx={{
        ...props.sx,
        width: "100%",
      }}
    >
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
      {!isNullOrWhiteSpace(props.entry.note) && (
        <Typography
          variant={"body2"}
          sx={{
            opacity: theme.opacity.tertiary,
            fontWeight: 400,
          }}
          gutterBottom
        >
          {props.entry.note}
        </Typography>
      )}
      {(props.entry.imageURLs?.length ?? 0) > 0 && (
        <Box>
          <ImageList
            variant="masonry"
            cols={props.entry.imageURLs.length === 1 ? 1 : 2}
            gap={8}
          >
            {props.entry.imageURLs.map((imageURL, index) => (
              <ImageListItem
                sx={{
                  borderRadius: 1,
                  overflow: "hidden",
                  cursor: "pointer",
                }}
                key={index}
              >
                <img src={imageURL} loading="lazy" />
              </ImageListItem>
            ))}
          </ImageList>
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
