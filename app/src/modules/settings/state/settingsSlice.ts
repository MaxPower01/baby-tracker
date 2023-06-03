import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getInitialState, setLocalState } from "@/utils/utils";

import ActivityType from "@/modules/activities/enums/ActivityType";
import EntriesState from "@/modules/entries/types/EntriesState";
import EntryModel from "@/modules/entries/models/EntryModel";
import GroupEntriesBy from "@/modules/settings/types/GroupEntriesBy";
import LocalStorageKey from "@/common/enums/LocalStorageKey";
import { RootState } from "@/modules/store/store";
import SettingsState from "@/modules/settings/types/SettingsState";
import StoreReducerName from "@/modules/store/enums/StoreReducerName";

const key = LocalStorageKey.SettingsState;

const defaultState: SettingsState = {
  groupEntriesBy: "30m",
  theme: "dark",
  useCompactMode: false,
};

const slice = createSlice({
  name: StoreReducerName.Settings,
  initialState: getInitialState(key, defaultState),
  reducers: {
    setGroupEntriesBy: (state, action: PayloadAction<GroupEntriesBy>) => {
      state.groupEntriesBy = action.payload;
      setLocalState(key, state);
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
      setLocalState(key, state);
    },
    setUseCompactMode: (state, action: PayloadAction<boolean>) => {
      state.useCompactMode = action.payload;
      setLocalState(key, state);
    },
  },
});

export const { setGroupEntriesBy, setTheme, setUseCompactMode } = slice.actions;

export const selectGroupEntriesBy = (state: RootState) =>
  state.settingsReducer.groupEntriesBy;

export const selectTheme = (state: RootState) => state.settingsReducer.theme;

export const selectUseCompactMode = (state: RootState) =>
  state.settingsReducer.useCompactMode;

export default slice.reducer;
