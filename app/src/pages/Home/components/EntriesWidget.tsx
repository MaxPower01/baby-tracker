import {
  Box,
  Button,
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
import {
  selectEntryTypesOrder,
  selectIntervalMethodByEntryTypeId,
} from "@/state/slices/settingsSlice";

import { EntriesWidgetItemBody } from "@/pages/Home/components/EntriesWidgetItemBody";
import { EntriesWidgetItemFooter } from "@/pages/Home/components/EntriesWidgetItemFooter";
import { Entry } from "@/pages/Entry/types/Entry";
import { EntrySubtitle } from "@/pages/Entry/components/EntrySubtitle";
import { EntryTypeIcon } from "@/pages/Activities/components/EntryTypeIcon";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { IntervalMethodId } from "@/pages/Settings/enums/IntervalMethodId";
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
                <EntriesWidgetItemBody
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
                <EntriesWidgetItemFooter
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
