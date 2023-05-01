import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { useMemo } from "react";
import { getMonthName, groupEntries } from "../../../lib/utils";
import useEntries from "../hooks/useEntries";
import DateEntriesCard from "./DateEntriesCard";

export default function Entries() {
  const { entries, isLoading } = useEntries();

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
          return (
            <Stack
              key={`${yearEntries.year}-${monthEntries.monthIndex}`}
              spacing={2}
            >
              {monthEntries.days?.length > 0 && (
                <Typography
                  variant="body1"
                  textAlign={"center"}
                  fontWeight={"bold"}
                >
                  {getMonthName(monthEntries.monthIndex)} {yearEntries.year}
                </Typography>
              )}
              {!anyEntriesInMonth && (
                <Typography
                  variant="body2"
                  textAlign={"center"}
                  sx={{
                    opacity: 0.5,
                  }}
                >
                  Aucune entrée
                </Typography>
              )}
              {monthEntries.days.map((dayEntries) => {
                return (
                  <DateEntriesCard
                    key={`${yearEntries.year}-${monthEntries.monthIndex}-${dayEntries.dayNumber}`}
                    entries={dayEntries.entries}
                  />
                );
              })}
            </Stack>
          );
        });
      })}
    </Stack>
  );
}
