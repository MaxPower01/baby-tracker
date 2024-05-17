import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { getInitialState, setLocalState } from "@/utils/utils";

import { ActivityContext } from "@/pages/Activity/types/ActivityContext";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { FiltersState } from "@/state/types/FiltersState";
import { LocalStorageKey } from "@/enums/LocalStorageKey";
import { RootState } from "@/state/store";
import { SortOrderId } from "@/enums/SortOrderId";
import StoreReducerName from "@/enums/StoreReducerName";
import { TimePeriodId } from "@/enums/TimePeriodId";

const key = LocalStorageKey.FiltersState;

const defaultState: FiltersState = {
  activityContexts: [],
  entryTypes: [],
  sortOrder: SortOrderId.DateDesc,
  timePeriod: TimePeriodId.Today,
};

const parser = (state: FiltersState) => {
  if (
    !state.activityContexts ||
    !state.entryTypes ||
    !state.sortOrder ||
    !state.timePeriod
  ) {
    state = defaultState;
  }
  return state;
};

function _setEntryTypesInFiltersState(
  state: FiltersState,
  payload: {
    entryTypes: EntryTypeId[];
  },
  preventLocalStorageUpdate = false
) {
  state.entryTypes = payload.entryTypes;
  if (!preventLocalStorageUpdate) {
    setLocalState(key, state);
  }
}

function _toggleEntryTypeInFiltersState(
  state: FiltersState,
  payload: {
    entryTypeId: EntryTypeId;
  },
  preventLocalStorageUpdate = false
) {
  const index = state.entryTypes.indexOf(payload.entryTypeId);
  if (index === -1) {
    state.entryTypes.push(payload.entryTypeId);
  } else {
    state.entryTypes.splice(index, 1);
  }
  if (!preventLocalStorageUpdate) {
    setLocalState(key, state);
  }
}

function _setActivityContextsInFiltersState(
  state: FiltersState,
  payload: {
    activityContexts: ActivityContext[];
  },
  preventLocalStorageUpdate = false
) {
  state.activityContexts = payload.activityContexts;
  if (!preventLocalStorageUpdate) {
    setLocalState(key, state);
  }
}

function _toggleActivityContextInFiltersState(
  state: FiltersState,
  payload: {
    activityContext: ActivityContext;
  },
  preventLocalStorageUpdate = false
) {
  const index = state.activityContexts.findIndex(
    (context) => context.id === payload.activityContext.id
  );
  if (index === -1) {
    state.activityContexts.push(payload.activityContext);
  } else {
    state.activityContexts.splice(index, 1);
  }
  if (!preventLocalStorageUpdate) {
    setLocalState(key, state);
  }
}

function _setSortOrderInFiltersState(
  state: FiltersState,
  payload: {
    sortOrder: SortOrderId;
  },
  preventLocalStorageUpdate = false
) {
  state.sortOrder = payload.sortOrder;
  if (!preventLocalStorageUpdate) {
    setLocalState(key, state);
  }
}

function _setTimePeriodInFiltersState(
  state: FiltersState,
  payload: {
    timePeriod: TimePeriodId;
  },
  preventLocalStorageUpdate = false
) {
  state.timePeriod = payload.timePeriod;
  if (!preventLocalStorageUpdate) {
    setLocalState(key, state);
  }
}

function _resetFiltersInState(
  state: FiltersState,
  preventLocalStorageUpdate = false
) {
  for (const key in defaultState) {
    (state as { [key: string]: any })[key] = (
      defaultState as { [key: string]: any }
    )[key];
  }
  if (!preventLocalStorageUpdate) {
    setLocalState(key, state);
  }
}

const slice = createSlice({
  name: StoreReducerName.Filters,
  initialState: getInitialState(key, defaultState, parser),
  reducers: {
    setEntryTypesInFiltersState: (
      state,
      action: PayloadAction<{ entryTypes: EntryTypeId[] }>
    ) => {
      _setEntryTypesInFiltersState(state, action.payload);
    },
    toggleEntryTypeInFiltersState: (
      state,
      action: PayloadAction<{ entryTypeId: EntryTypeId }>
    ) => {
      _toggleEntryTypeInFiltersState(state, action.payload);
    },
    setActivityContextsInFiltersState: (
      state,
      action: PayloadAction<{ activityContexts: ActivityContext[] }>
    ) => {
      _setActivityContextsInFiltersState(state, action.payload);
    },
    toggleActivityContextInFiltersState: (
      state,
      action: PayloadAction<{ activityContext: ActivityContext }>
    ) => {
      _toggleActivityContextInFiltersState(state, action.payload);
    },
    setSortOrderInFiltersState: (
      state,
      action: PayloadAction<{ sortOrder: SortOrderId }>
    ) => {
      _setSortOrderInFiltersState(state, action.payload);
    },
    setTimePeriodInFiltersState: (
      state,
      action: PayloadAction<{ timePeriod: TimePeriodId }>
    ) => {
      _setTimePeriodInFiltersState(state, action.payload);
    },
    resetFiltersInState: (state) => {
      _resetFiltersInState(state);
    },
  },
});

export const {
  setEntryTypesInFiltersState,
  toggleEntryTypeInFiltersState,
  setActivityContextsInFiltersState,
  toggleActivityContextInFiltersState,
  setSortOrderInFiltersState,
  setTimePeriodInFiltersState,
  resetFiltersInState,
} = slice.actions;

export const selectEntryTypesInFiltersState = createSelector(
  (state: RootState) => state.filtersReducer,
  (filters) => filters.entryTypes
);

export const selectActivityContextsInFiltersState = createSelector(
  (state: RootState) => state.filtersReducer,
  (filters) => filters.activityContexts
);

export const selectSortOrderInFiltersState = createSelector(
  (state: RootState) => state.filtersReducer,
  (filters) => filters.sortOrder
);

export const selectTimePeriodInFiltersState = createSelector(
  (state: RootState) => state.filtersReducer,
  (filters) => filters.timePeriod
);

export default slice.reducer;
