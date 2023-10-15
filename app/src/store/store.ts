import activitiesReducer from "@/pages/Activities/state/activitiesSlice";
import appReducer from "@/app/state/appSlice";
import { configureStore } from "@reduxjs/toolkit";
import entriesReducer from "@/pages/Entries/state/entriesSlice";
import logger from "redux-logger";
import settingsReducer from "@/pages/Settings/state/settingsSlice";

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
