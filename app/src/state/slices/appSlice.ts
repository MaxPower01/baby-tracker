import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getInitialState, setLocalState } from "@/utils/utils";

import AppState from "@/state/types/AppState";
import { LocalStorageKey } from "@/enums/LocalStorageKey";
import StoreReducerName from "@/enums/StoreReducerName";

const key = LocalStorageKey.AppState;

const defaultState: AppState = {
  colorMode: "system",
};

const parser = (state: AppState) => {
  if (!state.colorMode) {
    state = defaultState;
  }
  return state;
};

const slice = createSlice({
  name: StoreReducerName.App,
  initialState: getInitialState(key, defaultState, parser),
  reducers: {
    resetAppState: (state) => {
      Object.assign(state, defaultState);
      setLocalState(key, state);
    },
    setColorMode: (
      state,
      action: PayloadAction<"light" | "dark" | "system">
    ) => {
      state.colorMode = action.payload;
      setLocalState(key, state);
    },
  },
});

export const { resetAppState, setColorMode } = slice.actions;

export default slice.reducer;
