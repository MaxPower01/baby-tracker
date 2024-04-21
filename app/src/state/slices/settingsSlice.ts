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
import { IntervalMethodId } from "@/pages/Settings/enums/IntervalMethodId";
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
  themeMode: ThemeMode.Dark,
  intervalMethodByEntryTypeId: getDefaulIntervalMethodByEntryTypeId(),
  entryTypesOrder: getDefaultEntryTypesOrder(),
  status: "idle",
};

const parser = (state: SettingsState) => {
  if (
    !state.themeMode ||
    !state.intervalMethodByEntryTypeId ||
    !state.entryTypesOrder ||
    !state.status
  ) {
    state = defaultState;
  }
  return state;
};

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

function _saveIntervalMethodByEntryTypeIdInState(
  state: SettingsState,
  payload: {
    intervalMethodByEntryTypeId: Array<{
      entryTypeId: EntryTypeId;
      methodId: IntervalMethodId;
    }>;
  },
  preventLocalStorageUpdate = false
) {
  state.intervalMethodByEntryTypeId = payload.intervalMethodByEntryTypeId;
  if (!preventLocalStorageUpdate) {
    setLocalState(key, state);
  }
}

export const saveIntervalMethodByEntryTypeIdInDB = createAsyncThunk(
  "settings/saveIntervalMethodByEntryTypeId",
  async (
    props: {
      user: CustomUser;
      intervalMethodByEntryTypeId: Array<{
        entryTypeId: EntryTypeId;
        methodId: IntervalMethodId;
      }>;
    },
    thunkAPI
  ) => {
    const { user, intervalMethodByEntryTypeId } = props;
    if (user == null || user.uid == null) {
      return thunkAPI.rejectWithValue(
        "Cannot save interval method by entry type id because user or user id is null"
      );
    }
    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        intervalMethodByEntryTypeId: intervalMethodByEntryTypeId,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
    return thunkAPI.fulfillWithValue({ intervalMethodByEntryTypeId });
  }
);

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
    saveIntervalMethodByEntryTypeIdInState: (
      state,
      action: PayloadAction<{
        intervalMethodByEntryTypeId: Array<{
          entryTypeId: EntryTypeId;
          methodId: IntervalMethodId;
        }>;
      }>
    ) => {
      _saveIntervalMethodByEntryTypeIdInState(state, action.payload);
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
    builder.addCase(saveIntervalMethodByEntryTypeIdInDB.pending, (state) => {
      _setStatusInState(state, "busy");
    });
    builder.addCase(
      saveIntervalMethodByEntryTypeIdInDB.fulfilled,
      (state, action) => {
        _saveIntervalMethodByEntryTypeIdInState(state, action.payload);
        _setStatusInState(state, "idle");
      }
    );
    builder.addCase(saveIntervalMethodByEntryTypeIdInDB.rejected, (state) => {
      _setStatusInState(state, "idle");
    });
  },
});

export const {
  saveIntervalMethodByEntryTypeIdInState,
  saveEntryTypesOrderInState,
} = slice.actions;

export const selectThemeMode = (state: RootState) =>
  state.settingsReducer.themeMode;

export const selectIntervalMethodByEntryTypeId = (state: RootState) =>
  state.settingsReducer.intervalMethodByEntryTypeId;

export const selectEntryTypesOrder = (state: RootState) =>
  state.settingsReducer.entryTypesOrder;

export default slice.reducer;
