import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { LocalStorageKey, StoreReducerName } from "../../../lib/enums";
import { getInitialState, setLocalState } from "../../../lib/utils";
import { RootState } from "../../store/store";
import { Entry } from "../models/Entry";
import EntriesState from "./EntriesState";

const key = LocalStorageKey.EntriesState;

const defaultState: EntriesState = {
  entries: [],
};

const slice = createSlice({
  name: StoreReducerName.Entries,
  initialState: getInitialState(key, defaultState),
  reducers: {
    setEntry: (state, action: PayloadAction<{ id: string; entry: string }>) => {
      const index = state.entries.findIndex((e) => e.id === action.payload.id);
      if (index === -1) {
        state.entries.push({
          id: action.payload.id,
          entry: action.payload.entry,
        });
      } else {
        state.entries[index] = {
          id: action.payload.id,
          entry: action.payload.entry,
        };
      }
      setLocalState(key, state);
    },
    resetEntriesState: (state) => {
      Object.assign(state, defaultState);
      setLocalState(key, state);
    },
  },
});

export const { setEntry, resetEntriesState } = slice.actions;

export const selectEntries = (state: RootState) => {
  return state.entriesReducer.entries
    ?.map(({ id, entry }) => Entry.deserialize(entry))
    .sort((a, b) => b.timestamp - a.timestamp);
};

export const selectEntry = (state: RootState, id: string) => {
  if (!id) {
    return undefined;
  }
  return selectEntries(state)?.find((entry) => entry.id === id);
};

export default slice.reducer;
