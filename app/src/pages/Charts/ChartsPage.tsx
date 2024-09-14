import { useEffect, useMemo, useRef, useState } from "react";

import { ChartCard } from "@/pages/Charts/components/ChartCard";
import { EmptyState } from "@/components/EmptyState";
import { EmptyStateContext } from "@/enums/EmptyStateContext";
import { Entry } from "@/pages/Entry/types/Entry";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { EntryTypePicker } from "@/components/EntryTypePicker";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { SearchToolbar } from "@/components/SearchToolbar";
import { Stack } from "@mui/material";
import { TimePeriodId } from "@/enums/TimePeriodId";
import { entryTypeHasStopwatch } from "@/pages/Entry/utils/entryTypeHasStopwatch";
import { entryTypeHasVolume } from "@/pages/Entry/utils/entryTypeHasVolume";
import { filterTimePeriodEntries } from "@/utils/filterTimePeriodEntries";
import { getEntriesFromDailyEntries } from "@/utils/getEntriesFromDailyEntries";
import { getStartTimestampForTimePeriod } from "@/utils/getStartTimestampForTimePeriod";
import { isNullOrWhiteSpace } from "@/utils/utils";
import { selectEntryTypesOrder } from "@/state/slices/settingsSlice";
import { useAuthentication } from "@/pages/Authentication/hooks/useAuthentication";
import { useEntries } from "@/components/Entries/EntriesProvider";
import { useFilters } from "@/components/Filters/FiltersProvider";
import { useSelector } from "react-redux";

export function ChartsPage() {
  const { timePeriod, reset } = useFilters();
  const { recentEntries, getDailyEntries, isFetching } = useEntries();

  const { user } = useAuthentication();

  // TODO: Optimize the cache to make sure that the same entries aren't stored in multiple time periods
  // e.g. if the user switches from Last7Days to Last14Days, the entries from the last 7 days should be reused
  // and in the Last14Days time period, only the new entries should be cached
  const cache = useRef<{ [timePeriod: string]: Entry[] }>({});

  const entryTypesOrder = useSelector(selectEntryTypesOrder);
  const defaultEntryType = entryTypesOrder[0];
  const [entryTypeId, setEntryTypeId] = useState<EntryTypeId>(defaultEntryType);

  const recentTimePeriods = [TimePeriodId.Last24Hours, TimePeriodId.Last2Days];

  const [entries, setEntries] = useState<Entry[]>(
    filterTimePeriodEntries(recentEntries, timePeriod)
  );

  useEffect(() => {
    if (!user || isNullOrWhiteSpace(user?.babyId ?? "")) {
      return;
    }

    if (recentTimePeriods.includes(timePeriod)) {
      const newEntries = filterTimePeriodEntries(recentEntries, timePeriod);
      setEntries(newEntries);
      return;
    }

    if (isFetching) {
      return;
    }

    if (cache.current[timePeriod]) {
      setEntries(cache.current[timePeriod]);
      return;
    }

    getDailyEntries({
      range: timePeriod,
      babyId: user.babyId,
    })
      .then((dailyEntries) => {
        const newEntries = getEntriesFromDailyEntries(dailyEntries);
        const newEntriesFiltered = filterTimePeriodEntries(
          newEntries,
          timePeriod
        );
        cache.current[timePeriod] = newEntriesFiltered;
        setEntries(newEntriesFiltered);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [timePeriod, entryTypeId, recentEntries, isFetching]);

  useEffect(() => {
    return () => {
      reset();
      cache.current = {};
    };
  }, []);

  return (
    <Stack
      spacing={4}
      sx={{
        width: "100%",
      }}
    >
      <Stack
        spacing={1}
        sx={{
          width: "100%",
        }}
      >
        <EntryTypePicker value={entryTypeId} setValue={setEntryTypeId} />

        <SearchToolbar
          filtersProps={{
            entryTypeIdFilterMode: "multiple",
          }}
          hideFilters
        />
      </Stack>

      {isFetching && <LoadingIndicator />}

      {!entries.length && !isFetching && (
        <EmptyState
          context={EmptyStateContext.Graphics}
          override={{
            title: "Aucune entrée trouvée",
            description:
              "Lorsqu'une entrée est ajoutée dans la période sélectionnée, elle apparaîtra ici.",
            stickerSource: "/stickers/empty-state--graphics.svg",
          }}
        />
      )}

      {entries.length > 0 && !isFetching && (
        <Stack
          spacing={2}
          sx={{
            width: "100%",
          }}
        >
          {entryTypeHasVolume(entryTypeId) && (
            <ChartCard
              entries={entries}
              entryTypeId={entryTypeId}
              timePeriod={timePeriod}
              yAxisType="volume"
            />
          )}

          {entryTypeHasStopwatch(entryTypeId) && (
            <ChartCard
              entries={entries}
              entryTypeId={entryTypeId}
              timePeriod={timePeriod}
              yAxisType="duration"
            />
          )}

          <ChartCard
            entries={entries}
            entryTypeId={entryTypeId}
            timePeriod={timePeriod}
            yAxisType="count"
          />
        </Stack>
      )}
    </Stack>
  );
}
