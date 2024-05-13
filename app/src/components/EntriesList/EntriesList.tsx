import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Modal,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { GroupedVirtuoso, Virtuoso } from "react-virtuoso";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { groupEntriesByDate, groupEntriesByTime } from "@/utils/utils";

import ActivityIcon from "@/pages/Activities/components/ActivityIcon";
import AutoSizer from "react-virtualized-auto-sizer";
import { CSSBreakpoint } from "@/enums/CSSBreakpoint";
import { DateHeader } from "@/components/DateHeader";
import { EntriesCardsList } from "@/components/EntriesList/CardsFormat/EntriesCardsList";
import { EntriesTable } from "@/components/EntriesList/TableFormat/EntriesTable";
import { Entry } from "@/pages/Entry/types/Entry";
import { EntryTypeChips } from "@/pages/Activities/components/EntryTypeChips";
import { MenuProvider } from "@/components/MenuProvider";
import { addRecentEntryInState } from "@/state/slices/entriesSlice";
import formatStopwatchTime from "@/utils/formatStopwatchTime";
import { getDateFromTimestamp } from "@/utils/getDateFromTimestamp";
import removeLeadingCharacters from "@/utils/removeLeadingCharacters";
import { serializeEntry } from "@/pages/Entry/utils/serializeEntry";
import { useAppDispatch } from "@/state/hooks/useAppDispatch";

type Props = {
  entries: Entry[];
  format: "cards" | "table";
};

export function EntriesList(props: Props) {
  const theme = useTheme();

  const dispatch = useAppDispatch();

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

  const dateEntriesList: Array<Entry[]> = useMemo(() => {
    return Object.values(dateEntriesMap);
  }, [dateEntriesMap]);

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

  const [entryForModal, setEntryForModal] = useState<Entry | null>(null);

  const handleEntriesTableRowClick = useCallback(
    (entry: Entry) => {
      dispatch(addRecentEntryInState({ entry: serializeEntry(entry) }));
      setEntryForModal(entry);
    },
    [dispatch]
  );

  const handleCloseModal = () => {
    setEntryForModal(null);
  };

  if (props.entries.length === 0) {
    return null;
  }

  return (
    <>
      <Virtuoso
        style={{
          width: "100%",
        }}
        useWindowScroll
        data={dateEntriesList}
        itemContent={(index, entries) => {
          return (
            <Stack
              sx={{
                width: "100%",
              }}
              spacing={0}
            >
              <DateHeader
                date={getDateFromTimestamp(entries[0].startTimestamp)}
                sx={{
                  position: topHeight != null ? "sticky" : undefined,
                  top: topHeight != null ? topHeight.totalHeight : undefined,
                  zIndex: 2,
                  backgroundColor: theme.palette.background.default,
                }}
              />

              <Stack
                sx={{
                  width: "100%",
                  paddingBottom: 1,
                  paddingLeft: 0.5,
                  paddingRight: 0.5,
                }}
                spacing={2}
              >
                <EntryTypeChips entries={entries} readonly />

                {props.format === "table" ? (
                  <EntriesTable
                    entries={entries}
                    onRowClick={handleEntriesTableRowClick}
                  />
                ) : (
                  <EntriesCardsList entries={entries} />
                )}
              </Stack>
            </Stack>
          );
        }}
      />

      <Modal
        open={entryForModal !== null}
        onClose={handleCloseModal}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Container component={"main"} maxWidth={CSSBreakpoint.Small}>
          <EntriesCardsList
            entries={[entryForModal as Entry]}
            hideOptionsButton
          />
        </Container>
      </Modal>
    </>
  );
}
