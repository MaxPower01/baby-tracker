import {
  PayloadAction,
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { doc, updateDoc } from "firebase/firestore";
import { getInitialState, setLocalState } from "@/utils/utils";

import { ActivityContext } from "@/pages/Activity/types/ActivityContext";
import ActivityType from "@/pages/Activity/enums/ActivityType";
import CustomUser from "@/pages/Authentication/types/CustomUser";
import EntryModel from "@/pages/Entry/models/EntryModel";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { FiltersState } from "@/state/types/FiltersState";
import GroupEntriesBy from "@/pages/Settings/enums/GroupEntriesBy";
import GroupEntriesInterval from "@/pages/Settings/enums/GroupEntriesInterval";
import { IntervalMethodId } from "@/pages/Settings/enums/IntervalMethodId";
import { LocalStorageKey } from "@/enums/LocalStorageKey";
import { RootState } from "@/state/store";
import { SortOrderId } from "@/enums/SortOrderId";
import StoreReducerName from "@/enums/StoreReducerName";
import { ThemeMode } from "@/enums/ThemeMode";
import WeightUnit from "@/pages/Settings/enums/WeightUnit";
import { db } from "@/firebase";
import { getDefaulIntervalMethodByEntryTypeId } from "@/utils/getDefaulIntervalMethodByEntryTypeId";
import getDefaultActivitiesOrder from "@/pages/Activities/utils/getDefaultActivitiesOrder";
import { getDefaultEntryTypesOrder } from "@/pages/Entry/utils/getDefaultEntryTypesOrder";

const key = LocalStorageKey.FiltersState;

const defaultState: FiltersState = {
  activityContexts: [],
  entryTypes: [],
  sortOrder: SortOrderId.DateDesc,
};

const parser = (state: FiltersState) => {
  if (!state.activityContexts || !state.entryTypes || !state.sortOrder) {
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

const slice = createSlice({
  name: StoreReducerName.Settings,
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
  },
});

export const {
  setEntryTypesInFiltersState,
  toggleEntryTypeInFiltersState,
  setActivityContextsInFiltersState,
  toggleActivityContextInFiltersState,
  setSortOrderInFiltersState,
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

export default slice.reducer;
