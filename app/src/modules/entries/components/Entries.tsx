import {
  groupEntriesByDate,
  groupEntriesByTime,
  upperCaseFirst,
} from "@/lib/utils";
import MenuProvider from "@/modules/menu/components/MenuProvider";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import useEntries from "../hooks/useEntries";
import EntriesCard from "./EntriesCard";

export default function Entries() {
  const { entries, isLoading } = useEntries();
  const theme = useTheme();

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
    <Stack spacing={4}>
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
              timeUnit: "hour",
              timeStep: 1,
            });
            return (
              <Stack
                key={`${yearEntries.year}-${monthEntries.monthIndex}-${dayEntries.dayNumber}`}
                spacing={4}
              >
                <Box
                  sx={{
                    position: topbarHeight != null ? "sticky" : undefined,
                    top: topbarHeight != null ? topbarHeight : undefined,
                    zIndex: 2,
                    backgroundColor: theme.palette.background.paper,
                  }}
                >
                  <Button
                    sx={{
                      padding: 1,
                      borderRadius: 0,
                      textTransform: "none",
                      color: theme.palette.text.primary,
                    }}
                    fullWidth
                    variant="text"
                  >
                    <Stack
                      direction={"row"}
                      justifyContent={"flex-start"}
                      alignItems={"center"}
                      spacing={2}
                      sx={{
                        width: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          background: theme.customPalette.background.avatar,
                          minWidth: "3em",
                          minHeight: "3em",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: 1,
                        }}
                      >
                        <Typography
                          variant="h5"
                          textAlign={"center"}
                          fontWeight={"bold"}
                        >
                          {startDate.toLocaleDateString("fr-CA", {
                            day: "numeric",
                          })}
                        </Typography>
                      </Box>
                      <Stack
                        spacing={1}
                        sx={{
                          paddingTop: 1,
                          paddingBottom: 1,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            lineHeight: 1,
                          }}
                        >
                          {upperCaseFirst(
                            startDate.toLocaleDateString("fr-CA", {
                              weekday: "long",
                            })
                          )}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          textAlign={"left"}
                          sx={{
                            opacity: 0.5,
                            lineHeight: 1,
                          }}
                        >
                          {upperCaseFirst(
                            startDate.toLocaleDateString("fr-CA", {
                              month: "long",
                              year: "numeric",
                            })
                          )}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Button>
                </Box>

                <Stack spacing={4}>
                  {entriesByTime.map((timeEntries) => {
                    return (
                      <MenuProvider
                        key={`${timeEntries.entries[0].startDate.toISOString()}`}
                      >
                        <EntriesCard entries={timeEntries.entries} />
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
