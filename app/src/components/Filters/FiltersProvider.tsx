import React, { useEffect, useMemo } from "react";

import { ActivityContext } from "@/pages/Activity/types/ActivityContext";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { SortOrderId } from "@/enums/SortOrderId";
import { TimePeriodId } from "@/enums/TimePeriodId";

interface FiltersContextType {
  filtersCount: number;
  entryTypes: Array<EntryTypeId>;
  setEntryTypes: (entryTypes: Array<EntryTypeId>) => void;
  toggleEntryType: (entryTypeId: EntryTypeId) => void;
  activityContexts: Array<ActivityContext>;
  setActivityContexts: (activityContexts: Array<ActivityContext>) => void;
  toggleActivityContext: (activityContext: ActivityContext) => void;
  sortOrder: SortOrderId;
  setSortOrder: (sortOrder: SortOrderId) => void;
  timePeriod: TimePeriodId;
  setTimePeriod: (timePeriod: TimePeriodId) => void;
  reset: () => void;
}

const FiltersContext = React.createContext<FiltersContextType | undefined>(
  undefined
);

export function useFilters() {
  const context = React.useContext(FiltersContext);
  if (context === undefined) {
    throw new Error("useEntries must be used within a EntriesProvider");
  }
  return context;
}

type Props = React.PropsWithChildren<{}>;

export function FiltersProvider(props: Props) {
  const defaultEntryTypes: Array<EntryTypeId> = [];
  const [entryTypes, setEntryTypes] =
    React.useState<Array<EntryTypeId>>(defaultEntryTypes);
  const toggleEntryType = (entryTypeId: EntryTypeId) => {
    setEntryTypes((entryTypes) => {
      if (entryTypes.includes(entryTypeId)) {
        return entryTypes.filter((id) => id !== entryTypeId);
      }
      return [...entryTypes, entryTypeId];
    });
  };

  const defaultActivityContexts: Array<ActivityContext> = [];
  const [activityContexts, setActivityContexts] = React.useState<
    Array<ActivityContext>
  >(defaultActivityContexts);
  const toggleActivityContext = (activityContext: ActivityContext) => {
    setActivityContexts((activityContexts) => {
      if (activityContexts.includes(activityContext)) {
        return activityContexts.filter(
          (context) => context !== activityContext
        );
      }
      return [...activityContexts, activityContext];
    });
  };

  const defaultSortOrder = SortOrderId.DateDesc;
  const [sortOrder, setSortOrder] =
    React.useState<SortOrderId>(defaultSortOrder);

  const defaultTimePeriod = TimePeriodId.Last2Days;
  const [timePeriod, setTimePeriod] =
    React.useState<TimePeriodId>(defaultTimePeriod);

  const reset = () => {
    setEntryTypes(defaultEntryTypes);
    setActivityContexts(defaultActivityContexts);
    setSortOrder(defaultSortOrder);
    setTimePeriod(defaultTimePeriod);
  };

  const filtersCount = useMemo(() => {
    return entryTypes.length + activityContexts.length;
  }, [entryTypes, activityContexts]);

  const value: FiltersContextType = useMemo(() => {
    return {
      filtersCount,
      entryTypes,
      setEntryTypes,
      toggleEntryType,
      activityContexts,
      setActivityContexts,
      toggleActivityContext,
      sortOrder,
      setSortOrder,
      timePeriod,
      setTimePeriod,
      reset,
    };
  }, [
    entryTypes,
    activityContexts,
    sortOrder,
    timePeriod,
    setEntryTypes,
    setActivityContexts,
    setSortOrder,
    setTimePeriod,
    reset,
  ]);

  return (
    <FiltersContext.Provider value={value}>
      {props.children}
    </FiltersContext.Provider>
  );
}
