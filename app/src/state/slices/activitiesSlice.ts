import {
  PayloadAction,
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { doc, updateDoc } from "firebase/firestore";
import { getInitialState, setLocalState } from "@/utils/utils";

import ActivitiesState from "@/state/types/ActivitiesState";
import { ActivityContextType } from "@/pages/Activity/enums/ActivityContextType";
import CustomUser from "@/types/CustomUser";
import { LocalStorageKey } from "@/enums/LocalStorageKey";
import { RootState } from "@/state/store";
import StoreReducerName from "@/enums/StoreReducerName";
import { db } from "@/firebase";
import { getDefaultActivityContexts } from "@/pages/Activities/utils/getDefaultActivityContexts";
import { getDefaultNasalHygieneTypes } from "@/pages/Activities/utils/getDefaultNasalHygieneTypes";
import { getDefaultPoopColors } from "@/pages/Activities/utils/getDefaultPoopColors";
import { getDefaultPoopTextureIds } from "@/pages/Activities/utils/getDefaultPoopTextureIds";
import { getDefaultTemperatureMethods } from "@/pages/Activities/utils/getDefaultTemperatureMethods";

const key = LocalStorageKey.ActivitiesState;

const defaultState: ActivitiesState = {
  activityContexts: getDefaultActivityContexts(),
  temperatureMethods: getDefaultTemperatureMethods(),
  nasalHygieneTypes: getDefaultNasalHygieneTypes(),
  poopTextures: getDefaultPoopTextureIds(),
  poopColors: getDefaultPoopColors(),
  status: "idle",
};

const parser = (state: ActivitiesState) => {
  if (
    !state.activityContexts ||
    !state.temperatureMethods ||
    !state.nasalHygieneTypes ||
    !state.poopTextures ||
    !state.poopColors ||
    !state.status
  ) {
    state = defaultState;
  } else {
    state.poopColors = getDefaultPoopColors();
    state.poopTextures = getDefaultPoopTextureIds();
  }
  return state;
};

function _addActivityContextInState(
  state: ActivitiesState,
  payload: { activityContext: string },
  preventLocalStorageUpdate = false
) {
  const parsedActivityContext = JSON.parse(payload.activityContext);
  const index = state.activityContexts.findIndex(
    (a) => a.id === parsedActivityContext.id
  );
  if (index === -1) {
    state.activityContexts.push(parsedActivityContext);
  }
  if (!preventLocalStorageUpdate) {
    setLocalState(key, state);
  }
}

export const addActivityContextInDB = createAsyncThunk(
  "activities/addActivityContext",
  async (
    props: {
      user: CustomUser;
      activityContext: string;
    },
    thunkAPI
  ) => {
    const { user, activityContext } = props;
    if (user == null || user.uid == null || user.babyId == null) {
      return thunkAPI.rejectWithValue(
        "Cannot save activity context because user, user id or baby id is null"
      );
    }
    let newActivityContexts = [];
    try {
      const state = (thunkAPI.getState() as RootState).activitiesReducer;
      const parsedActivityContext = JSON.parse(activityContext);
      newActivityContexts = [...state.activityContexts, parsedActivityContext];
      const babyDocRef = doc(db, "babies", user.babyId);
      await updateDoc(babyDocRef, {
        activityContexts: newActivityContexts,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
    return thunkAPI.fulfillWithValue(activityContext);
  }
);

function _saveActivityContextsInState(
  state: ActivitiesState,
  payload: { activityContexts: string[] },
  preventLocalStorageUpdate = false
) {
  if (!payload.activityContexts?.length) {
    return;
  }
  const udpatedActivityContexts = payload.activityContexts.map((a) =>
    JSON.parse(a)
  );
  let currentActivityContexts = [...state.activityContexts];
  udpatedActivityContexts.forEach((updatedActivityContext) => {
    const index = currentActivityContexts.findIndex(
      (a) => a.id === updatedActivityContext.id
    );
    if (index !== -1) {
      currentActivityContexts[index] = updatedActivityContext;
    } else {
      currentActivityContexts.push(updatedActivityContext);
    }
  });
  // Make sure that there's no duplicates by checking the id
  const currentActivityContextsIds = currentActivityContexts.map((a) => a.id);
  currentActivityContexts = currentActivityContexts.filter(
    (a, index) => currentActivityContextsIds.indexOf(a.id) === index
  );
  state.activityContexts = currentActivityContexts;
  if (!preventLocalStorageUpdate) {
    setLocalState(key, state);
  }
}

export const saveActivityContextsInDB = createAsyncThunk(
  "activities/saveActivityContexts",
  async (
    props: {
      user: CustomUser;
      activityContexts: string[];
    },
    thunkAPI
  ) => {
    const { user, activityContexts } = props;
    if (user == null || user.uid == null || user.babyId == null) {
      return thunkAPI.rejectWithValue(
        "Cannot save entry types order because user, user id or baby id is null"
      );
    }
    let newActivityContexts = [];
    try {
      if (!activityContexts?.length) {
        return;
      }
      const udpatedActivityContexts = activityContexts.map((a) =>
        JSON.parse(a)
      );
      const state = (thunkAPI.getState() as RootState).activitiesReducer;
      const currentActivityContexts = [...state.activityContexts];
      udpatedActivityContexts.forEach((updatedActivityContext) => {
        const index = currentActivityContexts.findIndex(
          (a) => a.id === updatedActivityContext.id
        );
        if (index !== -1) {
          currentActivityContexts[index] = updatedActivityContext;
        }
      });
      newActivityContexts = currentActivityContexts;
      const babyDocRef = doc(db, "babies", user.babyId);
      await updateDoc(babyDocRef, {
        activityContexts: newActivityContexts,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
    return thunkAPI.fulfillWithValue(
      newActivityContexts.map((a) => JSON.stringify(a))
    );
  }
);

function _saveActivityContextsOfTypeInState(
  state: ActivitiesState,
  payload: {
    activityContexts: string[];
    type: ActivityContextType;
  },
  preventLocalStorageUpdate = false
) {
  const activityContexts = payload.activityContexts.map((a) => JSON.parse(a));
  const currentActivityContexts = [...state.activityContexts];
  const filteredActivityContexts = currentActivityContexts.filter(
    (a) => a.type !== payload.type
  );
  state.activityContexts = [...filteredActivityContexts, ...activityContexts];
  if (!preventLocalStorageUpdate) {
    setLocalState(key, state);
  }
}

export const saveActivityContextsOfTypeInDB = createAsyncThunk(
  "activities/saveActivityContextsOfType",
  async (
    props: {
      user: CustomUser;
      activityContexts: string[];
      type: ActivityContextType;
    },
    thunkAPI
  ) => {
    const { user, activityContexts, type } = props;
    if (user == null || user.uid == null || user.babyId == null) {
      return thunkAPI.rejectWithValue(
        "Cannot save entry types order because user, user id or baby id is null"
      );
    }
    let newActivityContexts = [];
    try {
      const state = (thunkAPI.getState() as RootState).activitiesReducer;
      const parsedActivityContexts = activityContexts.map((a) => JSON.parse(a));
      const currentActivityContexts = [...state.activityContexts];
      const filteredActivityContexts = currentActivityContexts.filter(
        (a) => a.type !== type
      );
      newActivityContexts = [
        ...filteredActivityContexts,
        ...parsedActivityContexts,
      ];
      const babyDocRef = doc(db, "babies", user.babyId);
      await updateDoc(babyDocRef, {
        activityContexts: newActivityContexts,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
    return thunkAPI.fulfillWithValue(
      newActivityContexts.map((a) => JSON.stringify(a))
    );
  }
);

function _setStatusInState(
  state: ActivitiesState,
  status: "idle" | "busy" | "busy",
  preventLocalStorageUpdate = false
) {
  state.status = status;
  if (!preventLocalStorageUpdate) {
    setLocalState(key, state);
  }
}

const slice = createSlice({
  name: StoreReducerName.Activities,
  initialState: getInitialState(key, defaultState, parser),
  reducers: {
    addActivityContextInState: (
      state,
      action: PayloadAction<{ activityContext: string }>
    ) => {
      _addActivityContextInState(state, action.payload);
    },
    saveActivityContextsInState: (
      state,
      action: PayloadAction<{ activityContexts: string[] }>
    ) => {
      _saveActivityContextsInState(state, action.payload);
    },
    saveActivityContextsOfTypeInState: (
      state,
      action: PayloadAction<{
        activityContexts: string[];
        type: ActivityContextType;
      }>
    ) => {
      _saveActivityContextsOfTypeInState(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(saveActivityContextsInDB.pending, (state) => {
      _setStatusInState(state, "busy");
    });
    builder.addCase(saveActivityContextsInDB.fulfilled, (state, action) => {
      const activityContexts = action.payload as string[];
      _saveActivityContextsInState(state, { activityContexts });
      _setStatusInState(state, "idle");
    });
    builder.addCase(saveActivityContextsInDB.rejected, (state) => {
      _setStatusInState(state, "idle");
    });
    builder.addCase(saveActivityContextsOfTypeInDB.pending, (state) => {
      _setStatusInState(state, "busy");
    });
    builder.addCase(
      saveActivityContextsOfTypeInDB.fulfilled,
      (state, action) => {
        const activityContexts = action.payload as string[];
        _saveActivityContextsInState(state, { activityContexts });
        _setStatusInState(state, "idle");
      }
    );
    builder.addCase(saveActivityContextsOfTypeInDB.rejected, (state) => {
      _setStatusInState(state, "idle");
    });
    builder.addCase(addActivityContextInDB.pending, (state) => {
      _setStatusInState(state, "busy");
    });
    builder.addCase(addActivityContextInDB.fulfilled, (state, action) => {
      _addActivityContextInState(state, { activityContext: action.payload });
      _setStatusInState(state, "idle");
    });
    builder.addCase(addActivityContextInDB.rejected, (state) => {
      _setStatusInState(state, "idle");
    });
  },
});

export const {
  addActivityContextInState,
  saveActivityContextsInState,
  saveActivityContextsOfTypeInState,
} = slice.actions;

// export const selectActivityContexts = (state: RootState) =>
//   state.activitiesReducer.activityContexts.toSorted(
//     (a, b) => a.order - b.order
//   );

export const selectActivityContexts = createSelector(
  (state: RootState) => state.activitiesReducer.activityContexts,
  (activityContexts) => {
    return [...activityContexts].toSorted((a, b) => a.order - b.order);
  }
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
