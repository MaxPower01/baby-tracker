import activitiesReducer from "@/state/slices/activitiesSlice";
import appReducer from "@/state/slices/appSlice";
import { configureStore } from "@reduxjs/toolkit";
import entriesReducer from "@/state/slices/entriesSlice";
import filtersReducer from "@/state/slices/filtersSlice";
import logger from "redux-logger";
import settingsReducer from "@/state/slices/settingsSlice";

const reducer = {
  appReducer,
  entriesReducer,
  settingsReducer,
  activitiesReducer,
  filtersReducer,
};

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(logger as any);
  },
  devTools: process.env.NODE_ENV !== "production",
  preloadedState: undefined,
  enhancers: undefined,
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
