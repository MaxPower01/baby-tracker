import { EmptyState } from "@/components/EmptyState";
import { EmptyStateContext } from "@/enums/EmptyStateContext";
import { SearchFiltersToolbar } from "@/pages/History/components/SearchFiltersToolbar";
import { Section } from "@/components/Section";
import { Stack } from "@mui/material";
import { TimePeriodId } from "@/enums/TimePeriodId";

export function HistoryPage() {
  return (
    <Stack
      spacing={2}
      sx={{
        width: "100%",
      }}
    >
      <SearchFiltersToolbar />
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
