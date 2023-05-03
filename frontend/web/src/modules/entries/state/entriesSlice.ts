import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { LocalStorageKey, StoreReducerName } from "../../../lib/enums";
import { getInitialState, setLocalState } from "../../../lib/utils";
import { RootState } from "../../store/store";
import { EntryModel } from "../models/EntryModel";
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
    addEntries: (
      state,
      action: PayloadAction<{
        entries: string[];
        overwrite: boolean;
      }>
    ) => {
      action.payload.entries.forEach((e) => {
        const entry = EntryModel.deserialize(e);
        const index = state.entries.findIndex((s) => s.id === entry.id);
        if (index === -1) {
          state.entries.push({
            id: entry.id,
            entry: e,
          });
        } else if (action.payload.overwrite) {
          state.entries[index] = {
            id: entry.id,
            entry: e,
          };
        }
      });
      setLocalState(key, state);
    },
    removeEntry: (state, action: PayloadAction<{ id: string }>) => {
      const index = state.entries.findIndex((e) => e.id === action.payload.id);
      if (index !== -1) {
        state.entries.splice(index, 1);
      }
      setLocalState(key, state);
    },
    resetEntriesState: (state) => {
      Object.assign(state, defaultState);
      setLocalState(key, state);
    },
  },
});

export const { setEntry, resetEntriesState, removeEntry, addEntries } =
  slice.actions;

export const selectEntries = (state: RootState) => {
  return state.entriesReducer.entries
    ?.map(({ id, entry }) => EntryModel.deserialize(entry))
    .sort((a, b) => b.timestamp - a.timestamp);
};

export const selectEntry = (state: RootState, id: string) => {
  if (!id) {
    return undefined;
  }
  return selectEntries(state)?.find((entry) => entry.id === id);
};

export default slice.reducer;