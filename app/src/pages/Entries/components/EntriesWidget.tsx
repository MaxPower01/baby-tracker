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
import React, { useEffect } from "react";

import ActivityIcon from "@/pages/Activities/components/ActivityIcon";
import { Entry } from "@/pages/Entry/types/Entry";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { StopwatchContainer } from "@/components/StopwatchContainer";
import { entryHasStopwatchRunning } from "@/pages/Entry/utils/entryHasStopwatchRunning";
import { entryTypeHasSides } from "@/pages/Entry/utils/entryTypeHasSides";
import { getEntryTime } from "@/pages/Entry/utils/getEntryTime";
import { getEntryTypeName } from "@/utils/getEntryTypeName";
import { getTimeElapsedSinceLastEntry } from "@/utils/getTimeElapsedSinceLastEntry";
import { selectOrderedEntryTypes } from "@/state/slices/entriesSlice";
import { useSelector } from "react-redux";

type Props = {
  entries: Entry[];
};

export function EntriesWidget(props: Props) {
  const theme = useTheme();
  const orderedEntryTypes = useSelector(selectOrderedEntryTypes);
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
  if (orderedEntryTypes.length === 0) {
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
        <Stack spacing={1}>
          <Stack
            direction={"row"}
            sx={{
              display: "grid",
              gap: 0.5,
              gridTemplateColumns: `${orderedEntryTypes
                .map(() => "1fr")
                .join(" ")}`,
            }}
          >
            {orderedEntryTypes.map((entryType, index) => {
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
              gridTemplateColumns: `${orderedEntryTypes
                .map(() => "1fr")
                .join(" ")}`,
            }}
          >
            {orderedEntryTypes.map((entryType, index) => {
              return (
                <ItemFooter
                  key={entryType}
                  entryType={entryType}
                  width={itemWidth}
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
  const name = getEntryTypeName(props.entryType);
  const stopwatchIsRunning =
    props.mostRecentEntryOfType == null
      ? false
      : entryHasStopwatchRunning(props.mostRecentEntryOfType);
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
      }}
    >
      <Card
        sx={{
          border: "1px solid",
          borderColor: stopwatchIsRunning
            ? (`${theme.palette.primary.main}50` as string)
            : "transparent",
          backgroundColor: stopwatchIsRunning
            ? `${theme.palette.primary.main}30`
            : undefined,
          boxShadow: stopwatchIsRunning
            ? `0 0 5px 0px ${theme.palette.primary.main}`
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
};

function ItemFooter(props: ItemFooterProps) {
  const theme = useTheme();
  if (props.mostRecentEntryOfType == null) {
    return null;
  }
  const elapsedTime = getTimeElapsedSinceLastEntry(props.mostRecentEntryOfType);
  const stopwatchIsRunning = entryHasStopwatchRunning(
    props.mostRecentEntryOfType
  );
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

  return (
    <Box
      key={props.entryType}
      sx={{
        width: props.width,
      }}
    >
      {stopwatchIsRunning && (
        <Stack
          sx={{
            width: "100%",
          }}
        >
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
          />
          <Typography
            variant={"body2"}
            sx={{
              textAlign: "center",
              color: theme.customPalette.text.tertiary,
              lineHeight: 1.2,
            }}
          >
            {elapsedTime.label}
          </Typography>
        </Stack>
      )}
    </Box>
  );
}
