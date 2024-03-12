import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import getDefaultActivitiesOrder, {
  getDefaultActivityContexts,
} from "@/pages/Activities/utils/getDefaultActivitiesOrder";
import { getInitialState, setLocalState } from "@/utils/utils";

import ActivitiesState from "@/pages/Activities/types/ActivitiesState";
import { ActivityContextType } from "@/pages/Activity/enums/ActivityContextType";
import ActivityModel from "@/pages/Activity/models/ActivityModel";
import ActivityType from "@/pages/Activity/enums/ActivityType";
import { LocalStorageKey } from "@/enums/LocalStorageKey";
import { RootState } from "@/state/store";
import StoreReducerName from "@/enums/StoreReducerName";
import getDefaultActivities from "@/pages/Activities/utils/getDefaultActivities";

const key = LocalStorageKey.ActivitiesState;

const defaultState: ActivitiesState = {
  activities: getDefaultActivities().map((a) => a.serialize()),
  activitiesOrder: getDefaultActivitiesOrder(),
  activityContexts: getDefaultActivityContexts(),
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
    addActivityContext: (
      state,
      action: PayloadAction<{ activityContext: string }>
    ) => {
      state.activityContexts.push(JSON.parse(action.payload.activityContext));
      setLocalState(key, state);
    },
  },
});

export const { updateActivitiesOrder, addActivityContext } = slice.actions;

export const selectActivitiesOrder = (state: RootState) =>
  state.activitiesReducer.activitiesOrder;

export const selectActivities = (state: RootState) => {
  const activities = [...state.activitiesReducer.activities].map((a) =>
    ActivityModel.deserialize(a)
  );
  return activities.sort((a, b) => a.order - b.order);
};

export const selectActivityContexts = (state: RootState) =>
  state.activitiesReducer.activityContexts.toSorted(
    (a, b) => a.order - b.order
  );

export const selectActivityContextsOfType = (
  state: RootState,
  type: ActivityContextType | null
) => {
  return state.activitiesReducer.activityContexts
    .filter((a) => a.type === type)
    .toSorted((a, b) => a.order - b.order);
};

export default slice.reducer;
