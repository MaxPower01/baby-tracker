import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import {
  getInitialState,
  isNullOrWhiteSpace,
  setLocalState,
} from "@/utils/utils";
import {
  recentAgeDataLimitInSeconds,
  recentDataFetchCooldownInSeconds,
} from "@/utils/constants";

import ActivityType from "@/pages/Activity/enums/ActivityType";
import CustomUser from "@/pages/Authentication/types/CustomUser";
import EntriesState from "@/types/EntriesState";
import { Entry } from "@/pages/Entry/types/Entry";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { LocalStorageKey } from "@/enums/LocalStorageKey";
import { RootState } from "@/state/store";
import StoreReducerName from "@/enums/StoreReducerName";
import { createSelector } from "@reduxjs/toolkit";
import { db } from "@/firebase";
import { getDefaultEntryTypesOrder } from "@/pages/Entry/utils/getDefaultEntryTypesOrder";
import { getEntryToSave } from "@/pages/Entry/utils/getEntryToSave";
import { getRangeStartTimestampForRecentEntries } from "@/utils/getRangeStartTimestampForRecentEntries";
import { getTimestamp } from "@/utils/getTimestamp";

const key = LocalStorageKey.EntriesState;

const defaultState: EntriesState = {
  entries: [],
  latestRecentEntriesFetchedTimestamp: null,
  status: "idle",
};

const parser = (state: EntriesState) => {
  if (
    !state.entries ||
    !state.latestRecentEntriesFetchedTimestamp ||
    !state.status
  ) {
    state = defaultState;
  }
  return state;
};

export const fetchRecentEntriesFromDB = createAsyncThunk(
  "entries/fetchRecentEntries",
  async (
    props: {
      babyId: string;
    },
    thunkAPI
  ) => {
    try {
      if (isNullOrWhiteSpace(props.babyId)) {
        return thunkAPI.rejectWithValue("User or selected child is null");
      }
      const {
        entries: currentEntries,
        latestRecentEntriesFetchedTimestamp: lastFetchTimestamp,
      } = (thunkAPI.getState() as RootState).entriesReducer;
      const newTimestamp = getTimestamp(new Date());
      const limitTimestamp = newTimestamp - recentAgeDataLimitInSeconds;
      const anyRecentEntries = currentEntries.some(
        (entry) => entry.startTimestamp >= limitTimestamp
      );
      if (
        lastFetchTimestamp &&
        newTimestamp - lastFetchTimestamp < recentDataFetchCooldownInSeconds &&
        anyRecentEntries
      ) {
        return thunkAPI.rejectWithValue("Cooldown not elapsed");
      }
      thunkAPI.dispatch(
        setLastFetchTimestampInState({
          timestamp: newTimestamp,
        })
      );
      const q = query(
        collection(db, `babies/${props.babyId}/entries`),
        where("startTimestamp", ">=", limitTimestamp),
        orderBy("startTimestamp", "desc")
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return thunkAPI.fulfillWithValue([]);
      }
      const entries: Entry[] = [];
      querySnapshot.forEach((doc) => {
        const entry: Entry = {
          id: doc.id,
          ...(doc.data() as Entry),
        };
        entries.push(entry);
      });
      entries.sort((a, b) => {
        return b.startTimestamp - a.startTimestamp;
      });
      return thunkAPI.fulfillWithValue(entries);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const saveEntryInDB = createAsyncThunk(
  "entries/saveEntry",
  async (
    props: {
      entry: Entry;
      user: CustomUser;
    },
    thunkAPI
  ) => {
    const { entry, user } = props;
    const babyId = user?.babyId ?? "";
    if (user == null || isNullOrWhiteSpace(babyId)) {
      return thunkAPI.rejectWithValue("User or selected baby is null");
    }
    const entryToSave = getEntryToSave(entry, babyId);
    const { id, ...rest } = entryToSave;
    let newId = id;
    if (isNullOrWhiteSpace(id)) {
      try {
        const entryToAdd: Entry = {
          ...rest,
          createdTimestamp: getTimestamp(new Date()),
          createdBy: user.uid,
          editedBy: "",
        };
        const docRef = await addDoc(
          collection(db, `babies/${entryToSave.babyId}/entries`),
          entryToAdd
        );
        newId = docRef.id;
      } catch (error) {
        return thunkAPI.rejectWithValue(error);
      }
    } else {
      try {
        const entryToUpdate: Entry = {
          ...rest,
          editedTimestamp: getTimestamp(new Date()),
          editedBy: user.uid,
        };
        await setDoc(
          doc(db, `babies/${entryToSave.babyId}/entries/${id}`),
          entryToUpdate
        );
      } catch (error) {
        return thunkAPI.rejectWithValue(error);
      }
    }
    const savedEntry = { ...entryToSave, id: newId } as Entry;
    return thunkAPI.fulfillWithValue(savedEntry);
  }
);

export const deleteEntryInDB = createAsyncThunk(
  "entries/deleteEntry",
  async (
    props: {
      entryId: string;
      babyId: string;
    },
    thunkAPI
  ) => {
    try {
      await deleteDoc(
        doc(db, `babies/${props.babyId}/entries/${props.entryId}`)
      );
      return thunkAPI.fulfillWithValue(props.entryId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

function _addEntryToState(
  state: EntriesState,
  payload: {
    entry: string;
  },
  preventLocalStorageUpdate = false
) {
  const entry = JSON.parse(payload.entry) as Entry;
  const index = state.entries.findIndex((e) => e.id === entry.id);
  if (index === -1) {
    state.entries.push(entry);
  }
  if (!preventLocalStorageUpdate) {
    setLocalState(key, state);
  }
}

function _addEntriesToState(
  state: EntriesState,
  payload: {
    entries: string[];
  },
  preventLocalStorageUpdate = false
) {
  const entries = payload.entries.map((entry) => JSON.parse(entry) as Entry);
  entries.forEach((entry) => {
    _addEntryToState(state, { entry: JSON.stringify(entry) }, true);
  });
  if (!preventLocalStorageUpdate) {
    setLocalState(key, state);
  }
}

function _updateEntryInState(
  state: EntriesState,
  payload: {
    entry: string;
  },
  preventLocalStorageUpdate = false
) {
  const entry = JSON.parse(payload.entry) as Entry;
  const index = state.entries.findIndex((e) => e.id === entry.id);
  if (index !== -1) {
    state.entries[index] = entry;
  } else {
    _addEntryToState(state, payload, true);
  }
  if (!preventLocalStorageUpdate) {
    setLocalState(key, state);
  }
}

function _updateEntriesInState(
  state: EntriesState,
  payload: {
    entries: string[];
  },
  preventLocalStorageUpdate = false
) {
  const entries = payload.entries.map((entry) => JSON.parse(entry) as Entry);
  entries.forEach((entry) => {
    _updateEntryInState(state, { entry: JSON.stringify(entry) }, true);
  });
  if (!preventLocalStorageUpdate) {
    setLocalState(key, state);
  }
}

function _removeEntryFromState(
  state: EntriesState,
  payload: {
    id: string;
  },
  preventLocalStorageUpdate = false
) {
  const index = state.entries.findIndex((e) => e.id === payload.id);
  if (index !== -1) {
    state.entries.splice(index, 1);
  }
  if (!preventLocalStorageUpdate) {
    setLocalState(key, state);
  }
}

function _removeEntriesFromState(
  state: EntriesState,
  payload: {
    ids: string[];
  },
  preventLocalStorageUpdate = false
) {
  payload.ids.forEach((id) => {
    if (isNullOrWhiteSpace(id)) return;
    const index = state.entries.findIndex((e) => e.id === id);
    if (index !== -1) {
      state.entries.splice(index, 1);
    }
  });
  if (!preventLocalStorageUpdate) {
    setLocalState(key, state);
  }
}

function _setEntriesInState(
  state: EntriesState,
  payload: {
    entries: string[];
  },
  preventLocalStorageUpdate = false
) {
  const entries = payload.entries.map((entry) => JSON.parse(entry) as Entry);
  state.entries = entries;
  if (!preventLocalStorageUpdate) {
    setLocalState(key, state);
  }
}

function _resetState(state: EntriesState, preventLocalStorageUpdate = false) {
  Object.assign(state, defaultState);
  if (!preventLocalStorageUpdate) {
    setLocalState(key, state);
  }
}

function _setLastFetchTimestampInState(
  state: EntriesState,
  payload: {
    timestamp: number;
  },
  preventLocalStorageUpdate = false
) {
  state.latestRecentEntriesFetchedTimestamp = payload.timestamp;
  if (!preventLocalStorageUpdate) {
    setLocalState(key, state);
  }
}

function _setStatusInState(
  state: EntriesState,
  status: "idle" | "busy" | "busy",
  preventLocalStorageUpdate = false
) {
  state.status = status;
  if (!preventLocalStorageUpdate) {
    setLocalState(key, state);
  }
}

const slice = createSlice({
  name: StoreReducerName.Entries,
  initialState: getInitialState(key, defaultState),
  reducers: {
    addEntryInState: (
      state,
      action: PayloadAction<{
        entry: string;
      }>
    ) => {
      _addEntryToState(state, action.payload);
    },
    addEntriesInState: (
      state,
      action: PayloadAction<{
        entries: string[];
      }>
    ) => {
      _addEntriesToState(state, action.payload);
    },
    updateEntryInState: (
      state,
      action: PayloadAction<{
        entry: string;
      }>
    ) => {
      _updateEntryInState(state, action.payload);
    },
    updateEntriesInState: (
      state,
      action: PayloadAction<{
        entries: string[];
      }>
    ) => {
      _updateEntriesInState(state, action.payload);
    },
    removeEntryFromState: (
      state,
      action: PayloadAction<{
        id: string;
      }>
    ) => {
      _removeEntryFromState(state, action.payload);
    },
    removeEntriesFromState: (
      state,
      action: PayloadAction<{
        ids: string[];
      }>
    ) => {
      _removeEntriesFromState(state, action.payload);
    },
    setEntriesInState: (
      state,
      action: PayloadAction<{
        entries: string[];
      }>
    ) => {
      _setEntriesInState(state, action.payload);
    },
    resetState: (state) => {
      _resetState(state);
    },
    setLastFetchTimestampInState: (
      state,
      action: PayloadAction<{
        timestamp: number;
      }>
    ) => {
      _setLastFetchTimestampInState(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRecentEntriesFromDB.pending, (state, action) => {
      _setStatusInState(state, "busy");
    });
    builder.addCase(fetchRecentEntriesFromDB.fulfilled, (state, action) => {
      const entries = action.payload as Entry[];
      _setEntriesInState(state, {
        entries: entries.map((e) => JSON.stringify(e)),
      });
      _setStatusInState(state, "idle");
    });
    builder.addCase(fetchRecentEntriesFromDB.rejected, (state, action) => {
      console.error("Error fetching recent entries: ", action.payload);
      _setStatusInState(state, "idle");
    });
    builder.addCase(saveEntryInDB.pending, (state, action) => {
      _setStatusInState(state, "busy");
    });
    builder.addCase(saveEntryInDB.fulfilled, (state, action) => {
      const entry = action.payload as Entry;
      _updateEntryInState(state, { entry: JSON.stringify(entry) });
      _setStatusInState(state, "idle");
    });
    builder.addCase(saveEntryInDB.rejected, (state, action) => {
      console.error("Error saving entry: ", action.payload);
      _setStatusInState(state, "idle");
    });
    builder.addCase(deleteEntryInDB.pending, (state, action) => {
      _setStatusInState(state, "busy");
    });
    builder.addCase(deleteEntryInDB.fulfilled, (state, action) => {
      const entryId = action.payload as string;
      _removeEntryFromState(state, { id: entryId });
      _setStatusInState(state, "idle");
    });
    builder.addCase(deleteEntryInDB.rejected, (state, action) => {
      console.error("Error deleting entry: ", action.payload);
      _setStatusInState(state, "idle");
    });
  },
});

export const {
  updateEntryInState,
  resetState,
  removeEntryFromState,
  addEntriesInState,
  addEntryInState,
  removeEntriesFromState,
  setEntriesInState,
  setLastFetchTimestampInState,
  updateEntriesInState,
} = slice.actions;

export const selectEntries = (state: RootState) => state.entriesReducer.entries;
export const selectEntriesStatus = (state: RootState) =>
  state.entriesReducer.status;

export const selectRecentEntries = createSelector(
  (state: RootState) => state.entriesReducer.entries,
  (entries) => {
    try {
      const rangeStartTimestamp = getRangeStartTimestampForRecentEntries();
      return entries.filter(
        (entry) => entry.startTimestamp >= rangeStartTimestamp
      );
    } catch (error) {
      return [];
    }
  }
);

export default slice.reducer;
