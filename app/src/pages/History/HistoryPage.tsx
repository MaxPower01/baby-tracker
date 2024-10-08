import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ActivityContextsChips } from "@/pages/Activities/components/ActivityContextsChips";
import { DailyEntriesCollection } from "@/types/DailyEntriesCollection";
import { EmptyState } from "@/components/EmptyState";
import { EmptyStateContext } from "@/enums/EmptyStateContext";
import { EntriesList } from "@/components/Entries/EntriesList/EntriesList";
import { Entry } from "@/pages/Entry/types/Entry";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { EntryTypesChips } from "@/pages/Activities/components/EntryTypesChips";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { PageLayout } from "@/components/PageLayout";
import { SearchToolbar } from "@/components/SearchToolbar";
import { Section } from "@/components/Section";
import { SortOrderId } from "@/enums/SortOrderId";
import { Stack } from "@mui/material";
import { TimePeriodId } from "@/enums/TimePeriodId";
import { filterTimePeriodEntries } from "@/utils/filterTimePeriodEntries";
import { getEntriesFromDailyEntries } from "@/utils/getEntriesFromDailyEntries";
import { getEntriesFromDailyEntriesCollection } from "@/pages/Entry/utils/getEntriesFromDailyEntriesCollection";
import { getFilteredEntries } from "@/utils/getFilteredEntries";
import { getStartTimestampForTimePeriod } from "@/utils/getStartTimestampForTimePeriod";
import { isNullOrWhiteSpace } from "@/utils/utils";
import { resetFiltersButtonId } from "@/utils/constants";
import { selectEntryTypesOrder } from "@/state/slices/settingsSlice";
import { useAppDispatch } from "@/state/hooks/useAppDispatch";
import { useAuthentication } from "@/pages/Authentication/hooks/useAuthentication";
import { useEntries } from "@/components/Entries/EntriesProvider";
import { useFilters } from "@/components/Filters/FiltersProvider";
import { useSelector } from "react-redux";

export function HistoryPage() {
  const { timePeriod, entryTypes, sortOrder, activityContexts, reset } =
    useFilters();
  const { recentEntries, getDailyEntries, status } = useEntries();

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

    if (status === "busy") {
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
  }, [timePeriod, entryTypeId, recentEntries, status]);

  useEffect(() => {
    return () => {
      reset();
      cache.current = {};
    };
  }, []);

  const filteredEntries = useMemo(
    () => getFilteredEntries(entries, entryTypes, sortOrder, activityContexts),
    [entries, entryTypes, sortOrder, activityContexts]
  );

  return (
    <PageLayout>
      <Stack
        spacing={4}
        sx={{
          width: "100%",
        }}
      >
        <Stack
          spacing={2}
          sx={{
            width: "100%",
          }}
        >
          <SearchToolbar
            filtersProps={{
              entryTypeIdFilterMode: "multiple",
            }}
          />

          {status === "idle" && (
            <>
              <EntryTypesChips
                entries={entries}
                useFiltersEntryTypes
                useChipLabel
              />
              <ActivityContextsChips />
            </>
          )}
        </Stack>

        {status === "busy" && <LoadingIndicator />}

        {!filteredEntries.length && status === "idle" && (
          <EmptyState
            context={EmptyStateContext.Entries}
            override={{
              title: "Aucune entrée trouvée",
              description:
                "Aucune entrée ne correspond à vos critères de recherche",
              stickerSource: "/stickers/empty-state--entries.svg",
              buttonLabel: "Réinitialiser les filtres",
              onClick: () => reset(),
            }}
          />
        )}

        {filteredEntries.length > 0 && (
          <Stack
            spacing={2}
            sx={{
              width: "100%",
            }}
          >
            <EntriesList entries={filteredEntries} format="table" />
          </Stack>
        )}
      </Stack>
    </PageLayout>
  );
}
