import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { getInitialState, setLocalState } from "@/utils/utils";

import ActivitiesState from "@/pages/Activities/types/ActivitiesState";
import { ActivityContextType } from "@/pages/Activity/enums/ActivityContextType";
import ActivityModel from "@/pages/Activity/models/ActivityModel";
import ActivityType from "@/pages/Activity/enums/ActivityType";
import { LocalStorageKey } from "@/enums/LocalStorageKey";
import { RootState } from "@/state/store";
import StoreReducerName from "@/enums/StoreReducerName";
import getDefaultActivities from "@/pages/Activities/utils/getDefaultActivities";
import getDefaultActivitiesOrder from "@/pages/Activities/utils/getDefaultActivitiesOrder";
import { getDefaultActivityContexts } from "@/pages/Activities/utils/getDefaultActivityContexts";
import { getDefaultNasalHygieneTypes } from "@/pages/Activities/utils/getDefaultNasalHygieneTypes";
import { getDefaultPoopColors } from "@/pages/Activities/utils/getDefaultPoopColors";
import { getDefaultPoopTextureIds } from "@/pages/Activities/utils/getDefaultPoopTextureIds";
import { getDefaultTemperatureMethods } from "@/pages/Activities/utils/getDefaultTemperatureMethods";

const key = LocalStorageKey.ActivitiesState;

const defaultState: ActivitiesState = {
  activities: getDefaultActivities().map((a) => a.serialize()),
  activityContexts: getDefaultActivityContexts(),
  temperatureMethods: getDefaultTemperatureMethods(),
  nasalHygieneTypes: getDefaultNasalHygieneTypes(),
  poopTextures: getDefaultPoopTextureIds(),
  poopColors: getDefaultPoopColors(),
};

const slice = createSlice({
  name: StoreReducerName.Activities,
  initialState: getInitialState(key, defaultState),
  reducers: {
    addActivityContext: (
      state,
      action: PayloadAction<{ activityContext: string }>
    ) => {
      state.activityContexts.push(JSON.parse(action.payload.activityContext));
      setLocalState(key, state);
    },
    updateActivityContexts: (
      state,
      action: PayloadAction<{ activityContexts: string[] }>
    ) => {
      if (!action.payload.activityContexts?.length) {
        return;
      }
      const udpatedActivityContexts = action.payload.activityContexts.map((a) =>
        JSON.parse(a)
      );
      const currentActivityContexts = [...state.activityContexts];
      udpatedActivityContexts.forEach((updatedActivityContext) => {
        const index = currentActivityContexts.findIndex(
          (a) => a.id === updatedActivityContext.id
        );
        if (index !== -1) {
          currentActivityContexts[index] = updatedActivityContext;
        }
      });
      state.activityContexts = currentActivityContexts;
      setLocalState(key, state);
    },
    setActivityContextsOfType: (
      state,
      action: PayloadAction<{
        activityContexts: string[];
        type: ActivityContextType;
      }>
    ) => {
      const activityContexts = action.payload.activityContexts.map((a) =>
        JSON.parse(a)
      );
      const currentActivityContexts = [...state.activityContexts];
      const filteredActivityContexts = currentActivityContexts.filter(
        (a) => a.type !== action.payload.type
      );
      state.activityContexts = [
        ...filteredActivityContexts,
        ...activityContexts,
      ];
      setLocalState(key, state);
    },
  },
});

export const {
  addActivityContext,
  updateActivityContexts,
  setActivityContextsOfType,
} = slice.actions;

export const selectActivities = createSelector(
  (state: RootState) => state.activitiesReducer.activities,
  (activities) => {
    return [...activities].map((a) => ActivityModel.deserialize(a));
  }
);

export const selectActivityContexts = (state: RootState) =>
  state.activitiesReducer.activityContexts.toSorted(
    (a, b) => a.order - b.order
  );

export const selectActivityContextsOfType = createSelector(
  (state: RootState) => state.activitiesReducer.activityContexts,
  (_: RootState, type: ActivityContextType | null) => type,
  (activityContexts, type) => {
    return [...activityContexts]
      .filter((a) => a.type == type)
      .toSorted((a, b) => a.order - b.order);
  }
);

export const selectTemperatureMethods = (state: RootState) =>
  state.activitiesReducer.temperatureMethods;

export const selectNasalHygieneTypes = (state: RootState) =>
  state.activitiesReducer.nasalHygieneTypes;

export const selectPoopTextures = (state: RootState) =>
  state.activitiesReducer.poopTextures;

export const selectPoopColors = (state: RootState) =>
  state.activitiesReducer.poopColors;

export default slice.reducer;
