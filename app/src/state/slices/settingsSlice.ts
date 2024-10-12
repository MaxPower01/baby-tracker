import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { doc, updateDoc } from "firebase/firestore";
import { getInitialState, setLocalState } from "@/utils/utils";

import { CustomUser } from "@/types/CustomUser";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { IntervalMethodId } from "@/pages/Settings/enums/IntervalMethodId";
import { LocalStorageKey } from "@/enums/LocalStorageKey";
import { RootState } from "@/state/store";
import { SettingsState } from "@/state/types/SettingsState";
import StoreReducerName from "@/enums/StoreReducerName";
import { ThemeMode } from "@/enums/ThemeMode";
import { db } from "@/firebase";
import { getDefaultEntryTypesOrder } from "@/pages/Entry/utils/getDefaultEntryTypesOrder";
import { getDefaultIntervalMethodByEntryTypeId } from "@/utils/getDefaultIntervalMethodByEntryTypeId";

const key = LocalStorageKey.SettingsState;

const defaultState: SettingsState = {
  themeMode: ThemeMode.Dark,
  intervalMethodByEntryTypeId: getDefaultIntervalMethodByEntryTypeId(),
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
  reducers: {},
  extraReducers: (builder) => {},
});

export const selectThemeMode = (state: RootState) =>
  state.settingsReducer.themeMode;

export default slice.reducer;
