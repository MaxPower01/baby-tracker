import { useEffect, useMemo, useState } from "react";

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
import { getStartTimestampForTimePeriod } from "@/utils/getStartTimestampForTimePeriod";
import { selectEntryTypesOrder } from "@/state/slices/settingsSlice";
import { useEntries } from "@/components/Entries/EntriesProvider";
import { useFilters } from "@/components/Filters/FiltersProvider";
import { useSelector } from "react-redux";

export function ChartsPage() {
  const { timePeriod, reset } = useFilters();
  const { recentEntries } = useEntries();

  const entryTypesOrder = useSelector(selectEntryTypesOrder);
  const defaultEntryType = entryTypesOrder[0];
  const [entryTypeId, setEntryTypeId] = useState<EntryTypeId>(defaultEntryType);

  const recentTimePeriods = [TimePeriodId.Today, TimePeriodId.Last2Days];

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

      {!entries.length && !isFetching && (
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

      {entries.length > 0 && (
        <Stack
          spacing={2}
          sx={{
            width: "100%",
          }}
        >
          {entryTypeHasVolume(entryTypeId) && (
            <ChartCard
              entries={entries}
              entryTypeId={entryTypeId}
              timePeriod={timePeriod}
              yAxisType="volume"
            />
          )}

          {entryTypeHasStopwatch(entryTypeId) && (
            <ChartCard
              entries={entries}
              entryTypeId={entryTypeId}
              timePeriod={timePeriod}
              yAxisType="duration"
            />
          )}

          <ChartCard
            entries={entries}
            entryTypeId={entryTypeId}
            timePeriod={timePeriod}
            yAxisType="count"
          />
        </Stack>
      )}
    </Stack>
  );
}
