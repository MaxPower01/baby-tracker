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
import { DateHeader } from "@/components/DateHeader";
import { Entry } from "@/pages/Entry/types/Entry";
import formatStopwatchTime from "@/utils/formatStopwatchTime";
import { getDateFromTimestamp } from "@/utils/getDateFromTimestamp";
import removeLeadingCharacters from "@/utils/removeLeadingCharacters";

type EntriesStackProps = {
  entries: Entry[];
};

function EntriesStack(props: EntriesStackProps) {
  return (
    <Stack>
      {props.entries.map((entry, index) => {
        return <div key={index}>Entry: {entry.id}</div>;
      })}
    </Stack>
  );
}

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
              const entriesByTime = groupEntriesByTime({
                entries: entriesOfDate,
                timeUnit: "minute",
                timeStep: 30,
              });
              const key = `${yearEntries.year}-${monthEntries.monthIndex}-${dateEntries.dayNumber}-${entriesOfDate[0].id}`;
              return (
                <Stack
                  key={key}
                  spacing={1}
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
                  >
                    <DateHeader date={date} />
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
                        <div>Activities</div>
                        {/* {activities.map((activity) => {
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
                          // const isSelected = selectedActivityTypes.includes(
                          //   activity.type
                          // );
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
                              <CardActionArea
                                onClick={() =>
                                  handleActivityClick({
                                    activityType: activity.type,
                                    year: yearEntries.year,
                                    month: monthEntries.monthIndex,
                                    day: dayEntries.dayNumber,
                                  })
                                }
                              >
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
                        })} */}
                      </Stack>
                    </Box>
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
