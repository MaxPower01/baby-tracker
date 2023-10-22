import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getInitialState, setLocalState } from "@/utils/utils";

import AppState from "@/app/types/AppState";
import { LocalStorageKey } from "@/enums/LocalStorageKey";
import StoreReducerName from "@/store/enums/StoreReducerName";

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
