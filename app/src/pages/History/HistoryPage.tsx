import {
  resetFiltersInState,
  selectActivityContextsInFiltersState,
  selectEntryTypesInFiltersState,
  selectSortOrderInFiltersState,
  selectTimePeriodInFiltersState,
} from "@/state/slices/filtersSlice";
import { useCallback, useEffect, useMemo, useState } from "react";

import { ActivityContextsChips } from "@/pages/Activities/components/ActivityContextsChips";
import { DailyEntriesCollection } from "@/types/DailyEntriesCollection";
import { EmptyState } from "@/components/EmptyState";
import { EmptyStateContext } from "@/enums/EmptyStateContext";
import { EntriesList } from "@/components/EntriesList/EntriesList";
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
import { resetFiltersButtonId } from "@/utils/constants";
import { useAppDispatch } from "@/state/hooks/useAppDispatch";
import { useAuthentication } from "@/pages/Authentication/hooks/useAuthentication";
import { useSelector } from "react-redux";

export function HistoryPage() {
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

      {!isFetching &&
        !filteredEntries.length &&
        (entryTypes.length > 0 ? (
          <EmptyState
            context={EmptyStateContext.Entries}
            override={{
              title: "Aucune entrée trouvée",
              description:
                "Aucune entrée ne correspond à vos critères de recherche",
              stickerSource: "/stickers/empty-state--entries.svg",
              buttonLabel: "Réinitialiser les filtres",
              onClick: handleResetButtonClick,
            }}
          />
        ) : (
          <EmptyState
            context={EmptyStateContext.Entries}
            override={{
              title: "Aucune entrée trouvée",
              description:
                "Lorsqu'une entrée est ajoutée dans la période sélectionnée, elle apparaîtra ici.",
              stickerSource: "/stickers/empty-state--entries.svg",
            }}
          />
        ))}

      {!isFetching && filteredEntries.length > 0 && (
        <>
          <EntriesList entries={filteredEntries} format="table" />
        </>
      )}
    </Stack>
  );
}
