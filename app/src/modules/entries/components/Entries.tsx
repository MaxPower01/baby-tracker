import {
  Box,
  CircularProgress,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { groupEntriesByDate, groupEntriesByTime } from "@/utils/utils";
import { useEffect, useMemo, useState } from "react";

import DateHeader from "@/common/components/DateHeader";
import EntriesCard from "@/modules/entries/components/EntriesCard";
import MenuProvider from "@/modules/menu/components/MenuProvider";
import TimePeriod from "@/common/enums/TimePeriod";
import useEntries from "@/modules/entries/hooks/useEntries";

type Props = {
  fetchTimePeriod?: TimePeriod;
  useCompactMode?: boolean;
};

export default function Entries(props: Props) {
  const { entries, setEntries, isLoading, getEntries } = useEntries();

  const theme = useTheme();

  const [topbarHeight, setTopbarHeight] = useState<number | null>(null);

  useEffect(() => {
    if (props.fetchTimePeriod != null) {
      getEntries({
        timePeriod: props.fetchTimePeriod,
      }).then((fetchedEntries) => {
        setEntries((prevEntries) => {
          const newEntries = [...prevEntries];
          newEntries.push(...fetchedEntries);
          return newEntries.filter(
            (entry, index, self) =>
              self.findIndex((e) => e.id === entry.id) === index
          );
        });
      });
    }
    function handleResize() {
      const element = document.getElementById("topbar");
      const height = element?.clientHeight;
      if (height != null) {
        setTopbarHeight(height - 1);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const entriesByDate = useMemo(() => {
    if (isLoading || !entries) {
      return null;
    }
    return groupEntriesByDate(entries);
  }, [entries]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!entries || entries.length === 0 || !entriesByDate) {
    return (
      <Typography
        variant="body1"
        sx={{
          textAlign: "center",
          opacity: 0.5,
          fontStyle: "italic",
        }}
      >
        Aucune entrée au cours des 24 dernières heures
      </Typography>
    );
  }

  return (
    <Stack
      spacing={4}
      sx={{
        width: "100%",
      }}
    >
      {entriesByDate.years.map((yearEntries) => {
        return yearEntries.months.map((monthEntries) => {
          return monthEntries.days.map((dayEntries) => {
            if (dayEntries.entries.length === 0) {
              return null;
            }
            const firstEntry = dayEntries.entries[0];
            const startDate = firstEntry.startDate;
            const entriesByTime = groupEntriesByTime({
              entries: dayEntries.entries,
              timeUnit: "minute",
              timeStep: 30,
            });
            return (
              <Stack
                key={`${yearEntries.year}-${monthEntries.monthIndex}-${dayEntries.dayNumber}`}
                spacing={1}
              >
                <DateHeader
                  sx={{
                    position: topbarHeight != null ? "sticky" : undefined,
                    top: topbarHeight != null ? topbarHeight : undefined,
                    zIndex: 2,
                    backgroundColor: theme.palette.background.default,
                  }}
                  startDate={startDate}
                />

                <Stack
                  spacing={props.useCompactMode ? 2 : 4}
                  sx={{
                    paddingTop: 1,
                    paddingBottom: 1,
                  }}
                >
                  {entriesByTime.map((timeEntries) => {
                    return (
                      <MenuProvider
                        key={`${timeEntries.entries[0].startDate.toISOString()}`}
                      >
                        <EntriesCard
                          entries={timeEntries.entries}
                          allEntries={entries}
                          useCompactMode={props.useCompactMode}
                        />
                      </MenuProvider>
                    );
                  })}
                </Stack>
              </Stack>
            );
          });
        });
      })}
    </Stack>
  );
}
