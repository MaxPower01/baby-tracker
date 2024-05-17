import {
  fetchHistoryEntriesFromDB,
  resetHistoryEntriesInState,
  selectHistoryEntries,
} from "@/state/slices/entriesSlice";
import {
  selectEntryTypesInFiltersState,
  selectSortOrderInFiltersState,
  selectTimePeriodInFiltersState,
} from "@/state/slices/filtersSlice";
import { useEffect, useMemo, useState } from "react";

import { DailyEntriesCollection } from "@/types/DailyEntriesCollection";
import { EmptyState } from "@/components/EmptyState";
import { EmptyStateContext } from "@/enums/EmptyStateContext";
import { EntriesList } from "@/components/EntriesList/EntriesList";
import { Entry } from "@/pages/Entry/types/Entry";
import { EntryTypeChips } from "@/pages/Activities/components/EntryTypeChips";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { SearchToolbar } from "@/components/Filters/SearchToolbar";
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

  const [isFetching, setIsFetching] = useState(false);
  const [lastTimePeriodFetched, setLastTimePeriodIdFetched] =
    useState<TimePeriodId | null>(null);

  const [entries, setEntries] = useState<Entry[]>([]);

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

  useEffect(() => {
    return () => {
      dispatch(resetHistoryEntriesInState());
    };
  }, []);

  const filteredEntries = useMemo(() => {
    return getFilteredEntries(entries, entryTypes, sortOrder);
  }, [entries, entryTypes, sortOrder]);

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
        <SearchToolbar />

        {!isFetching && (
          <EntryTypeChips entries={entries} useFiltersEntryTypes />
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
              onClick: () => {
                // const resetFiltersButton =
                //   document.getElementById(resetFiltersButtonId);
                // if (resetFiltersButton != null) {
                //   resetFiltersButton.click();
                // }
                // setSelectedEntryTypes([]);
              },
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
