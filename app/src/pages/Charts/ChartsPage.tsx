import { useMemo, useState } from "react";

import { ChartCard } from "@/pages/Charts/components/ChartCard";
import { EmptyState } from "@/components/EmptyState";
import { EmptyStateContext } from "@/enums/EmptyStateContext";
import { Entry } from "@/pages/Entry/types/Entry";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { EntryTypePicker } from "@/components/EntryTypePicker";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { SearchToolbar } from "@/components/SearchToolbar";
import { Stack } from "@mui/material";
import { TimePeriodId } from "@/enums/TimePeriodId";
import { entryTypeHasStopwatch } from "@/pages/Entry/utils/entryTypeHasStopwatch";
import { entryTypeHasVolume } from "@/pages/Entry/utils/entryTypeHasVolume";
import { selectEntryTypesOrder } from "@/state/slices/settingsSlice";
import { useAuthentication } from "@/pages/Authentication/hooks/useAuthentication";
import { useFilters } from "@/components/Filters/FiltersProvider";
import { useSelector } from "react-redux";

export function ChartsPage() {
  const { user } = useAuthentication();

  const { timePeriod } = useFilters();

  const entryTypesOrder = useSelector(selectEntryTypesOrder);

  const [entryTypeId, setEntryTypeId] = useState<EntryTypeId>(
    entryTypesOrder[0]
  );

  const [isFetching, setIsFetching] = useState(false);
  const [lastTimePeriodFetched, setLastTimePeriodIdFetched] =
    useState<TimePeriodId | null>(null);

  const [entries, setEntries] = useState<Entry[]>([]);

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
