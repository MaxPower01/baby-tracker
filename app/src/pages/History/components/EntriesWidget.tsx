import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Stack,
  Typography,
  useTheme,
  useThemeProps,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";

import ActivityIcon from "@/pages/Activities/components/ActivityIcon";
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
import { getEntryTime } from "@/pages/Entry/utils/getEntryTime";
import { getEntryTypeName } from "@/utils/getEntryTypeName";
import getPath from "@/utils/getPath";
import { getTimeElapsedSinceLastEntry } from "@/utils/getTimeElapsedSinceLastEntry";
import { getTimestamp } from "@/utils/getTimestamp";
import { saveEntryInDB } from "@/state/slices/entriesSlice";
import { selectEntryTypesOrder } from "@/state/slices/settingsSlice";
import { stopwatchDisplayTimeAfterStopInSeconds } from "@/utils/constants";
import { useAppDispatch } from "@/state/hooks/useAppDispatch";
import { useAuthentication } from "@/pages/Authentication/hooks/useAuthentication";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

type Props = {
  entries: Entry[];
};

export function EntriesWidget(props: Props) {
  const theme = useTheme();
  const entryTypesOrder = useSelector(selectEntryTypesOrder);
  const itemPadding = 4;
  const itemWidth = "10em";
  const mostRecentEntryByType = props.entries.reduce((acc, entry) => {
    if (acc[entry.entryTypeId] === undefined) {
      acc[entry.entryTypeId] = entry;
    } else if (entry.startTimestamp > acc[entry.entryTypeId].startTimestamp) {
      acc[entry.entryTypeId] = entry;
    }
    return acc;
  }, {} as Record<string, Entry>);
  if (entryTypesOrder.length === 0) {
    return null;
  }
  return (
    <Stack
      sx={{
        width: "100%",
      }}
    >
      <Box
        sx={{
          width: "100%",
          overflowX: "scroll",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <Stack>
          <Stack
            direction={"row"}
            sx={{
              display: "grid",
              gap: 0.5,
              gridTemplateColumns: `${entryTypesOrder
                .map(() => "1fr")
                .join(" ")}`,
            }}
          >
            {entryTypesOrder.map((entryType, index) => {
              return (
                <ItemBody
                  key={entryType}
                  entryType={entryType}
                  padding={itemPadding}
                  width={itemWidth}
                  mostRecentEntryOfType={mostRecentEntryByType[entryType]}
                />
              );
            })}
          </Stack>
          <Stack
            direction={"row"}
            sx={{
              display: "grid",
              gap: 0.5,
              gridTemplateColumns: `${entryTypesOrder
                .map(() => "1fr")
                .join(" ")}`,
            }}
          >
            {entryTypesOrder.map((entryType, index) => {
              return (
                <ItemFooter
                  key={entryType}
                  entryType={entryType}
                  width={itemWidth}
                  padding={itemPadding}
                  mostRecentEntryOfType={mostRecentEntryByType[entryType]}
                />
              );
            })}
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
}

type ItemBodyProps = {
  entryType: EntryTypeId;
  mostRecentEntryOfType: Entry | undefined;
  padding: number;
  width: string;
};

function ItemBody(props: ItemBodyProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const name = getEntryTypeName(props.entryType);
  const stopwatchIsRunning =
    props.mostRecentEntryOfType == null
      ? false
      : entryHasStopwatchRunning(props.mostRecentEntryOfType);
  const elapsedTime =
    props.mostRecentEntryOfType == null
      ? null
      : getTimeElapsedSinceLastEntry(props.mostRecentEntryOfType);
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
        height: "100%",
        padding: `${props.padding}px`,
        width: props.width,
        order: showStopwatch ? -1 : undefined,
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
                id: stopwatchIsRunning
                  ? props.mostRecentEntryOfType?.id
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
                <ActivityIcon
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

type ItemFooterProps = {
  entryType: EntryTypeId;
  mostRecentEntryOfType: Entry | undefined;
  width: string;
  padding: number;
};

function ItemFooter(props: ItemFooterProps) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { user } = useAuthentication();
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
          await dispatch(saveEntryInDB({ entry, user })).unwrap();
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

  return (
    <Box
      key={props.entryType}
      sx={{
        width: props.width,
        order: showStopwatch ? -1 : undefined,
        padding: `${props.padding}px`,
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
              }}
            />
          )}
        </Stack>
      )}
    </Box>
  );
}
