import { useCallback, useEffect, useMemo, useState } from "react";

import { ActivityContextsChips } from "@/pages/Activities/components/ActivityContextsChips";
import { DailyEntriesCollection } from "@/types/DailyEntriesCollection";
import { EmptyState } from "@/components/EmptyState";
import { EmptyStateContext } from "@/enums/EmptyStateContext";
import { EntriesList } from "@/components/Entries/EntriesList/EntriesList";
import { Entry } from "@/pages/Entry/types/Entry";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { EntryTypesChips } from "@/pages/Activities/components/EntryTypesChips";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { SearchToolbar } from "@/components/SearchToolbar";
import { Section } from "@/components/Section";
import { SortOrderId } from "@/enums/SortOrderId";
import { Stack } from "@mui/material";
import { TimePeriodId } from "@/enums/TimePeriodId";
import { getEntriesFromDailyEntriesCollection } from "@/pages/Entry/utils/getEntriesFromDailyEntriesCollection";
import { getFilteredEntries } from "@/utils/getFilteredEntries";
import { getStartTimestampForTimePeriod } from "@/utils/getStartTimestampForTimePeriod";
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
  const { recentEntries } = useEntries();

  const entryTypesOrder = useSelector(selectEntryTypesOrder);
  const defaultEntryType = entryTypesOrder[0];
  const [entryTypeId, setEntryTypeId] = useState<EntryTypeId>(defaultEntryType);

  const recentTimePeriods = [TimePeriodId.Last24Hours, TimePeriodId.Last2Days];

  const [entries, setEntries] = useState<Entry[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    setIsFetching(true);

    if (recentTimePeriods.includes(timePeriod)) {
      if (recentEntries.length) {
        const newEntries = recentEntries.filter(
          (entry) =>
            entry.startTimestamp >=
              getStartTimestampForTimePeriod(timePeriod) &&
            entry.entryTypeId == entryTypeId
        );
        setEntries(newEntries);
      } else {
        setEntries([]);
      }

      setIsFetching(false);
    }
  }, [timePeriod, entryTypeId, recentEntries]);

  useEffect(() => {
    return () => {
      reset();
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

      {!entries.length && !isFetching && (
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

      {entries.length > 0 && (
        <Stack
          spacing={2}
          sx={{
            width: "100%",
          }}
        >
          <EntriesList entries={entries} format="table" />
        </Stack>
      )}
    </Stack>
  );
}
