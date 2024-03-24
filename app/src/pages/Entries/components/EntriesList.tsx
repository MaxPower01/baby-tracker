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
import { DateEntries } from "@/pages/Entries/components/DateEntries";
import { DateEntriesHeader } from "@/pages/Entries/components/DateEntriesHeader";
import { DateHeader } from "@/components/DateHeader";
import { Entry } from "@/pages/Entry/types/Entry";
import formatStopwatchTime from "@/utils/formatStopwatchTime";
import { getDateFromTimestamp } from "@/utils/getDateFromTimestamp";
import removeLeadingCharacters from "@/utils/removeLeadingCharacters";

type Props = {
  entries: Entry[];
  groupByDate?: boolean;
};

export default function EntriesList(props: Props) {
  if (props.entries.length === 0) {
    return null;
  }
  const theme = useTheme();

  const [topHeight, setTopHeight] = useState<{
    topbarHeight: number;
    filterChipsHeight: number;
    totalHeight: number;
  } | null>(null);

  useEffect(() => {
    function handleResize() {
      requestAnimationFrame(() => {
        const result = {
          topbarHeight: 0,
          filterChipsHeight: 0,
          totalHeight: 0,
        };
        const topbar = document.getElementById("topbar");
        let topbarHeight = topbar?.clientHeight;
        if (topbarHeight != null) {
          topbarHeight -= 1;
        }
        result.topbarHeight = topbarHeight ?? 0;
        const filterChips =
          document.getElementsByClassName("EntriesFilterChips");
        if (filterChips.length > 0) {
          const filterChipsHeight = filterChips[0].clientHeight - 1;
          result.filterChipsHeight = filterChipsHeight;
        }
        result.totalHeight = result.topbarHeight + result.filterChipsHeight;
        setTopHeight(result);
      });
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  if (props.groupByDate) {
    const entriesByDate = groupEntriesByDate(props.entries);
    return (
      <Stack
        sx={{
          width: "100%",
        }}
      >
        {entriesByDate.years.map((yearEntries) => {
          return yearEntries.months.map((monthEntries) => {
            return monthEntries.days.map((dateEntries) => {
              const entriesOfDate = dateEntries.entries;
              if (entriesOfDate.length === 0) {
                return null;
              }
              const date = getDateFromTimestamp(
                entriesOfDate[0].startTimestamp
              );
              const key = `${yearEntries.year}-${monthEntries.monthIndex}-${dateEntries.dayNumber}-${entriesOfDate[0].id}`;
              return (
                <Stack
                  key={key}
                  spacing={2}
                  sx={{
                    width: "100%",
                  }}
                >
                  <Stack
                    sx={{
                      position: topHeight != null ? "sticky" : undefined,
                      top:
                        topHeight != null ? topHeight.totalHeight : undefined,
                      zIndex: 2,
                      backgroundColor: theme.palette.background.default,
                      width: "100%",
                    }}
                    spacing={2}
                  >
                    <DateEntriesHeader date={date} entries={entriesOfDate} />
                    <DateEntries entries={entriesOfDate} />
                  </Stack>
                </Stack>
              );
            });
          });
        })}
      </Stack>
    );
  }
  return (
    <Stack>
      {props.entries.map((entry, index) => {
        return <div key={index}>Entry: {entry.id}</div>;
      })}
    </Stack>
  );
}
