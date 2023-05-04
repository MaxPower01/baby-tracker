import LocalStorageKey from "@/common/enums/LocalStorageKey";
import { getInitialState, setLocalState } from "@/lib/utils";
import StoreReducerName from "@/modules/store/enums/StoreReducerName";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
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
