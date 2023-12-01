import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { groupEntriesByDate, groupEntriesByTime } from "@/utils/utils";
import { useEffect, useMemo, useState } from "react";

import ActivityChip from "@/pages/Activities/components/ActivityChip";
import ActivityIcon from "@/pages/Activities/components/ActivityIcon";
import ActivityType from "@/pages/Activities/enums/ActivityType";
import CheckIcon from "@mui/icons-material/Check";
import { DateHeader } from "@/components/DateHeader";
import EntriesCard from "@/pages/Entries/components/EntriesCard";
import { EntryType } from "@/pages/Entries/enums/EntryType";
import { MenuProvider } from "@/components/Menu/MenuProvider";
import { TimePeriod } from "@/enums/TimePeriod";
import formatStopwatchTime from "@/utils/formatStopwatchTime";
import removeLeadingCharacters from "@/utils/removeLeadingCharacters";
import { selectActivities } from "@/pages/Activities/state/activitiesSlice";
import { useEntries } from "@/pages/Entries/hooks/useEntries";
import { useSelector } from "react-redux";

type Props = {
  fetchTimePeriod?: TimePeriod;
  title?: string;
};

export default function Entries(props: Props) {
  const { entries, status } = useEntries();
  const activities = useSelector(selectActivities);

  const [selectedActivityTypes, setSelectedActivityTypes] = useState<
    Array<{
      activityType: ActivityType;
      year: number;
      month: number;
      day: number;
    }>
  >([]);

  const theme = useTheme();

  const [topHeight, setTopHeight] = useState<{
    topbarHeight: number;
    filterChipsHeight: number;
    totalHeight: number;
  } | null>(null);

  useEffect(() => {
    function handleResize() {
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
      const filterChips = document.getElementsByClassName("EntriesFilterChips");
      if (filterChips.length > 0) {
        const filterChipsHeight = filterChips[0].clientHeight - 1;
        result.filterChipsHeight = filterChipsHeight;
      }
      result.totalHeight = result.topbarHeight + result.filterChipsHeight;
      setTopHeight(result);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const entriesByDate = useMemo(() => {
    if (status === "loading" || !entries) {
      return null;
    }
    return groupEntriesByDate(entries);
  }, [entries]);

  if (status === "loading") {
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
          color: theme.customPalette.text.secondary,
          // opacity: 0.5,
          // fontStyle: "italic",
        }}
      >
        Aucune entrée au cours des 48 dernières heures
      </Typography>
    );
  }

  return (
    <Stack
      sx={{
        width: "100%",
      }}
      spacing={2}
    >
      {props.title != null && (
        <Typography
          variant={"h6"}
          color={theme.customPalette.text.secondary}
          gutterBottom
          sx={{
            textAlign: "center",
            // fontStyle: "italic",
          }}
        >
          {props.title}
        </Typography>
      )}

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
              const startDate = new Date(firstEntry.startTimestamp);

              const entriesByTime = groupEntriesByTime({
                entries: dayEntries.entries,
                timeUnit: "minute",
                timeStep: 30,
              });
              return (
                <Stack
                  key={`${yearEntries.year}-${monthEntries.monthIndex}-${dayEntries.dayNumber}-${dayEntries.entries[0].id}`}
                  spacing={1}
                >
                  <Stack
                    sx={{
                      position: topHeight != null ? "sticky" : undefined,
                      top:
                        topHeight != null ? topHeight.totalHeight : undefined,
                      zIndex: 2,
                      backgroundColor: theme.palette.background.default,
                    }}
                  >
                    <DateHeader startDate={startDate} />
                    <Box
                      sx={{
                        width: "100%",
                        overflowX: "scroll",
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                        "&::-webkit-scrollbar": {
                          display: "none",
                        },
                        paddingBottom: 1,
                      }}
                    >
                      <Stack
                        direction={"row"}
                        justifyContent={"flex-start"}
                        alignItems={"flex-start"}
                        spacing={1}
                      >
                        {activities.map((activity) => {
                          const hasAtLeastOneEntry = allActivityTypes.some(
                            (activityType) => activityType === activity.type
                          );
                          if (!hasAtLeastOneEntry) {
                            return null;
                          }
                          const activityEntries = dayEntries.entries.filter(
                            (entry) =>
                              entry.activity?.type === activity.type ||
                              entry.linkedActivities.some(
                                (linkedActivity) =>
                                  linkedActivity.type === activity.type
                              )
                          );
                          let text = `${activityEntries.length}X`;
                          const time = !activity.hasDuration
                            ? null
                            : activityEntries
                                .filter(
                                  (entry) =>
                                    entry.activity?.type === activity.type &&
                                    entry.time > 0
                                )
                                .reduce((acc, entry) => acc + entry.time, 0);
                          if (time != null && time > 0) {
                            const timeText = formatStopwatchTime(
                              time,
                              undefined,
                              undefined,
                              true
                            );
                            text += ` • ${removeLeadingCharacters(
                              timeText,
                              "0"
                            )}`;
                          }
                          const isSelected = selectedActivityTypes.some(
                            (selectedActivityType) =>
                              selectedActivityType.activityType ===
                                activity.type &&
                              selectedActivityType.year === yearEntries.year &&
                              selectedActivityType.month ===
                                monthEntries.monthIndex &&
                              selectedActivityType.day === dayEntries.dayNumber
                          );
                          return (
                            <Card
                              key={`${yearEntries.year}-${monthEntries.monthIndex}-${dayEntries.dayNumber}-${activity.type}-${dayEntries.entries[0].id}-2`}
                              sx={{
                                border: "1px solid",
                                borderColor: isSelected
                                  ? (theme.palette.primary.main as string)
                                  : "transparent",
                                backgroundColor: isSelected
                                  ? `${theme.palette.primary.main}30`
                                  : undefined,
                                flexShrink: 0,
                              }}
                            >
                              <CardActionArea>
                                <CardContent
                                  sx={{
                                    paddingTop: 0.5,
                                    paddingBottom: 0.5,
                                    paddingLeft: 1,
                                    paddingRight: 1.5,
                                  }}
                                >
                                  <Stack
                                    direction={"row"}
                                    spacing={0.5}
                                    justifyContent={"flex-start"}
                                    alignItems={"center"}
                                  >
                                    <ActivityIcon
                                      activity={activity}
                                      sx={{ fontSize: "1.5em" }}
                                    />
                                    <Typography
                                      variant="body2"
                                      color={
                                        isSelected
                                          ? "text.main"
                                          : theme.customPalette.text.secondary
                                      }
                                    >
                                      {text}
                                    </Typography>
                                    {isSelected && (
                                      <CheckIcon
                                        sx={{
                                          fontSize: "1.55em",
                                          color: theme.palette.primary.main,
                                        }}
                                      />
                                    )}
                                  </Stack>
                                </CardContent>
                              </CardActionArea>
                            </Card>
                          );
                        })}
                      </Stack>
                    </Box>
                  </Stack>

                  <Stack
                    spacing={2}
                    sx={{
                      paddingTop: 1,
                      paddingBottom: 1,
                    }}
                  >
                    {entriesByTime.map((timeEntries) => {
                      return (
                        <MenuProvider
                          key={`${timeEntries.entries[0].startTimestamp}`}
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
    </Stack>
  );
}
