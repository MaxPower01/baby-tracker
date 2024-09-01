import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

import { Entry } from "@/pages/Entry/types/Entry";
import { EntryTypeIcon } from "@/pages/Activities/components/EntryTypeIcon";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { IntervalMethodId } from "@/pages/Settings/enums/IntervalMethodId";
import { PageId } from "@/enums/PageId";
import { entryHasStopwatchRunning } from "@/pages/Entry/utils/entryHasStopwatchRunning";
import { entryTypeHasStopwatch } from "@/pages/Entry/utils/entryTypeHasStopwatch";
import { getEntryTypeName } from "@/utils/getEntryTypeName";
import getPath from "@/utils/getPath";
import { getTimeElapsedSinceLastEntry } from "@/utils/getTimeElapsedSinceLastEntry";
import { selectIntervalMethodByEntryTypeId } from "@/state/slices/settingsSlice";
import { stopwatchDisplayTimeAfterStopInSeconds } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

type Props = {
  entryType: EntryTypeId;
  mostRecentEntryOfType: Entry | undefined;
  padding: number;
  width: string;
};

export function EntriesWidgetItemBody(props: Props) {
  const theme = useTheme();
  const navigate = useNavigate();
  const name = getEntryTypeName(props.entryType);
  const stopwatchIsRunning =
    props.mostRecentEntryOfType == null
      ? false
      : entryHasStopwatchRunning(props.mostRecentEntryOfType);
  const intervalMethodByEntryTypeId = useSelector(
    selectIntervalMethodByEntryTypeId
  );
  let from: "start" | "end" | undefined = undefined;
  if (props.mostRecentEntryOfType != null) {
    const entryTypeId = props.mostRecentEntryOfType.entryTypeId;
    const intervalMethodId = intervalMethodByEntryTypeId.find(
      (item) => item.entryTypeId === entryTypeId
    )?.methodId;
    if (intervalMethodId === IntervalMethodId.BeginningToBeginning) {
      from = "start";
    } else if (intervalMethodId === IntervalMethodId.EndToBeginning) {
      from = "end";
    }
  }
  const elapsedTime =
    props.mostRecentEntryOfType == null
      ? null
      : getTimeElapsedSinceLastEntry(props.mostRecentEntryOfType, from);
  const showStopwatch =
    entryTypeHasStopwatch(props.entryType) &&
    (stopwatchIsRunning ||
      (elapsedTime?.seconds ?? stopwatchDisplayTimeAfterStopInSeconds) <
        stopwatchDisplayTimeAfterStopInSeconds);
  return (
    <Box
      key={props.entryType}
      sx={{
        borderRadius: 1,
        flexShrink: 0,
        display: "flex",
        justifyContent: "flex-start",
        flexDirection: "column",
        alignItems: "center",
        // height: "100%",
        padding: `${props.padding}px`,
        width: props.width,
        // order: showStopwatch ? -1 : undefined,
      }}
    >
      <Card
        sx={{
          border: "1px solid",
          borderColor: showStopwatch
            ? (`${theme.palette.primary.main}${
                stopwatchIsRunning ? 50 : 35
              }` as string)
            : "transparent",
          backgroundColor: stopwatchIsRunning
            ? `${theme.palette.primary.main}30`
            : undefined,
          boxShadow: showStopwatch
            ? `0 0 5px 0px ${theme.palette.primary.main}${
                stopwatchIsRunning ? "" : 50
              }`
            : undefined,
          borderRadius: 1,
          flexGrow: 1,
          width: "100%",
        }}
      >
        <CardActionArea
          sx={{
            height: "100%",
          }}
          onClick={() => {
            navigate(
              getPath({
                paths: stopwatchIsRunning
                  ? [props.mostRecentEntryOfType?.id ?? ""]
                  : undefined,
                page: PageId.Entry,
                params: {
                  type: props.entryType.toString(),
                },
              })
            );
          }}
        >
          <CardContent
            sx={{
              height: "100%",
              padding: 1,
            }}
          >
            <Stack
              sx={{
                height: "100%",
              }}
            >
              <Box
                sx={{
                  flexShrink: 0,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <EntryTypeIcon
                  type={props.entryType}
                  sx={{
                    fontSize: "3.5em",
                  }}
                />
              </Box>
              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "3em",
                }}
              >
                <Typography
                  variant={"button"}
                  sx={{
                    textAlign: "center",
                    color: theme.customPalette.text.secondary,
                    lineHeight: 1.4,
                  }}
                >
                  {name}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>
  );
}
