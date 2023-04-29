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
    addEntry: (state, action: PayloadAction<string>) => {
      state.entries.push(action.payload);
      setLocalState(key, state);
    },
    resetEntriesState: (state) => {
      Object.assign(state, defaultState);
      setLocalState(key, state);
    },
  },
});

export const { addEntry, resetEntriesState } = slice.actions;

export const selectEntries = (state: RootState) => {
  return state.entriesReducer.entries
    ?.map((entry) => Entry.deserialize(entry))
    .sort((a, b) => b.startDate.diff(a.startDate));
};

export default slice.reducer;
