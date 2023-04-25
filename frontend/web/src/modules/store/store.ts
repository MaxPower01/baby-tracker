import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import appReducer from "../../app/state/appSlice";

const reducer = {
  app: appReducer,
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
