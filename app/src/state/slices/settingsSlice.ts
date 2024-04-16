import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { doc, updateDoc } from "firebase/firestore";
import { getInitialState, setLocalState } from "@/utils/utils";

import ActivityType from "@/pages/Activity/enums/ActivityType";
import CustomUser from "@/pages/Authentication/types/CustomUser";
import EntriesState from "@/types/EntriesState";
import EntryModel from "@/pages/Entry/models/EntryModel";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import GroupEntriesBy from "@/pages/Settings/enums/GroupEntriesBy";
import GroupEntriesInterval from "@/pages/Settings/enums/GroupEntriesInterval";
import { IntervalMethod } from "@/pages/Settings/enums/IntervalMethod";
import { LocalStorageKey } from "@/enums/LocalStorageKey";
import { RootState } from "@/state/store";
import SettingsState from "@/pages/Settings/types/SettingsState";
import StoreReducerName from "@/enums/StoreReducerName";
import { ThemeMode } from "@/enums/ThemeMode";
import WeightUnit from "@/pages/Settings/enums/WeightUnit";
import { db } from "@/firebase";
import { getDefaulIntervalMethodByEntryTypeId } from "@/utils/getDefaulIntervalMethodByEntryTypeId";
import getDefaultActivitiesOrder from "@/pages/Activities/utils/getDefaultActivitiesOrder";
import { getDefaultEntryTypesOrder } from "@/pages/Entry/utils/getDefaultEntryTypesOrder";

const key = LocalStorageKey.SettingsState;

const defaultState: SettingsState = {
  groupEntriesBy: GroupEntriesBy.ThirtyMinutes,
  groupEntriesInterval: GroupEntriesInterval.BetweenEndsAndBeginnings,
  themeMode: ThemeMode.Dark,
  weightUnit: WeightUnit.Pound,
  showPoopQuantityInHomePage: true,
  showUrineQuantityInHomePage: true,
  intervalMethodByEntryTypeId: getDefaulIntervalMethodByEntryTypeId(),
  entryTypesOrder: getDefaultEntryTypesOrder(),
  status: "idle",
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

export const saveEntryTypesOrderInDB = createAsyncThunk(
  "settings/saveEntryTypesOrder",
  async (
    props: {
      user: CustomUser;
      entryTypesOrder: EntryTypeId[];
    },
    thunkAPI
  ) => {
    const { user, entryTypesOrder } = props;
    if (user == null || user.uid == null) {
      return thunkAPI.rejectWithValue(
        "Cannot save entry types order because user or user id is null"
      );
    }
    try {
      // entryTypesOrder is an array of EntryTypeId stored in the user document
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        entryTypesOrder,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
    return thunkAPI.fulfillWithValue(entryTypesOrder);
  }
);

function _saveEntryTypesOrderInState(
  state: SettingsState,
  payload: { entryTypesOrder: EntryTypeId[] },
  preventLocalStorageUpdate = false
) {
  state.entryTypesOrder = payload.entryTypesOrder;
  if (!preventLocalStorageUpdate) {
    setLocalState(key, state);
  }
}

function _setStatusInState(
  state: SettingsState,
  status: "idle" | "busy" | "busy",
  preventLocalStorageUpdate = false
) {
  state.status = status;
  if (!preventLocalStorageUpdate) {
    setLocalState(key, state);
  }
}

const slice = createSlice({
  name: StoreReducerName.Settings,
  initialState: getInitialState(key, defaultState, parser),
  reducers: {
    updateGroupingIntervalByEntryTypeId: (
      state,
      action: PayloadAction<{
        entryTypeId: EntryTypeId;
        method: IntervalMethod;
      }>
    ) => {
      const index = state.intervalMethodByEntryTypeId.findIndex(
        (x) => x.entryTypeId == action.payload.entryTypeId
      );
      if (index !== -1) {
        state.intervalMethodByEntryTypeId[index].method = action.payload.method;
      } else {
        state.intervalMethodByEntryTypeId.push({
          entryTypeId: action.payload.entryTypeId,
          method: action.payload.method,
        });
      }
      setLocalState(key, state);
    },
    saveEntryTypesOrderInState: (
      state,
      action: PayloadAction<{ entryTypesOrder: EntryTypeId[] }>
    ) => {
      _saveEntryTypesOrderInState(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(saveEntryTypesOrderInDB.pending, (state) => {
      _setStatusInState(state, "busy");
    });
    builder.addCase(saveEntryTypesOrderInDB.fulfilled, (state, action) => {
      _saveEntryTypesOrderInState(state, { entryTypesOrder: action.payload });
      _setStatusInState(state, "idle");
    });
    builder.addCase(saveEntryTypesOrderInDB.rejected, (state, action) => {
      console.error(action.error);
      _setStatusInState(state, "idle");
    });
  },
});

export const {
  updateGroupingIntervalByEntryTypeId,
  saveEntryTypesOrderInState: saveEntryTypesOrderInState,
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

export const selectIntervalMethodByEntryTypeId = (state: RootState) =>
  state.settingsReducer.intervalMethodByEntryTypeId;

export const selectEntryTypesOrder = (state: RootState) =>
  state.settingsReducer.entryTypesOrder;

export default slice.reducer;
