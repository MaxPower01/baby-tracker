import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { LocalStorageKey, StoreReducerName } from "../../lib/enums";
import { getInitialState, setLocalState } from "../../lib/utils";
import AppState from "./AppState";

const key = LocalStorageKey.AppState;

const defaultState: AppState = {
  colorMode: "system",
};

const slice = createSlice({
  name: StoreReducerName.App,
  initialState: getInitialState(key, defaultState),
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
