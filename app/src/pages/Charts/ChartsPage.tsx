import {
  fetchHistoryEntriesFromDB,
  resetHistoryEntriesInState,
  selectHistoryEntries,
} from "@/state/slices/entriesSlice";
import {
  resetFiltersInState,
  selectActivityContextsInFiltersState,
  selectEntryTypesInFiltersState,
  selectSortOrderInFiltersState,
  selectTimePeriodInFiltersState,
} from "@/state/slices/filtersSlice";
import { useCallback, useEffect, useMemo, useState } from "react";

import { ActivityContextsChips } from "@/pages/Activities/components/ActivityContextsChips";
import { BarChart } from "@/pages/Charts/components/BarChart";
import { ChartCard } from "@/pages/Charts/components/ChartCard";
import { DailyEntriesCollection } from "@/types/DailyEntriesCollection";
import { EmptyState } from "@/components/EmptyState";
import { EmptyStateContext } from "@/enums/EmptyStateContext";
import { EntriesList } from "@/components/EntriesList/EntriesList";
import { Entry } from "@/pages/Entry/types/Entry";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { EntryTypesChips } from "@/pages/Activities/components/EntryTypesChips";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { SearchToolbar } from "@/components/Filters/SearchToolbar";
import { Section } from "@/components/Section";
import { SortOrderId } from "@/enums/SortOrderId";
import { Stack } from "@mui/material";
import { TimePeriodId } from "@/enums/TimePeriodId";
import { entryTypeHasStopwatch } from "@/pages/Entry/utils/entryTypeHasStopwatch";
import { getEntriesFromDailyEntriesCollection } from "@/pages/Entry/utils/getEntriesFromDailyEntriesCollection";
import { getFilteredEntries } from "@/utils/getFilteredEntries";
import { resetFiltersButtonId } from "@/utils/constants";
import { useAppDispatch } from "@/state/hooks/useAppDispatch";
import { useAuthentication } from "@/pages/Authentication/hooks/useAuthentication";
import { useSelector } from "react-redux";

export function ChartsPage() {
  const { user } = useAuthentication();

  const dispatch = useAppDispatch();

  const timePeriod = useSelector(selectTimePeriodInFiltersState);
  const entryTypes = useSelector(selectEntryTypesInFiltersState);
  const sortOrder = useSelector(selectSortOrderInFiltersState);
  const activityContexts = useSelector(selectActivityContextsInFiltersState);

  const [isFetching, setIsFetching] = useState(false);
  const [lastTimePeriodFetched, setLastTimePeriodIdFetched] =
    useState<TimePeriodId | null>(null);

  const [entries, setEntries] = useState<Entry[]>([]);

  const handleResetButtonClick = useCallback(() => {
    dispatch(
      resetFiltersInState({
        keepTimePeriod: true,
      })
    );
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetFiltersInState());
    };
  }, []);

  useEffect(() => {
    if (
      user?.babyId != null &&
      !isFetching &&
      lastTimePeriodFetched != timePeriod
    ) {
      setIsFetching(true);
      setLastTimePeriodIdFetched(timePeriod);

      dispatch(
        fetchHistoryEntriesFromDB({
          babyId: user.babyId,
          timePeriodId: timePeriod,
        })
      )
        .then((result) => {
          if (result.meta.requestStatus === "rejected") {
            if (typeof result.payload === "string") {
              console.error(result.payload);
            }
          }
          const dailyEntriesCollection =
            result.payload as DailyEntriesCollection;
          const entries = getEntriesFromDailyEntriesCollection(
            dailyEntriesCollection
          );
          setEntries(entries);
          setIsFetching(false);
        })
        .catch((err) => {
          setIsFetching(false);
          console.error(err);
        })
        .finally(() => {
          setIsFetching(false);
        });
    }
  }, [
    user,
    timePeriod,
    dispatch,
    isFetching,
    entryTypes,
    sortOrder,
    lastTimePeriodFetched,
  ]);

  const filteredEntries = useMemo(() => {
    return getFilteredEntries(entries, entryTypes, sortOrder, activityContexts);
  }, [entries, entryTypes, sortOrder, activityContexts]);

  return (
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
            entryTypeIdFilterMode: "single",
          }}
        />

        {!isFetching && (
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

      {isFetching && <LoadingIndicator />}

      {!isFetching &&
        !filteredEntries.length &&
        (entryTypes.length > 0 ? (
          <EmptyState
            context={EmptyStateContext.Graphics}
            override={{
              title: "Aucune entrée trouvée",
              description:
                "Aucune entrée ne correspond à vos critères de recherche",
              stickerSource: "/stickers/empty-state--graphics.svg",
              buttonLabel: "Réinitialiser les filtres",
              onClick: handleResetButtonClick,
            }}
          />
        ) : (
          <EmptyState
            context={EmptyStateContext.Graphics}
            override={{
              title: "Aucune entrée trouvée",
              description:
                "Lorsqu'une entrée est ajoutée dans la période sélectionnée, elle apparaîtra ici.",
              stickerSource: "/stickers/empty-state--graphics.svg",
            }}
          />
        ))}

      {!isFetching && filteredEntries.length > 0 && (
        <Stack
          spacing={2}
          sx={{
            width: "100%",
          }}
        >
          {entryTypeHasStopwatch(filteredEntries[0].entryTypeId) && (
            <ChartCard
              entries={filteredEntries}
              timePeriod={timePeriod}
              yAxisUnit="duration"
            />
          )}

          <ChartCard
            entries={filteredEntries}
            timePeriod={timePeriod}
            yAxisUnit="count"
          />
        </Stack>
      )}
    </Stack>
  );
}
