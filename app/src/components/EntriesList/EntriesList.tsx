import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { groupEntriesByDate, groupEntriesByTime } from "@/utils/utils";

import ActivityIcon from "@/pages/Activities/components/ActivityIcon";
import AutoSizer from "react-virtualized-auto-sizer";
import { DateHeader } from "@/components/DateHeader";
import { EntriesCardsList } from "@/components/EntriesList/CardsFormat/EntriesCardsList";
import { EntriesDateHeader } from "@/components/EntriesList/EntriesDateHeader";
import { EntriesTable } from "@/components/EntriesList/TableFormat/EntriesTable";
import { Entry } from "@/pages/Entry/types/Entry";
import { MenuProvider } from "@/components/MenuProvider";
import formatStopwatchTime from "@/utils/formatStopwatchTime";
import { getDateFromTimestamp } from "@/utils/getDateFromTimestamp";
import removeLeadingCharacters from "@/utils/removeLeadingCharacters";

type Props = {
  entries: Entry[];
  format: "cards" | "table";
};

export function EntriesList(props: Props) {
  if (props.entries.length === 0) {
    return null;
  }

  const groupedEntries = groupEntriesByDate(props.entries);
  const dateEntriesMap: Record<string, Entry[]> = {};
  for (const year of groupedEntries.years) {
    for (const month of year.months) {
      for (const day of month.days) {
        const entries = day.entries;
        if (!entries.length) {
          continue;
        }
        const yearString = year.year.toString();
        const monthString = (month.monthIndex + 1).toString().padStart(2, "0");
        const dayString = day.dayNumber.toString().padStart(2, "0");
        const key = `${yearString}-${monthString}-${dayString}`;
        dateEntriesMap[key] = entries;
      }
    }
  }
  return (
    <Stack
      sx={{
        width: "100%",
      }}
      spacing={4}
    >
      {Object.entries(dateEntriesMap).map(([dateKey, entries]) => {
        if (entries.length === 0) {
          return null;
        }

        return (
          <Stack
            key={dateKey}
            spacing={2}
            sx={{
              width: "100%",
            }}
          >
            {props.format === "table" ? (
              <EntriesTable entries={entries} />
            ) : (
              <EntriesCardsList entries={entries} />
            )}
          </Stack>
        );
      })}
    </Stack>
  );
}
