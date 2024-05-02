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
import { TimePeriodId } from "@/enums/TimePeriodId";
import { createSelector } from "@reduxjs/toolkit";
import { db } from "@/firebase";
import { getDefaultEntryTypesOrder } from "@/pages/Entry/utils/getDefaultEntryTypesOrder";
import { getEntryToSave } from "@/pages/Entry/utils/getEntryToSave";
import { getRangeStartTimestampForRecentEntries } from "@/utils/getRangeStartTimestampForRecentEntries";
import { getTimestamp } from "@/utils/getTimestamp";

const key = LocalStorageKey.EntriesState;

const defaultState: EntriesState = {
  recentEntries: [],
  historyEntries: [],
  latestRecentEntriesFetchedTimestamp: null,
  status: "idle",
};

const parser = (state: EntriesState) => {
  if (
    !state.recentEntries ||
    !state.historyEntries ||
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
        recentEntries: currentEntries,
        latestRecentEntriesFetchedTimestamp: lastFetchTimestamp,
      } = (thunkAPI.getState() as RootState).entriesReducer;
      const newTimestamp = getTimestamp(new Date());
      const startTimestamp = newTimestamp - recentAgeDataLimitInSeconds;
      const anyRecentEntries = currentEntries.some(
        (entry) => entry.startTimestamp >= startTimestamp
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
        where("startTimestamp", ">=", startTimestamp),
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

export const fetchHistoryEntriesFromDB = createAsyncThunk(
  "entries/fetchHistoryEntries",
  async (
    props: {
      babyId: string;
      timePeriodId: TimePeriodId;
      startTimestamp?: number;
      endTimestamp?: number;
    },
    thunkAPI
  ) => {
    try {
      if (isNullOrWhiteSpace(props.babyId)) {
        return thunkAPI.rejectWithValue("User or selected child is null");
      }
      const newTimestamp = getTimestamp(new Date());
      const startTimestamp = newTimestamp - recentAgeDataLimitInSeconds;
      thunkAPI.dispatch(
        setLastFetchTimestampInState({
          timestamp: newTimestamp,
        })
      );
      const q = query(
        collection(db, `babies/${props.babyId}/entries`),
        where("startTimestamp", ">=", startTimestamp),
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

function _addRecentEntryToState(
  state: EntriesState,
  payload: {
    entry: string;
  },
  preventLocalStorageUpdate = false
) {
  const entry = JSON.parse(payload.entry) as Entry;
  const index = state.recentEntries.findIndex((e) => e.id === entry.id);
  if (index === -1) {
    state.recentEntries.push(entry);
  }
  if (!preventLocalStorageUpdate) {
    setLocalState(key, state);
  }
}

function _addHistoryEntryToState(
  state: EntriesState,
  payload: {
    entry: string;
  },
  preventLocalStorageUpdate = false
) {
  const entry = JSON.parse(payload.entry) as Entry;
  const index = state.historyEntries.findIndex((e) => e.id === entry.id);
  if (index === -1) {
    state.historyEntries.push(entry);
  }
  if (!preventLocalStorageUpdate) {
    setLocalState(key, state);
  }
}

function _addRecentEntriesToState(
  state: EntriesState,
  payload: {
    entries: string[];
  },
  preventLocalStorageUpdate = false
) {
  const entries = payload.entries.map((entry) => JSON.parse(entry) as Entry);
  entries.forEach((entry) => {
    _addRecentEntryToState(state, { entry: JSON.stringify(entry) }, true);
  });
  if (!preventLocalStorageUpdate) {
    setLocalState(key, state);
  }
}

function _addHistoryEntriesToState(
  state: EntriesState,
  payload: {
    entries: string[];
  },
  preventLocalStorageUpdate = false
) {
  const entries = payload.entries.map((entry) => JSON.parse(entry) as Entry);
  entries.forEach((entry) => {
    _addHistoryEntryToState(state, { entry: JSON.stringify(entry) }, true);
  });
  if (!preventLocalStorageUpdate) {
    setLocalState(key, state);
  }
}

function _updateRecentEntryInState(
  state: EntriesState,
  payload: {
    entry: string;
  },
  preventLocalStorageUpdate = false
) {
  const entry = JSON.parse(payload.entry) as Entry;
  const index = state.recentEntries.findIndex((e) => e.id === entry.id);
  if (index !== -1) {
    state.recentEntries[index] = entry;
  } else {
    _addRecentEntryToState(state, payload, true);
  }
  if (!preventLocalStorageUpdate) {
    setLocalState(key, state);
  }
}

function _updateHistoryEntryInState(
  state: EntriesState,
  payload: {
    entry: string;
  },
  preventLocalStorageUpdate = false
) {
  const entry = JSON.parse(payload.entry) as Entry;
  const index = state.historyEntries.findIndex((e) => e.id === entry.id);
  if (index !== -1) {
    state.historyEntries[index] = entry;
  } else {
    _addHistoryEntryToState(state, payload, true);
  }
  if (!preventLocalStorageUpdate) {
    setLocalState(key, state);
  }
}

function _updateRecentEntriesInState(
  state: EntriesState,
  payload: {
    entries: string[];
  },
  preventLocalStorageUpdate = false
) {
  const entries = payload.entries.map((entry) => JSON.parse(entry) as Entry);
  entries.forEach((entry) => {
    _updateRecentEntryInState(state, { entry: JSON.stringify(entry) }, true);
  });
  if (!preventLocalStorageUpdate) {
    setLocalState(key, state);
  }
}

function _updateHistoryEntriesInState(
  state: EntriesState,
  payload: {
    entries: string[];
  },
  preventLocalStorageUpdate = false
) {
  const entries = payload.entries.map((entry) => JSON.parse(entry) as Entry);
  entries.forEach((entry) => {
    _updateHistoryEntryInState(state, { entry: JSON.stringify(entry) }, true);
  });
  if (!preventLocalStorageUpdate) {
    setLocalState(key, state);
  }
}

function _removeRecentEntryFromState(
  state: EntriesState,
  payload: {
    id: string;
  },
  preventLocalStorageUpdate = false
) {
  const index = state.recentEntries.findIndex((e) => e.id === payload.id);
  if (index !== -1) {
    state.recentEntries.splice(index, 1);
  }
  if (!preventLocalStorageUpdate) {
    setLocalState(key, state);
  }
}

function _removeHistoryEntryFromState(
  state: EntriesState,
  payload: {
    id: string;
  },
  preventLocalStorageUpdate = false
) {
  const index = state.historyEntries.findIndex((e) => e.id === payload.id);
  if (index !== -1) {
    state.historyEntries.splice(index, 1);
  }
  if (!preventLocalStorageUpdate) {
    setLocalState(key, state);
  }
}

function _removeRecentEntriesFromState(
  state: EntriesState,
  payload: {
    ids: string[];
  },
  preventLocalStorageUpdate = false
) {
  payload.ids.forEach((id) => {
    if (isNullOrWhiteSpace(id)) return;
    const index = state.recentEntries.findIndex((e) => e.id === id);
    if (index !== -1) {
      state.recentEntries.splice(index, 1);
    }
  });
  if (!preventLocalStorageUpdate) {
    setLocalState(key, state);
  }
}

function _removeHistoryEntriesFromState(
  state: EntriesState,
  payload: {
    ids: string[];
  },
  preventLocalStorageUpdate = false
) {
  payload.ids.forEach((id) => {
    if (isNullOrWhiteSpace(id)) return;
    const index = state.historyEntries.findIndex((e) => e.id === id);
    if (index !== -1) {
      state.historyEntries.splice(index, 1);
    }
  });
  if (!preventLocalStorageUpdate) {
    setLocalState(key, state);
  }
}

function _setRecentEntriesInState(
  state: EntriesState,
  payload: {
    entries: string[];
  },
  preventLocalStorageUpdate = false
) {
  const entries = payload.entries.map((entry) => JSON.parse(entry) as Entry);
  state.recentEntries = entries;
  if (!preventLocalStorageUpdate) {
    setLocalState(key, state);
  }
}

function _setHistoryEntriesInState(
  state: EntriesState,
  payload: {
    entries: string[];
  },
  preventLocalStorageUpdate = false
) {
  const entries = payload.entries.map((entry) => JSON.parse(entry) as Entry);
  state.historyEntries = entries;
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
  initialState: getInitialState(key, defaultState, parser),
  reducers: {
    addRecentEntryInState: (
      state,
      action: PayloadAction<{
        entry: string;
      }>
    ) => {
      _addRecentEntryToState(state, action.payload);
    },
    addRecentEntriesInState: (
      state,
      action: PayloadAction<{
        entries: string[];
      }>
    ) => {
      _addRecentEntriesToState(state, action.payload);
    },
    addHistoryEntryInState: (
      state,
      action: PayloadAction<{
        entry: string;
      }>
    ) => {
      _addHistoryEntryToState(state, action.payload);
    },
    addHistoryEntriesInState: (
      state,
      action: PayloadAction<{
        entries: string[];
      }>
    ) => {
      _addHistoryEntriesToState(state, action.payload);
    },
    updateRecentEntryInState: (
      state,
      action: PayloadAction<{
        entry: string;
      }>
    ) => {
      _updateRecentEntryInState(state, action.payload);
    },
    updateRecentEntriesInState: (
      state,
      action: PayloadAction<{
        entries: string[];
      }>
    ) => {
      _updateRecentEntriesInState(state, action.payload);
    },
    updateHistoryEntryInState: (
      state,
      action: PayloadAction<{
        entry: string;
      }>
    ) => {
      _updateHistoryEntryInState(state, action.payload);
    },
    updateHistoryEntriesInState: (
      state,
      action: PayloadAction<{
        entries: string[];
      }>
    ) => {
      _updateHistoryEntriesInState(state, action.payload);
    },
    removeRecentEntryFromState: (
      state,
      action: PayloadAction<{
        id: string;
      }>
    ) => {
      _removeRecentEntryFromState(state, action.payload);
    },
    removeRecentEntriesFromState: (
      state,
      action: PayloadAction<{
        ids: string[];
      }>
    ) => {
      _removeRecentEntriesFromState(state, action.payload);
    },
    removeHistoryEntryFromState: (
      state,
      action: PayloadAction<{
        id: string;
      }>
    ) => {
      _removeHistoryEntryFromState(state, action.payload);
    },
    removeHistoryEntriesFromState: (
      state,
      action: PayloadAction<{
        ids: string[];
      }>
    ) => {
      _removeHistoryEntriesFromState(state, action.payload);
    },
    setRecentEntriesInState: (
      state,
      action: PayloadAction<{
        entries: string[];
      }>
    ) => {
      _setRecentEntriesInState(state, action.payload);
    },
    setHistoryEntriesInState: (
      state,
      action: PayloadAction<{
        entries: string[];
      }>
    ) => {
      _setHistoryEntriesInState(state, action.payload);
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
      _setRecentEntriesInState(state, {
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
      _updateRecentEntryInState(state, { entry: JSON.stringify(entry) });
      _updateHistoryEntryInState(state, { entry: JSON.stringify(entry) });
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
      _removeRecentEntryFromState(state, { id: entryId });
      _removeHistoryEntryFromState(state, { id: entryId });
      _setStatusInState(state, "idle");
    });
    builder.addCase(deleteEntryInDB.rejected, (state, action) => {
      console.error("Error deleting entry: ", action.payload);
      _setStatusInState(state, "idle");
    });
    builder.addCase(fetchHistoryEntriesFromDB.pending, (state, action) => {
      _setStatusInState(state, "busy");
    });
    builder.addCase(fetchHistoryEntriesFromDB.fulfilled, (state, action) => {
      const entries = action.payload as Entry[];
      _setHistoryEntriesInState(state, {
        entries: entries.map((e) => JSON.stringify(e)),
      });
      _setStatusInState(state, "idle");
    });
    builder.addCase(fetchHistoryEntriesFromDB.rejected, (state, action) => {
      console.error("Error fetching history entries: ", action.payload);
      _setStatusInState(state, "idle");
    });
  },
});

export const {
  updateRecentEntryInState,
  resetState,
  removeRecentEntryFromState,
  addRecentEntriesInState,
  addRecentEntryInState,
  removeRecentEntriesFromState,
  setRecentEntriesInState,
  setLastFetchTimestampInState,
  updateRecentEntriesInState,
} = slice.actions;

export const selectRecentEntries = (state: RootState) =>
  state.entriesReducer.recentEntries;

export const selectHistoryEntries = (state: RootState) =>
  state.entriesReducer.historyEntries;

export const selectEntriesStatus = (state: RootState) =>
  state.entriesReducer.status;

export default slice.reducer;
