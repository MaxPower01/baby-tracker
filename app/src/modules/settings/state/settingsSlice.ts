import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getInitialState, setLocalState } from "@/utils/utils";

import ActivityType from "@/modules/activities/enums/ActivityType";
import EntriesState from "@/modules/entries/types/EntriesState";
import EntryModel from "@/modules/entries/models/EntryModel";
import GroupEntriesBy from "@/modules/settings/enums/GroupEntriesBy";
import LocalStorageKey from "@/common/enums/LocalStorageKey";
import { RootState } from "@/modules/store/store";
import SettingsState from "@/modules/settings/types/SettingsState";
import StoreReducerName from "@/modules/store/enums/StoreReducerName";
import ThemeMode from "@/modules/theme/enums/ThemeMode";

const key = LocalStorageKey.SettingsState;

const defaultState: SettingsState = {
  groupEntriesBy: GroupEntriesBy.ThirtyMinutes,
  themeMode: ThemeMode.Dark,
  useCompactMode: true,
};

const slice = createSlice({
  name: StoreReducerName.Settings,
  initialState: getInitialState(key, defaultState),
  reducers: {
    updateGroupEntriesBy: (state, action: PayloadAction<GroupEntriesBy>) => {
      state.groupEntriesBy = action.payload;
      setLocalState(key, state);
    },
    updateThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.themeMode = action.payload;
      setLocalState(key, state);
    },
    updateUseCompactMode: (state, action: PayloadAction<boolean>) => {
      state.useCompactMode = action.payload;
      setLocalState(key, state);
    },
  },
});

export const { updateGroupEntriesBy, updateThemeMode, updateUseCompactMode } =
  slice.actions;

export const selectGroupEntriesBy = (state: RootState) =>
  state.settingsReducer.groupEntriesBy;

export const selectThemeMode = (state: RootState) =>
  state.settingsReducer.themeMode;

export const selectUseCompactMode = (state: RootState) =>
  state.settingsReducer.useCompactMode;

export default slice.reducer;
