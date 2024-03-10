import activitiesReducer from "@/state/activitiesSlice";
import appReducer from "@/state/appSlice";
import { configureStore } from "@reduxjs/toolkit";
import entriesReducer from "@/state/entriesSlice";
import logger from "redux-logger";
import settingsReducer from "@/state/settingsSlice";

const reducer = {
  appReducer,
  entriesReducer,
  settingsReducer,
  activitiesReducer,
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
