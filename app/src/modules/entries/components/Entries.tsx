import DateHeader from "@/common/components/DateHeader";
import TimePeriod from "@/common/enums/TimePeriod";
import { groupEntriesByDate, groupEntriesByTime } from "@/lib/utils";
import EntriesCard from "@/modules/entries/components/EntriesCard";
import useEntries from "@/modules/entries/hooks/useEntries";
import MenuProvider from "@/modules/menu/components/MenuProvider";
import { Box, CircularProgress, Stack, useTheme } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

type Props = {
  fetchTimePeriod?: TimePeriod;
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
    return <div>Aucune entrée</div>;
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
                  spacing={4}
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
