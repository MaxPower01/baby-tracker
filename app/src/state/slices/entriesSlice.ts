import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getInitialState,
  isNullOrWhiteSpace,
  setLocalState,
} from "@/utils/utils";

import ActivityType from "@/pages/Activity/enums/ActivityType";
import EntriesState from "@/pages/Entries/types/EntriesState";
import { Entry } from "@/pages/Entry/types/Entry";
import { LocalStorageKey } from "@/enums/LocalStorageKey";
import { RECENT_DATA_AGE_LIMIT } from "@/constants/RECENT_DATA_AGE_LIMIT";
import { RECENT_DATA_FETCH_COOLDOWN } from "@/constants/RECENT_DATA_FETCH_COOLDOWN";
import { RootState } from "@/state/store";
import StoreReducerName from "@/enums/StoreReducerName";
import { Timestamp } from "firebase/firestore";
import { createSelector } from "@reduxjs/toolkit";
import { getRangeStartTimestampForRecentEntries } from "@/utils/getRangeStartTimestampForRecentEntries";

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

// TODO: Instead of using Entry in the payloads, we should pass a stringified version of the entry and parse it in the reducer

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
      const entry = JSON.parse(action.payload.entry) as Entry;
      const index = state.entries.findIndex((entry) => entry.id === entry.id);
      if (index === -1) {
        state.entries.push(entry);
      }
      setLocalState(key, state);
    },
    addEntries: (
      state,
      action: PayloadAction<{
        entries: string[];
      }>
    ) => {
      const entries = action.payload.entries.map(
        (entry) => JSON.parse(entry) as Entry
      );
      entries.forEach((entry) => {
        const index = state.entries.findIndex((e) => e.id === entry.id);
        if (index === -1) {
          state.entries.push(entry);
        }
      });
      setLocalState(key, state);
    },
    updateEntry: (
      state,
      action: PayloadAction<{
        entry: string;
      }>
    ) => {
      const entry = JSON.parse(action.payload.entry) as Entry;
      const index = state.entries.findIndex((entry) => entry.id === entry.id);
      if (index !== -1) {
        state.entries[index] = entry;
      }
      setLocalState(key, state);
    },
    updateEntries: (
      state,
      action: PayloadAction<{
        entries: string[];
      }>
    ) => {
      const entries = action.payload.entries.map(
        (entry) => JSON.parse(entry) as Entry
      );
      entries.forEach((entry) => {
        const index = state.entries.findIndex((e) => e.id === entry.id);
        if (index !== -1) {
          state.entries[index] = entry;
        }
      });
      setLocalState(key, state);
    },
    removeEntry: (
      state,
      action: PayloadAction<{
        id: string;
      }>
    ) => {
      const index = state.entries.findIndex(
        (entry) => entry.id === action.payload.id
      );
      if (index !== -1) {
        state.entries.splice(index, 1);
      }
      setLocalState(key, state);
    },
    removeEntries: (
      state,
      action: PayloadAction<{
        ids: string[];
      }>
    ) => {
      action.payload.ids.forEach((id) => {
        if (isNullOrWhiteSpace(id)) return;
        const index = state.entries.findIndex((entry) => entry.id === id);
        if (index !== -1) {
          state.entries.splice(index, 1);
        }
      });
      setLocalState(key, state);
    },
    setEntries: (
      state,
      action: PayloadAction<{
        entries: string[];
      }>
    ) => {
      const entries = action.payload.entries.map(
        (entry) => JSON.parse(entry) as Entry
      );
      state.entries = entries;
      setLocalState(key, state);
    },
    resetEntriesState: (state) => {
      Object.assign(state, defaultState);
      setLocalState(key, state);
    },
    setLastFetchTimestamp: (
      state,
      action: PayloadAction<{
        timestamp: number;
      }>
    ) => {
      state.latestRecentEntriesFetchedTimestamp = action.payload.timestamp;
      setLocalState(key, state);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRecentEntries.pending, (state) => {
      console.log("fetchRecentEntries.pending");
      state.status = "loading";
    });
    builder.addCase(fetchRecentEntries.fulfilled, (state) => {
      console.log("fetchRecentEntries.fulfilled");
      state.status = "idle";
    });
    builder.addCase(fetchRecentEntries.rejected, (state) => {
      console.log("fetchRecentEntries.rejected");
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

export const selectRecentEntries = createSelector(
  (state: RootState) => state.entriesReducer.entries,
  (entries) => {
    try {
      const rangeStartTimestamp = getRangeStartTimestampForRecentEntries();
      return entries.filter(
        (entry) => entry.startTimestamp.seconds >= rangeStartTimestamp.seconds
      );
    } catch (error) {
      return [];
    }
  }
);

export default slice.reducer;
