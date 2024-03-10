import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getInitialState, setLocalState } from "@/utils/utils";

import ActivityType from "@/pages/Activity/enums/ActivityType";
import EntriesState from "@/pages/Entries/types/EntriesState";
import { Entry } from "@/pages/Entry/types/Entry";
import { LocalStorageKey } from "@/enums/LocalStorageKey";
import { RootState } from "@/state/store";
import StoreReducerName from "@/enums/StoreReducerName";

const key = LocalStorageKey.EntriesState;

const defaultState: EntriesState = {
  entries: [],
  lastFetchTimestamp: null,
  status: "idle",
};

export const fetchInitialEntries = createAsyncThunk(
  "entries/fetchInitialEntries",
  async (_, { dispatch, getState }) => {
    const { lastFetchTimestamp } = (getState() as RootState).entriesReducer;
    const now = Date.now();
    const minimumFetchInterval = 1000 * 60 * 30;
    if (lastFetchTimestamp && now - lastFetchTimestamp < minimumFetchInterval) {
      return;
    }
    try {
      // const response = await fetchEntries();
      dispatch(setLastFetchTimestamp(now));
      // return response.data;
    } catch (err) {
      // Gérer l'erreur
    }
  }
);

const slice = createSlice({
  name: StoreReducerName.Entries,
  initialState: getInitialState(key, defaultState),
  reducers: {
    addEntry: (state, action: PayloadAction<Entry>) => {
      const index = state.entries.findIndex(
        (entry) => entry.id === action.payload.id
      );
      if (index === -1) {
        state.entries.push(action.payload);
      }
      setLocalState(key, state);
    },
    addEntries: (state, action: PayloadAction<Entry[]>) => {
      action.payload.forEach((entry) => {
        const index = state.entries.findIndex((e) => e.id === entry.id);
        if (index === -1) {
          state.entries.push(entry);
        }
      });
      setLocalState(key, state);
    },
    updateEntry: (state, action: PayloadAction<Entry>) => {
      const index = state.entries.findIndex(
        (entry) => entry.id === action.payload.id
      );
      if (index !== -1) {
        state.entries[index] = action.payload;
      }
      setLocalState(key, state);
    },
    updateEntries: (state, action: PayloadAction<Entry[]>) => {
      action.payload.forEach((entry) => {
        const index = state.entries.findIndex((e) => e.id === entry.id);
        if (index !== -1) {
          state.entries[index] = entry;
        }
      });
      setLocalState(key, state);
    },
    removeEntry: (state, action: PayloadAction<string>) => {
      const index = state.entries.findIndex(
        (entry) => entry.id === action.payload
      );
      if (index !== -1) {
        state.entries.splice(index, 1);
      }
      setLocalState(key, state);
    },
    removeEntries: (state, action: PayloadAction<string[]>) => {
      action.payload.forEach((id) => {
        const index = state.entries.findIndex((entry) => entry.id === id);
        if (index !== -1) {
          state.entries.splice(index, 1);
        }
      });
      setLocalState(key, state);
    },
    setEntries: (state, action: PayloadAction<Entry[]>) => {
      state.entries = action.payload;
      setLocalState(key, state);
    },
    resetEntriesState: (state) => {
      Object.assign(state, defaultState);
      setLocalState(key, state);
    },
    setLastFetchTimestamp: (state, action: PayloadAction<number>) => {
      state.lastFetchTimestamp = action.payload;
      setLocalState(key, state);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchInitialEntries.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchInitialEntries.fulfilled, (state) => {
      state.status = "idle";
    });
    builder.addCase(fetchInitialEntries.rejected, (state) => {
      state.status = "idle";
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

export default slice.reducer;
