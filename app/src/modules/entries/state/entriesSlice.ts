import LocalStorageKey from "@/common/enums/LocalStorageKey";
import { getInitialState, setLocalState } from "@/lib/utils";
import ActivityType from "@/modules/activities/enums/ActivityType";
import EntryModel from "@/modules/entries/models/EntryModel";
import EntriesState from "@/modules/entries/types/EntriesState";
import StoreReducerName from "@/modules/store/enums/StoreReducerName";
import { RootState } from "@/modules/store/store";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const key = LocalStorageKey.EntriesState;

const defaultState: EntriesState = {
  entries: [],
  editingEntryId: undefined,
};

const slice = createSlice({
  name: StoreReducerName.Entries,
  initialState: getInitialState(key, defaultState),
  reducers: {
    updateEntry: (
      state,
      action: PayloadAction<{ id: string; entry: string }>
    ) => {
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
        if (index === -1 && entry.id != null) {
          state.entries.push({
            id: entry.id,
            entry: e,
          });
        } else if (action.payload.overwrite && entry.id != null) {
          state.entries[index] = {
            id: entry.id,
            entry: e,
          };
        }
      });
      setLocalState(key, state);
    },
    removeEntry: (state, action: PayloadAction<string>) => {
      const index = state.entries.findIndex((e) => e.id === action.payload);
      if (index !== -1) {
        state.entries.splice(index, 1);
      }
      setLocalState(key, state);
    },
    resetEntriesState: (state) => {
      Object.assign(state, defaultState);
      setLocalState(key, state);
    },
    setEditingEntryId: (state, action: PayloadAction<string>) => {
      state.editingEntryId = action.payload;
    },
  },
});

export const {
  updateEntry,
  resetEntriesState,
  removeEntry,
  addEntries,
  setEditingEntryId,
} = slice.actions;

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

export const selectEditingEntryId = (state: RootState) => {
  return state.entriesReducer.editingEntryId;
};

export const selectLastEntry = (
  state: RootState,
  activityType: ActivityType
) => {
  const entries = selectEntries(state);
  if (!entries) {
    return undefined;
  }
  return entries.find(
    (entry) => entry.activity && entry.activity.type === activityType
  );
};

export default slice.reducer;
