import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getInitialState, setLocalState } from "@/utils/utils";

import ActivityType from "@/pages/Activities/enums/ActivityType";
import EntriesState from "@/pages/Entries/types/EntriesState";
import { Entry } from "@/pages/Entries/types/Entry";
import { LocalStorageKey } from "@/enums/LocalStorageKey";
import { RootState } from "@/store/store";
import StoreReducerName from "@/store/enums/StoreReducerName";
import { useAppSelector } from "@/store/hooks/useAppSelector";

const key = LocalStorageKey.EntriesState;

const defaultState: EntriesState = {
  entries: [],
  status: "idle",
};

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
  },
});

export const { updateEntry, resetEntriesState, removeEntry, addEntries } =
  slice.actions;

export const selectEntries = useAppSelector(
  (state) => state.entriesReducer.entries
);

export default slice.reducer;
