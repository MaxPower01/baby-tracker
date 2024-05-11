import {
  fetchHistoryEntriesFromDB,
  resetHistoryEntriesInState,
  selectHistoryEntries,
} from "@/state/slices/entriesSlice";
import { useEffect, useMemo, useState } from "react";

import { DailyEntriesCollection } from "@/types/DailyEntriesCollection";
import { EmptyState } from "@/components/EmptyState";
import { EmptyStateContext } from "@/enums/EmptyStateContext";
import { EntriesList } from "@/components/EntriesList/EntriesList";
import { Entry } from "@/pages/Entry/types/Entry";
import { EntryTypeChips } from "@/pages/Activities/components/EntryTypeChips";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { SearchToolbar } from "@/pages/History/components/SearchToolbar";
import { Section } from "@/components/Section";
import { SortOrderId } from "@/enums/SortOrderId";
import { Stack } from "@mui/material";
import { TimePeriodId } from "@/enums/TimePeriodId";
import { getEntriesFromDailyEntriesCollection } from "@/pages/Entry/utils/getEntriesFromDailyEntriesCollection";
import { resetFiltersButtonId } from "@/utils/constants";
import { useAppDispatch } from "@/state/hooks/useAppDispatch";
import { useAuthentication } from "@/pages/Authentication/hooks/useAuthentication";
import { useSelector } from "react-redux";

export function HistoryPage() {
  const { user } = useAuthentication();

  const dispatch = useAppDispatch();

  const [isFetching, setIsFetching] = useState(false);
  const [lastTimePeriodIdFetched, setLastTimePeriodIdFetched] =
    useState<TimePeriodId | null>(null);

  const [timePeriodId, setTimePeriodId] = useState(TimePeriodId.Today);

  const [selectedEntryTypes, setSelectedEntryTypes] = useState<EntryTypeId[]>(
    []
  );

  const [selectedSortOrder, setSelectedSortOrder] = useState(
    SortOrderId.DateDesc
  );

  // const [entries, setEntries] = useState<Entry[]>([]);
  const entries = useSelector(selectHistoryEntries);

  useEffect(() => {
    if (
      user?.babyId != null &&
      !isFetching &&
      lastTimePeriodIdFetched != timePeriodId
    ) {
      setIsFetching(true);
      setLastTimePeriodIdFetched(timePeriodId);

      dispatch(fetchHistoryEntriesFromDB({ babyId: user.babyId, timePeriodId }))
        .then((result) => {
          if (result.meta.requestStatus === "rejected") {
            if (typeof result.payload === "string") {
              console.error(result.payload);
            }
          }
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
    timePeriodId,
    dispatch,
    isFetching,
    selectedEntryTypes,
    selectedSortOrder,
    lastTimePeriodIdFetched,
  ]);

  useEffect(() => {
    return () => {
      dispatch(resetHistoryEntriesInState());
    };
  }, []);

  const filteredEntries = useMemo(() => {
    let newEntries = entries;

    if (selectedEntryTypes.length > 0) {
      newEntries = newEntries.filter((entry) =>
        selectedEntryTypes.includes(entry.entryTypeId)
      );
    }

    if (selectedSortOrder === SortOrderId.DateDesc) {
      newEntries = newEntries.sort(
        (a, b) => b.startTimestamp - a.startTimestamp
      );
    } else if (selectedSortOrder === SortOrderId.DateAsc) {
      newEntries = newEntries.sort(
        (a, b) => a.startTimestamp - b.startTimestamp
      );
    }

    return newEntries;
  }, [entries, selectedEntryTypes, selectedSortOrder]);

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
          timePeriodId={timePeriodId}
          setTimePeriodId={setTimePeriodId}
          selectedEntryTypes={selectedEntryTypes}
          setSelectedEntryTypes={setSelectedEntryTypes}
          selectedSortOrder={selectedSortOrder}
          setSelectedSortOrder={setSelectedSortOrder}
        />

        {!isFetching && (
          <EntryTypeChips
            entries={entries}
            selectedEntryTypes={selectedEntryTypes}
            setSelectedEntryTypes={setSelectedEntryTypes}
          />
        )}
      </Stack>

      {isFetching && <LoadingIndicator />}

      {!isFetching &&
        !filteredEntries.length &&
        (selectedEntryTypes.length > 0 ? (
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
                setSelectedEntryTypes([]);
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
