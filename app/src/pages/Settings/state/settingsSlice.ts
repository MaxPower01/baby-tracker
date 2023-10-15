import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getInitialState, setLocalState } from "@/utils/utils";

import ActivityType from "@/pages/Activities/enums/ActivityType";
import EntriesState from "@/pages/Entries/types/EntriesState";
import EntryModel from "@/pages/Entries/models/EntryModel";
import GroupEntriesBy from "@/pages/Settings/enums/GroupEntriesBy";
import GroupEntriesInterval from "@/pages/Settings/enums/GroupEntriesInterval";
import LocalStorageKey from "@/enums/LocalStorageKey";
import { RootState } from "@/store/store";
import SettingsState from "@/pages/Settings/types/SettingsState";
import StoreReducerName from "@/store/enums/StoreReducerName";
import ThemeMode from "@/theme/enums/ThemeMode";
import WeightUnit from "@/pages/Settings/enums/WeightUnit";

const key = LocalStorageKey.SettingsState;

const defaultState: SettingsState = {
  groupEntriesBy: GroupEntriesBy.ThirtyMinutes,
  groupEntriesInterval: GroupEntriesInterval.BetweenEndsAndBeginnings,
  themeMode: ThemeMode.Dark,
  weightUnit: WeightUnit.Pound,
  showPoopQuantityInHomePage: true,
  showUrineQuantityInHomePage: true,
};

const parser = (state: SettingsState) => {
  if (!state.groupEntriesBy) {
    state.groupEntriesBy = defaultState.groupEntriesBy;
  }
  if (!state.groupEntriesInterval) {
    state.groupEntriesInterval = defaultState.groupEntriesInterval;
  }
  if (!state.themeMode) {
    state.themeMode = defaultState.themeMode;
  }
  if (!state.weightUnit) {
    state.weightUnit = defaultState.weightUnit;
  }
  if (state.showPoopQuantityInHomePage === undefined) {
    state.showPoopQuantityInHomePage = defaultState.showPoopQuantityInHomePage;
  }
  if (state.showUrineQuantityInHomePage === undefined) {
    state.showUrineQuantityInHomePage =
      defaultState.showUrineQuantityInHomePage;
  }
  return state;
};

const slice = createSlice({
  name: StoreReducerName.Settings,
  initialState: getInitialState(key, defaultState, parser),
  reducers: {
    updateGroupEntriesBy: (state, action: PayloadAction<GroupEntriesBy>) => {
      state.groupEntriesBy = action.payload;
      setLocalState(key, state);
    },
    updateGroupEntriesInterval: (
      state,
      action: PayloadAction<GroupEntriesInterval>
    ) => {
      state.groupEntriesInterval = action.payload;
      setLocalState(key, state);
    },
    updateWeightUnit: (state, action: PayloadAction<WeightUnit>) => {
      state.weightUnit = action.payload;
      setLocalState(key, state);
    },
    updateThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.themeMode = action.payload;
      setLocalState(key, state);
    },
    updateShowPoopQuantityInHomePage: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.showPoopQuantityInHomePage = action.payload;
      setLocalState(key, state);
    },
    updateShowUrineQuantityInHomePage: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.showUrineQuantityInHomePage = action.payload;
      setLocalState(key, state);
    },
  },
});

export const {
  updateGroupEntriesBy,
  updateThemeMode,
  updateGroupEntriesInterval,
  updateWeightUnit,
  updateShowPoopQuantityInHomePage,
  updateShowUrineQuantityInHomePage,
} = slice.actions;

export const selectGroupEntriesBy = (state: RootState) =>
  state.settingsReducer.groupEntriesBy;

export const selectGroupEntriesInterval = (state: RootState) =>
  state.settingsReducer.groupEntriesInterval;

export const selectWeightUnit = (state: RootState) =>
  state.settingsReducer.weightUnit;

export const selectThemeMode = (state: RootState) =>
  state.settingsReducer.themeMode;

export const selectShowPoopQuantityInHomePage = (state: RootState) =>
  state.settingsReducer.showPoopQuantityInHomePage;

export const selectShowUrineQuantityInHomePage = (state: RootState) =>
  state.settingsReducer.showUrineQuantityInHomePage;

export default slice.reducer;
