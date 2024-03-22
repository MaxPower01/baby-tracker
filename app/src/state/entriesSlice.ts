import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Timestamp, addDoc, collection, doc, setDoc } from "firebase/firestore";
import {
  getInitialState,
  isNullOrWhiteSpace,
  setLocalState,
} from "@/utils/utils";

import ActivityType from "@/pages/Activity/enums/ActivityType";
import CustomUser from "@/pages/Authentication/types/CustomUser";
import EntriesState from "@/pages/Entries/types/EntriesState";
import { Entry } from "@/pages/Entry/types/Entry";
import { LocalStorageKey } from "@/enums/LocalStorageKey";
import { RECENT_DATA_AGE_LIMIT } from "@/constants/RECENT_DATA_AGE_LIMIT";
import { RECENT_DATA_FETCH_COOLDOWN } from "@/constants/RECENT_DATA_FETCH_COOLDOWN";
import { RootState } from "@/state/store";
import StoreReducerName from "@/enums/StoreReducerName";
import { createSelector } from "@reduxjs/toolkit";
import { db } from "@/firebase";
import { getEntryToSave } from "@/pages/Entry/utils/getEntryToSave";
import { getRangeStartTimestampForRecentEntries } from "@/utils/getRangeStartTimestampForRecentEntries";
import { getTimestamp } from "@/utils/getTimestamp";

const key = LocalStorageKey.EntriesState;

const defaultState: EntriesState = {
  entries: [],
  latestRecentEntriesFetchedTimestamp: null,
  status: "idle",
};

export const fetchRecentEntries = createAsyncThunk(
  "entries/fetchInitialEntries",
  async (_, { dispatch, getState }) => {
    const { latestRecentEntriesFetchedTimestamp: lastFetchTimestamp } = (
      getState() as RootState
    ).entriesReducer;
    const now = Date.now();
    if (
      lastFetchTimestamp &&
      now - lastFetchTimestamp < RECENT_DATA_FETCH_COOLDOWN
    ) {
      return;
    }
    try {
      // const response = await fetchEntries();
      dispatch(
        setLastFetchTimestamp({
          timestamp: now,
        })
      );
      // return response.data;
    } catch (err) {
      // Gérer l'erreur
    }
  }
);

export const saveEntry = createAsyncThunk(
  "entries/saveEntry",
  async (
    props: {
      entry: Entry;
      user: CustomUser;
    },
    thunkAPI
  ) => {
    const { entry, user } = props;
    const selectedChild = user?.selectedChild ?? "";
    if (user == null || isNullOrWhiteSpace(selectedChild)) {
      return thunkAPI.rejectWithValue("User or selected child is null");
    }
    const entryToSave = getEntryToSave(entry);
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
          collection(db, `children/${selectedChild}/entries`),
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
          doc(db, `children/${selectedChild}/entries/${id}`),
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

function addEntryToState(
  state: EntriesState,
  payload: {
    entry: string;
  }
) {
  const entry = JSON.parse(payload.entry) as Entry;
  const index = state.entries.findIndex((entry) => entry.id === entry.id);
  if (index === -1) {
    state.entries.push(entry);
  }
  setLocalState(key, state);
}

function addEntriesToState(
  state: EntriesState,
  payload: {
    entries: string[];
  }
) {
  const entries = payload.entries.map((entry) => JSON.parse(entry) as Entry);
  entries.forEach((entry) => {
    addEntryToState(state, { entry: JSON.stringify(entry) });
  });
  setLocalState(key, state);
}

function updateEntryInState(
  state: EntriesState,
  payload: {
    entry: string;
  }
) {
  const entry = JSON.parse(payload.entry) as Entry;
  const index = state.entries.findIndex((entry) => entry.id === entry.id);
  if (index !== -1) {
    state.entries[index] = entry;
  } else {
    addEntryToState(state, payload);
  }
  setLocalState(key, state);
}

function updateEntriesInState(
  state: EntriesState,
  payload: {
    entries: string[];
  }
) {
  const entries = payload.entries.map((entry) => JSON.parse(entry) as Entry);
  entries.forEach((entry) => {
    updateEntryInState(state, { entry: JSON.stringify(entry) });
  });
  setLocalState(key, state);
}

function removeEntryFromState(
  state: EntriesState,
  payload: {
    id: string;
  }
) {
  const index = state.entries.findIndex((entry) => entry.id === payload.id);
  if (index !== -1) {
    state.entries.splice(index, 1);
  }
  setLocalState(key, state);
}

function removeEntriesFromState(
  state: EntriesState,
  payload: {
    ids: string[];
  }
) {
  payload.ids.forEach((id) => {
    if (isNullOrWhiteSpace(id)) return;
    const index = state.entries.findIndex((entry) => entry.id === id);
    if (index !== -1) {
      state.entries.splice(index, 1);
    }
  });
  setLocalState(key, state);
}

function setEntriesInState(
  state: EntriesState,
  payload: {
    entries: string[];
  }
) {
  const entries = payload.entries.map((entry) => JSON.parse(entry) as Entry);
  state.entries = entries;
  setLocalState(key, state);
}

function resetState(state: EntriesState) {
  Object.assign(state, defaultState);
  setLocalState(key, state);
}

function setLastFetchTimestampInState(
  state: EntriesState,
  payload: {
    timestamp: number;
  }
) {
  state.latestRecentEntriesFetchedTimestamp = payload.timestamp;
  setLocalState(key, state);
}

function setStatusInState(
  state: EntriesState,
  status: "idle" | "loading" | "saving"
) {
  state.status = status;
  setLocalState(key, state);
}

const slice = createSlice({
  name: StoreReducerName.Entries,
  initialState: getInitialState(key, defaultState),
  reducers: {
    addEntry: (
      state,
      action: PayloadAction<{
        entry: string;
      }>
    ) => {
      addEntryToState(state, action.payload);
    },
    addEntries: (
      state,
      action: PayloadAction<{
        entries: string[];
      }>
    ) => {
      addEntriesToState(state, action.payload);
    },
    updateEntry: (
      state,
      action: PayloadAction<{
        entry: string;
      }>
    ) => {
      updateEntryInState(state, action.payload);
    },
    updateEntries: (
      state,
      action: PayloadAction<{
        entries: string[];
      }>
    ) => {
      updateEntriesInState(state, action.payload);
    },
    removeEntry: (
      state,
      action: PayloadAction<{
        id: string;
      }>
    ) => {
      removeEntryFromState(state, action.payload);
    },
    removeEntries: (
      state,
      action: PayloadAction<{
        ids: string[];
      }>
    ) => {
      removeEntriesFromState(state, action.payload);
    },
    setEntries: (
      state,
      action: PayloadAction<{
        entries: string[];
      }>
    ) => {
      setEntriesInState(state, action.payload);
    },
    resetEntriesState: (state) => {
      resetState(state);
    },
    setLastFetchTimestamp: (
      state,
      action: PayloadAction<{
        timestamp: number;
      }>
    ) => {
      setLastFetchTimestampInState(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRecentEntries.pending, (state, action) => {
      setStatusInState(state, "loading");
    });
    builder.addCase(fetchRecentEntries.fulfilled, (state, action) => {
      setStatusInState(state, "idle");
    });
    builder.addCase(fetchRecentEntries.rejected, (state, action) => {
      setStatusInState(state, "idle");
    });
    builder.addCase(saveEntry.pending, (state, action) => {
      setStatusInState(state, "saving");
    });
    builder.addCase(saveEntry.fulfilled, (state, action) => {
      updateEntryInState(state, { entry: JSON.stringify(action.payload) });
      setStatusInState(state, "idle");
    });
    builder.addCase(saveEntry.rejected, (state, action) => {
      setStatusInState(state, "idle");
    });
  },
});

export const {
  updateEntry,
  resetEntriesState,
  removeEntry,
  addEntries,
  addEntry,
  removeEntries,
  setEntries,
  setLastFetchTimestamp,
  updateEntries,
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
