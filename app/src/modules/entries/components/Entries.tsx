import { groupEntries } from "@/lib/utils";
import {
  Box,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import useEntries from "../hooks/useEntries";
import DateEntriesCard from "./DateEntriesCard";

export default function Entries() {
  const { entries, isLoading } = useEntries();

  const [topbarHeight, setTopbarHeight] = useState<number | null>(null);

  useEffect(() => {
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

  const groupedEntries = useMemo(() => {
    if (isLoading || !entries) {
      return null;
    }
    return groupEntries(entries);
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

  if (!entries || entries.length === 0 || !groupedEntries) {
    return <div>Aucune entrée</div>;
  }

  return (
    <Stack spacing={4}>
      {groupedEntries.years.map((yearEntries) => {
        return yearEntries.months.map((monthEntries) => {
          const anyEntriesInMonth = monthEntries.days.some(
            (dayEntries) => dayEntries.entries.length > 0
          );
          return monthEntries.days.map((dayEntries) => {
            if (dayEntries.entries.length === 0) {
              return null;
            }

            return (
              <Stack
                key={`${yearEntries.year}-${monthEntries.monthIndex}-${dayEntries.dayNumber}`}
                spacing={2}
              >
                <Container
                  sx={{
                    position: topbarHeight != null ? "sticky" : undefined,
                    top: topbarHeight != null ? topbarHeight : undefined,
                    paddingTop: 1,
                    paddingBottom: 1,
                    backgroundColor: "background.paper",
                    zIndex: 1,
                  }}
                >
                  <Typography
                    variant="body1"
                    textAlign={"center"}
                    paddingTop="1px"
                  >
                    {dayEntries.entries[0].startDate
                      .toDate()
                      .toLocaleDateString("fr-CA", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                  </Typography>
                </Container>
                <DateEntriesCard
                  // key={`${yearEntries.year}-${monthEntries.monthIndex}-${dayEntries.dayNumber}`}
                  entries={dayEntries.entries}
                />
              </Stack>
            );
          });
        });
      })}
    </Stack>
  );
}
