import { useEffect, useState } from "react";

import { EmptyState } from "@/components/EmptyState";
import { EmptyStateContext } from "@/enums/EmptyStateContext";
import { EntriesList } from "@/components/EntriesList";
import { Entry } from "@/pages/Entry/types/Entry";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { SearchToolbar } from "@/pages/History/components/SearchToolbar";
import { Section } from "@/components/Section";
import { SortOrderId } from "@/enums/SortOrderId";
import { Stack } from "@mui/material";
import { TimePeriodId } from "@/enums/TimePeriodId";
import { fetchHistoryEntriesFromDB } from "@/state/slices/entriesSlice";
import { useAppDispatch } from "@/state/hooks/useAppDispatch";
import { useAuthentication } from "@/pages/Authentication/hooks/useAuthentication";
import { useSelector } from "react-redux";

export function HistoryPage() {
  const { user } = useAuthentication();

  const dispatch = useAppDispatch();

  const [isFetching, setIsFetching] = useState(false);

  const [timePeriodId, setTimePeriodId] = useState(TimePeriodId.Today);

  const [selectedEntryTypes, setSelectedEntryTypes] = useState<EntryTypeId[]>(
    []
  );

  const [selectedSortOrder, setSelectedSortOrder] = useState(
    SortOrderId.DateDesc
  );

  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    if (user?.babyId != null && !isFetching) {
      setIsFetching(true);

      dispatch(fetchHistoryEntriesFromDB({ babyId: user.babyId, timePeriodId }))
        .then((result) => {
          if (result.meta.requestStatus === "rejected") {
            if (typeof result.payload === "string") {
              console.error(result.payload);
            }
            setIsFetching(false);
          } else if (result.meta.requestStatus === "fulfilled") {
            if (!Array.isArray(result.payload)) {
              console.error(
                "Expected an array of entries, but got:",
                result.payload
              );
              setIsFetching(false);
              return;
            }
            const payload = result.payload as Entry[] | undefined | null;
            if (payload != null) {
              setEntries(payload);
            }
            setIsFetching(false);
          } else {
            setIsFetching(false);
          }
        })
        .catch((err) => {
          setIsFetching(false);
          console.error(err);
        });
    }
  }, [user, timePeriodId, dispatch, isFetching]);

  return (
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

      {isFetching && <LoadingIndicator />}

      {!isFetching && !entries.length && (
        <EmptyState
          context={EmptyStateContext.Entries}
          override={{
            title: "Aucune entrée trouvée",
            description:
              "Aucune entrée ne correspond à vos critères de recherche",
            stickerSource: "/stickers/empty-state--entries.svg",
          }}
        />
      )}

      {!isFetching && entries.length && <EntriesList entries={entries} />}
    </Stack>
  );
}
