import { EmptyState } from "@/components/EmptyState";
import { EmptyStateContext } from "@/enums/EmptyStateContext";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { SearchToolbar } from "@/pages/History/components/SearchToolbar";
import { Section } from "@/components/Section";
import { SortOrderId } from "@/enums/SortOrderId";
import { Stack } from "@mui/material";
import { TimePeriodId } from "@/enums/TimePeriodId";
import { useState } from "react";

export function HistoryPage() {
  const [timePeriodId, setTimePeriodId] = useState(TimePeriodId.Today);
  const [selectedEntryTypes, setSelectedEntryTypes] = useState<EntryTypeId[]>(
    []
  );
  const [selectedSortOrder, setSelectedSortOrder] = useState(
    SortOrderId.DateDesc
  );
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
      <EmptyState
        context={EmptyStateContext.Entries}
        override={{
          title: "Bientôt disponible",
          description:
            "Revenez bientôt pour consluter l'historique de vos activités",
          stickerSource: "/stickers/empty-state--entries.svg",
        }}
      />
    </Stack>
  );
}
