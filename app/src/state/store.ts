import activitiesReducer from "@/state/slices/activitiesSlice";
import appReducer from "@/state/slices/appSlice";
import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import settingsReducer from "@/state/slices/settingsSlice";

const reducer = {
  appReducer,
  settingsReducer,
  activitiesReducer,
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
