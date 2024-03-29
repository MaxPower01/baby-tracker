import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  RECENT_DATA_AGE_LIMIT_IN_MILLISECONDS,
  RECENT_DATA_AGE_LIMIT_IN_SECONDS,
} from "@/constants/RECENT_DATA_AGE_LIMIT";
import {
  RECENT_DATA_FETCH_COOLDOWN_IN_MILLISECONDS,
  RECENT_DATA_FETCH_COOLDOWN_IN_SECONDS,
} from "@/constants/RECENT_DATA_FETCH_COOLDOWN";
import {
  Timestamp,
  addDoc,
  collection,
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

import ActivityType from "@/pages/Activity/enums/ActivityType";
import CustomUser from "@/pages/Authentication/types/CustomUser";
import EntriesState from "@/pages/Entries/types/EntriesState";
import { Entry } from "@/pages/Entry/types/Entry";
import { LocalStorageKey } from "@/enums/LocalStorageKey";
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
      const limitTimestamp = newTimestamp - RECENT_DATA_AGE_LIMIT_IN_SECONDS;
      const anyRecentEntries = currentEntries.some(
        (entry) => entry.startTimestamp >= limitTimestamp
      );
      if (
        lastFetchTimestamp &&
        newTimestamp - lastFetchTimestamp <
          RECENT_DATA_FETCH_COOLDOWN_IN_SECONDS &&
        anyRecentEntries
      ) {
        return thunkAPI.rejectWithValue("Cooldown not elapsed");
      }
      thunkAPI.dispatch(
        setLastFetchTimestamp({
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

function addEntryToState(
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

function addEntriesToState(
  state: EntriesState,
  payload: {
    entries: string[];
  },
  preventLocalStorageUpdate = false
) {
  const entries = payload.entries.map((entry) => JSON.parse(entry) as Entry);
  entries.forEach((entry) => {
    addEntryToState(state, { entry: JSON.stringify(entry) }, true);
  });
  if (!preventLocalStorageUpdate) {
    setLocalState(key, state);
  }
}

function updateEntryInState(
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
    addEntryToState(state, payload, true);
  }
  if (!preventLocalStorageUpdate) {
    setLocalState(key, state);
  }
}

function updateEntriesInState(
  state: EntriesState,
  payload: {
    entries: string[];
  },
  preventLocalStorageUpdate = false
) {
  const entries = payload.entries.map((entry) => JSON.parse(entry) as Entry);
  entries.forEach((entry) => {
    updateEntryInState(state, { entry: JSON.stringify(entry) }, true);
  });
  if (!preventLocalStorageUpdate) {
    setLocalState(key, state);
  }
}

function removeEntryFromState(
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

function removeEntriesFromState(
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

function setEntriesInState(
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

function resetState(state: EntriesState, preventLocalStorageUpdate = false) {
  Object.assign(state, defaultState);
  if (!preventLocalStorageUpdate) {
    setLocalState(key, state);
  }
}

function setLastFetchTimestampInState(
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

function setStatusInState(
  state: EntriesState,
  status: "idle" | "loading" | "saving",
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
      const entries = action.payload as Entry[];
      setEntriesInState(state, {
        entries: entries.map((e) => JSON.stringify(e)),
      });
      setStatusInState(state, "idle");
    });
    builder.addCase(fetchRecentEntries.rejected, (state, action) => {
      console.error("Error fetching recent entries: ", action.payload);
      setStatusInState(state, "idle");
    });
    builder.addCase(saveEntry.pending, (state, action) => {
      setStatusInState(state, "saving");
    });
    builder.addCase(saveEntry.fulfilled, (state, action) => {
      const entry = action.payload as Entry;
      updateEntryInState(state, { entry: JSON.stringify(entry) });
      setStatusInState(state, "idle");
    });
    builder.addCase(saveEntry.rejected, (state, action) => {
      console.error("Error saving entry: ", action.payload);
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
