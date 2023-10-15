import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getInitialState, setLocalState } from "@/utils/utils";

import ActivitiesState from "@/pages/Activities/types/ActivitiesState";
import ActivityModel from "@/pages/Activities/models/ActivityModel";
import ActivityType from "@/pages/Activities/enums/ActivityType";
import LocalStorageKey from "@/enums/LocalStorageKey";
import { RootState } from "@/store/store";
import StoreReducerName from "@/store/enums/StoreReducerName";
import getDefaultActivities from "@/pages/Activities/utils/getDefaultActivities";
import getDefaultActivitiesOrder from "@/pages/Activities/utils/getDefaultActivitiesOrder";

const key = LocalStorageKey.ActivitiesState;

const defaultState: ActivitiesState = {
  activities: getDefaultActivities().map((a) => a.serialize()),
  activitiesOrder: getDefaultActivitiesOrder(),
};

const slice = createSlice({
  name: StoreReducerName.Activities,
  initialState: getInitialState(key, defaultState),
  reducers: {
    updateActivitiesOrder: (
      state,
      action: PayloadAction<{ activitiesOrder: ActivityType[] }>
    ) => {
      const newActivities = [...state.activities].map((a) => {
        const activity = ActivityModel.deserialize(a);
        activity.order = action.payload.activitiesOrder.indexOf(activity.type);
        return activity;
      });
      newActivities.sort((a, b) => a.order - b.order);
      state.activitiesOrder = action.payload.activitiesOrder;
      state.activities = [...newActivities].map((a) => a.serialize());
      setLocalState(key, state);
    },
  },
});

export const { updateActivitiesOrder } = slice.actions;

export const selectActivitiesOrder = (state: RootState) =>
  state.activitiesReducer.activitiesOrder;

export const selectActivities = (state: RootState) => {
  const activities = [...state.activitiesReducer.activities].map((a) =>
    ActivityModel.deserialize(a)
  );
  return activities.sort((a, b) => a.order - b.order);
};

export default slice.reducer;
