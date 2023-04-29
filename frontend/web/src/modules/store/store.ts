import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import appReducer from "../../app/state/appSlice";
import entriesReducer from "../entries/state/entriesSlice";

const reducer = {
  appReducer,
  entriesReducer,
};

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  devTools: process.env.NODE_ENV !== "production",
  preloadedState: undefined,
  enhancers: [],
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
