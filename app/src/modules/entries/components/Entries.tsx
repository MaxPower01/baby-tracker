import {
  Box,
  CircularProgress,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  formatStopwatchTime,
  groupEntriesByDate,
  groupEntriesByTime,
} from "@/utils/utils";
import { useEffect, useMemo, useState } from "react";

import ActivityChip from "@/modules/activities/components/ActivityChip";
import ActivityType from "@/modules/activities/enums/ActivityType";
import DateHeader from "@/common/components/DateHeader";
import EntriesCard from "@/modules/entries/components/EntriesCard";
import MenuProvider from "@/modules/menu/components/MenuProvider";
import TimePeriod from "@/common/enums/TimePeriod";
import { selectActivities } from "@/modules/activities/state/activitiesSlice";
import { selectUseCompactMode } from "@/modules/settings/state/settingsSlice";
import useEntries from "@/modules/entries/hooks/useEntries";
import { useSelector } from "react-redux";

type Props = {
  fetchTimePeriod?: TimePeriod;
  title?: string;
};

export default function Entries(props: Props) {
  const { entries, setEntries, isLoading, getEntries } = useEntries();
  const activities = useSelector(selectActivities);
  const useCompactMode = useSelector(selectUseCompactMode);

  const allActivityTypes = useMemo(() => {
    if (entries == null) {
      return [];
    }
    const activityTypes = entries
      .map((entry) => entry.activity?.type)
      .filter((activityType) => activityType != null) as ActivityType[];
    const linkedActivityTypes = entries
      .map((entry) => entry.linkedActivities.map((activity) => activity.type))
      .flat();
    const result =
      [...activityTypes, ...linkedActivityTypes].filter(
        (activityType, index, self) => self.indexOf(activityType) === index
      ) ?? [];
    return result;
  }, [entries]);

  const [selectedActivityTypes, setSelectedActivityTypes] = useState<
    ActivityType[]
  >([]);

  const handleActivityClick = (activityType: ActivityType) => {
    setSelectedActivityTypes((prevSelectedActivityTypes) => {
      let newSelectedActivityTypes = [...prevSelectedActivityTypes];
      if (newSelectedActivityTypes.includes(activityType)) {
        return newSelectedActivityTypes.filter(
          (selectedActivityType) => selectedActivityType !== activityType
        );
      }
      return [...newSelectedActivityTypes, activityType];
    });
  };

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

  const filteredEntries = useMemo(() => {
    if (entries == null) {
      return null;
    }
    return entries.filter((entry) => {
      if (selectedActivityTypes.length === 0) {
        return true;
      }
      if (entry.activity == null) {
        return false;
      }
      return (
        selectedActivityTypes.includes(entry.activity.type) ||
        entry.linkedActivities.some((linkedActivity) =>
          selectedActivityTypes.includes(linkedActivity.type)
        )
      );
    });
  }, [entries, selectedActivityTypes]);

  const entriesByDate = useMemo(() => {
    if (isLoading || !filteredEntries) {
      return null;
    }
    return groupEntriesByDate(filteredEntries);
  }, [filteredEntries]);

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
          color: theme.palette.text.secondary,
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
          color={"text.secondary"}
          gutterBottom
          sx={{
            textAlign: "center",
            // fontStyle: "italic",
          }}
        >
          {props.title}
        </Typography>
      )}
      {allActivityTypes.length > 0 && (
        <Stack spacing={1}>
          <Box
            sx={{
              width: "100%",
              overflowX: "scroll",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            <Stack
              direction={"row"}
              justifyContent={"flex-start"}
              alignItems={"flex-start"}
              spacing={1}
              // sx={{
              //   display: "grid",
              //   gap: 0.5,
              //   gridTemplateColumns: `${allActivityTypes
              //     .map(() => "1fr")
              //     .join(" ")}`,
              // }}
            >
              {activities.map((activity) => {
                const hasAtLeastOneEntry = allActivityTypes.some(
                  (activityType) => activityType === activity.type
                );
                if (!hasAtLeastOneEntry) {
                  return null;
                }
                const activityEntries = entries.filter(
                  (entry) =>
                    entry.activity?.type === activity.type ||
                    entry.linkedActivities.some(
                      (linkedActivity) => linkedActivity.type === activity.type
                    )
                );
                let overrideText = `${activityEntries.length}X`;
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
                  overrideText += ` • ${formatStopwatchTime(
                    time,
                    undefined,
                    undefined,
                    true
                  )}`;
                }
                return (
                  <ActivityChip
                    key={activity.type}
                    activity={activity}
                    overrideText={overrideText}
                    onClick={handleActivityClick}
                    isSelected={selectedActivityTypes.includes(activity.type)}
                  />
                );
              })}
            </Stack>
          </Box>

          {selectedActivityTypes.length > 0 &&
            (() => {
              let label = "";
              if (selectedActivityTypes.length > 1) {
                label = `
                ${selectedActivityTypes.length} types d'entrées sont sélectionnés
                `;
              } else {
                label = `
                  Un type d'entrée est sélectionné
                `;
              }
              return (
                <Typography
                  variant={"body2"}
                  color={"text.secondary"}
                  fontStyle={"italic"}
                  sx={{
                    textAlign: "center",
                    // fontStyle: "italic",
                  }}
                >
                  {label}
                </Typography>
              );
            })()}
        </Stack>
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
                    spacing={useCompactMode ? 2 : 4}
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
    </Stack>
  );
}
