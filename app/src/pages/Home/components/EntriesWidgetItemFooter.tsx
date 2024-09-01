import { Box, Stack, Typography, useTheme } from "@mui/material";
import React, { useCallback, useState } from "react";

import { Entry } from "@/pages/Entry/types/Entry";
import { EntrySubtitle } from "@/pages/Entry/components/EntrySubtitle";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { PageId } from "@/enums/PageId";
import { StopwatchContainer } from "@/components/StopwatchContainer";
import { computeEndDate } from "@/pages/Entry/utils/computeEndDate";
import { entryHasStopwatchRunning } from "@/pages/Entry/utils/entryHasStopwatchRunning";
import { entryTypeHasSides } from "@/pages/Entry/utils/entryTypeHasSides";
import { entryTypeHasStopwatch } from "@/pages/Entry/utils/entryTypeHasStopwatch";
import { getDateFromTimestamp } from "@/utils/getDateFromTimestamp";
import getPath from "@/utils/getPath";
import { getTimeElapsedSinceLastEntry } from "@/utils/getTimeElapsedSinceLastEntry";
import { getTimestamp } from "@/utils/getTimestamp";
import { stopwatchDisplayTimeAfterStopInSeconds } from "@/utils/constants";
import { useAppDispatch } from "@/state/hooks/useAppDispatch";
import { useAuthentication } from "@/pages/Authentication/hooks/useAuthentication";
import { useEntries } from "@/components/Entries/EntriesProvider";
import { useNavigate } from "react-router-dom";

type Props = {
  entryType: EntryTypeId;
  mostRecentEntryOfType: Entry | undefined;
  width: string;
  padding: number;
};

export function EntriesWidgetItemFooter(props: Props) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAuthentication();
  const { saveEntry } = useEntries();
  const elapsedTime =
    props.mostRecentEntryOfType == null
      ? null
      : getTimeElapsedSinceLastEntry(props.mostRecentEntryOfType);
  const stopwatchIsRunning =
    props.mostRecentEntryOfType == null
      ? false
      : entryHasStopwatchRunning(props.mostRecentEntryOfType);
  const [leftTime, setLeftTime] = React.useState(
    props.mostRecentEntryOfType?.leftTime ?? 0
  );
  const [rightTime, setRightTime] = React.useState(
    props.mostRecentEntryOfType?.rightTime ?? 0
  );
  const [leftIsRunning, setLeftIsRunning] = React.useState(
    props.mostRecentEntryOfType?.leftStopwatchIsRunning ?? false
  );
  const [rightIsRunning, setRightIsRunning] = React.useState(
    props.mostRecentEntryOfType?.rightStopwatchIsRunning ?? false
  );
  const [leftLastUpdateTime, setLeftLastUpdateTime] = React.useState(
    props.mostRecentEntryOfType?.leftStopwatchLastUpdateTime ?? null
  );
  const [rightLastUpdateTime, setRightLastUpdateTime] = React.useState(
    props.mostRecentEntryOfType?.rightStopwatchLastUpdateTime ?? null
  );
  const [isSaving, setIsSaving] = useState(false);
  const handlePlayPause = useCallback(
    (
      side: "right" | "left",
      time: number,
      isRunning: boolean,
      lastUpdateTime: number | null
    ) => {
      return new Promise<boolean>(async (resolve, reject) => {
        try {
          if (isSaving || user == null || props.mostRecentEntryOfType == null) {
            return resolve(false);
          }
          setIsSaving(true);
          const newLeftTime = side === "left" ? time : leftTime;
          const newRightTime = side === "right" ? time : rightTime;
          const totalTime = newLeftTime + newRightTime;
          const newLeftStopwatchIsRunning =
            side === "left" ? isRunning : leftIsRunning;
          const newRightStopwatchIsRunning =
            side === "right" ? isRunning : rightIsRunning;
          const newLeftStopwatchLastUpdateTime =
            side === "left" ? lastUpdateTime : leftLastUpdateTime;
          const newRightStopwatchLastUpdateTime =
            side === "right" ? lastUpdateTime : rightLastUpdateTime;
          const startDate = getDateFromTimestamp(
            props.mostRecentEntryOfType.startTimestamp
          );
          const newEndTimestamp = getTimestamp(
            computeEndDate(startDate, totalTime)
          );
          const entry: Entry = {
            ...props.mostRecentEntryOfType,
            leftTime: newLeftTime,
            leftStopwatchIsRunning: newLeftStopwatchIsRunning,
            leftStopwatchLastUpdateTime: newLeftStopwatchLastUpdateTime,
            rightTime: newRightTime,
            rightStopwatchIsRunning: newRightStopwatchIsRunning,
            rightStopwatchLastUpdateTime: newRightStopwatchLastUpdateTime,
            endTimestamp: newEndTimestamp,
          };
          await saveEntry(entry);
          setIsSaving(false);
          return resolve(true);
        } catch (error) {
          setIsSaving(false);
          return reject(error);
        }
      });
    },
    [
      isSaving,
      user,
      props.mostRecentEntryOfType,
      leftTime,
      leftIsRunning,
      leftLastUpdateTime,
      rightTime,
      rightIsRunning,
      rightLastUpdateTime,
    ]
  );

  const showStopwatch =
    entryTypeHasStopwatch(props.entryType) &&
    (stopwatchIsRunning ||
      (elapsedTime?.seconds ?? stopwatchDisplayTimeAfterStopInSeconds) <
        stopwatchDisplayTimeAfterStopInSeconds);
  const showElapsedTime = !showStopwatch && elapsedTime != null;
  const showSubtitle = !showStopwatch;

  const shouldHandleClick =
    props.mostRecentEntryOfType != null && !showStopwatch;

  return (
    <Box
      key={props.entryType}
      sx={{
        width: props.width,
        // order: showStopwatch ? -1 : undefined,
        padding: `${props.padding}px`,
        cursor: shouldHandleClick ? "pointer" : undefined,
        "&:hover": shouldHandleClick
          ? {
              backgroundColor: theme.palette.action.hover,
            }
          : undefined,
        transition: shouldHandleClick
          ? theme.transitions.create(["background-color"], {
              duration: theme.transitions.duration.standard,
            })
          : undefined,
      }}
      onClick={() => {
        if (!shouldHandleClick || props.mostRecentEntryOfType == null) {
          return;
        }
        navigate(
          getPath({
            paths: [props.mostRecentEntryOfType.id ?? ""],
            page: PageId.Entry,
            params: {
              type: props.entryType.toString(),
            },
          })
        );
      }}
    >
      {props.mostRecentEntryOfType == null ? null : (
        <Stack
          sx={{
            width: "100%",
          }}
        >
          {showStopwatch && (
            <StopwatchContainer
              leftIsRunning={leftIsRunning}
              setLeftIsRunning={setLeftIsRunning}
              rightIsRunning={rightIsRunning}
              setRightIsRunning={setRightIsRunning}
              leftLastUpdateTime={leftLastUpdateTime}
              setLeftLastUpdateTime={setLeftLastUpdateTime}
              rightLastUpdateTime={rightLastUpdateTime}
              setRightLastUpdateTime={setRightLastUpdateTime}
              size="small"
              hasSides={entryTypeHasSides(props.entryType)}
              leftTime={leftTime}
              setLeftTime={setLeftTime}
              rightTime={rightTime}
              setRightTime={setRightTime}
              onPlayPause={handlePlayPause}
            />
          )}

          {showElapsedTime && (
            <Typography
              variant={"body2"}
              sx={{
                textAlign: "center",
                color: theme.customPalette.text.tertiary,
              }}
            >
              {elapsedTime.label}
            </Typography>
          )}

          {showSubtitle && (
            <EntrySubtitle
              entry={props.mostRecentEntryOfType}
              sx={{
                textAlign: "center",
                justifyContent: "center",
                alignItems: "center",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            />
          )}
        </Stack>
      )}
    </Box>
  );
}
