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
import { EntryTypePicker } from "@/components/EntryTypePicker";
import { EntryTypesChips } from "@/pages/Activities/components/EntryTypesChips";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { SearchToolbar } from "@/components/SearchToolbar";
import { Section } from "@/components/Section";
import { SortOrderId } from "@/enums/SortOrderId";
import { Stack } from "@mui/material";
import { TimePeriodId } from "@/enums/TimePeriodId";
import { entryTypeHasStopwatch } from "@/pages/Entry/utils/entryTypeHasStopwatch";
import { entryTypeHasVolume } from "@/pages/Entry/utils/entryTypeHasVolume";
import { getEntriesFromDailyEntriesCollection } from "@/pages/Entry/utils/getEntriesFromDailyEntriesCollection";
import { getFilteredEntries } from "@/utils/getFilteredEntries";
import { resetFiltersButtonId } from "@/utils/constants";
import { selectEntryTypesOrder } from "@/state/slices/settingsSlice";
import { useAppDispatch } from "@/state/hooks/useAppDispatch";
import { useAuthentication } from "@/pages/Authentication/hooks/useAuthentication";
import { useSelector } from "react-redux";

export function ChartsPage() {
  const { user } = useAuthentication();

  const dispatch = useAppDispatch();

  const timePeriod = useSelector(selectTimePeriodInFiltersState);

  const entryTypesOrder = useSelector(selectEntryTypesOrder);

  const [entryTypeId, setEntryTypeId] = useState<EntryTypeId>(
    entryTypesOrder[0]
  );

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
  }, [user, timePeriod, dispatch, isFetching, lastTimePeriodFetched]);

  const filteredEntries = useMemo(() => {
    if (!entryTypeId) {
      return [];
    }
    return entries.filter((entry) => entry.entryTypeId == entryTypeId);
  }, [entryTypeId]);

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

      {!isFetching && !filteredEntries.length && (
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

      {!isFetching && filteredEntries.length > 0 && (
        <Stack
          spacing={2}
          sx={{
            width: "100%",
          }}
        >
          {entryTypeHasVolume(filteredEntries[0].entryTypeId) && (
            <ChartCard
              entries={filteredEntries}
              timePeriod={timePeriod}
              yAxisUnit="volume"
            />
          )}

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
