// import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
// import { getInitialState, setLocalState } from "@/utils/utils";

// import { ActivityContext } from "@/pages/Activity/types/ActivityContext";
// import { ActivityContextType } from "@/pages/Activity/enums/ActivityContextType";
// import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
// import { FiltersState } from "@/state/types/FiltersState";
// import { LocalStorageKey } from "@/enums/LocalStorageKey";
// import { RootState } from "@/state/store";
// import { SortOrderId } from "@/enums/SortOrderId";
// import StoreReducerName from "@/enums/StoreReducerName";
// import { TimePeriodId } from "@/enums/TimePeriodId";
// import { getActivityContextType } from "@/pages/Activity/utils/getActivityContextType";
// import { getEntryTypeFromActivityContextType } from "@/pages/Activity/utils/getEntryTypeFromActivityContextType";

// const key = LocalStorageKey.FiltersState;

// const defaultState: FiltersState = {
//   activityContexts: [],
//   entryTypes: [],
//   sortOrder: SortOrderId.DateDesc,
//   timePeriod: TimePeriodId.Today,
// };

// const parser = (state: FiltersState) => {
//   if (
//     !state.activityContexts ||
//     !state.entryTypes ||
//     !state.sortOrder ||
//     !state.timePeriod
//   ) {
//     state = defaultState;
//   }
//   return state;
// };

// function _setEntryTypesInFiltersState(
//   state: FiltersState,
//   payload: {
//     entryTypes: EntryTypeId[];
//   },
//   preventLocalStorageUpdate = false
// ) {
//   state.entryTypes = payload.entryTypes;
//   if (!preventLocalStorageUpdate) {
//     setLocalState(key, state);
//   }
// }

// function _addEntryTypeInFiltersState(
//   state: FiltersState,
//   payload: {
//     entryTypeId: EntryTypeId;
//   },
//   preventLocalStorageUpdate = false
// ) {
//   if (state.entryTypes.indexOf(payload.entryTypeId) === -1) {
//     state.entryTypes.push(payload.entryTypeId);
//   }
//   if (!preventLocalStorageUpdate) {
//     setLocalState(key, state);
//   }
// }

// function _removeEntryTypeInFiltersState(
//   state: FiltersState,
//   payload: {
//     entryTypeId: EntryTypeId;
//   },
//   preventLocalStorageUpdate = false
// ) {
//   const index = state.entryTypes.indexOf(payload.entryTypeId);
//   if (index !== -1) {
//     state.entryTypes.splice(index, 1);
//   }
//   if (!preventLocalStorageUpdate) {
//     setLocalState(key, state);
//   }
// }

// function _removeActivityContextsOfTypeInFiltersState(
//   state: FiltersState,
//   payload: {
//     type: ActivityContextType;
//   },
//   preventLocalStorageUpdate = false
// ) {
//   state.activityContexts = state.activityContexts.filter(
//     (context) => context.type != payload.type
//   );
//   if (!preventLocalStorageUpdate) {
//     setLocalState(key, state);
//   }
// }

// function _toggleEntryTypeInFiltersState(
//   state: FiltersState,
//   payload: {
//     entryTypeId: EntryTypeId;
//   },
//   preventLocalStorageUpdate = false
// ) {
//   const index = state.entryTypes.indexOf(payload.entryTypeId);
//   if (index === -1) {
//     _addEntryTypeInFiltersState(state, payload, true);
//   } else {
//     _removeEntryTypeInFiltersState(state, payload, true);
//     const activityContextType = getActivityContextType(payload.entryTypeId);
//     if (activityContextType != null) {
//       _removeActivityContextsOfTypeInFiltersState(
//         state,
//         { type: activityContextType },
//         true
//       );
//     }
//   }
//   if (!preventLocalStorageUpdate) {
//     setLocalState(key, state);
//   }
// }

// function _setActivityContextsInFiltersState(
//   state: FiltersState,
//   payload: {
//     activityContexts: ActivityContext[];
//   },
//   preventLocalStorageUpdate = false
// ) {
//   state.activityContexts = payload.activityContexts;
//   if (!preventLocalStorageUpdate) {
//     setLocalState(key, state);
//   }
// }

// function _addActivityContextInFiltersState(
//   state: FiltersState,
//   payload: {
//     activityContext: ActivityContext;
//   },
//   preventLocalStorageUpdate = false
// ) {
//   state.activityContexts.push(payload.activityContext);
//   if (!preventLocalStorageUpdate) {
//     setLocalState(key, state);
//   }
// }

// function _removeActivityContextInFiltersState(
//   state: FiltersState,
//   payload: {
//     activityContext: ActivityContext;
//   },
//   preventLocalStorageUpdate = false
// ) {
//   const index = state.activityContexts.findIndex(
//     (context) => context.id === payload.activityContext.id
//   );
//   if (index !== -1) {
//     state.activityContexts.splice(index, 1);
//   }
//   if (!preventLocalStorageUpdate) {
//     setLocalState(key, state);
//   }
// }

// function _toggleActivityContextInFiltersState(
//   state: FiltersState,
//   payload: {
//     activityContext: ActivityContext;
//   },
//   preventLocalStorageUpdate = false
// ) {
//   const index = state.activityContexts.findIndex(
//     (context) => context.id === payload.activityContext.id
//   );
//   if (index === -1) {
//     _addActivityContextInFiltersState(state, payload, true);
//     const entryTypeId = getEntryTypeFromActivityContextType(
//       payload.activityContext.type
//     );
//     if (entryTypeId != null) {
//       _addEntryTypeInFiltersState(state, { entryTypeId }, true);
//     }
//   } else {
//     _removeActivityContextInFiltersState(state, payload, true);
//   }
//   if (!preventLocalStorageUpdate) {
//     setLocalState(key, state);
//   }
// }

// function _setSortOrderInFiltersState(
//   state: FiltersState,
//   payload: {
//     sortOrder: SortOrderId;
//   },
//   preventLocalStorageUpdate = false
// ) {
//   state.sortOrder = payload.sortOrder;
//   if (!preventLocalStorageUpdate) {
//     setLocalState(key, state);
//   }
// }

// function _setTimePeriodInFiltersState(
//   state: FiltersState,
//   payload: {
//     timePeriod: TimePeriodId;
//   },
//   preventLocalStorageUpdate = false
// ) {
//   state.timePeriod = payload.timePeriod;
//   if (!preventLocalStorageUpdate) {
//     setLocalState(key, state);
//   }
// }

// function _resetFiltersInState(
//   state: FiltersState,
//   payload?: {
//     keepTimePeriod?: boolean;
//   },
//   preventLocalStorageUpdate = false
// ) {
//   for (const key in defaultState) {
//     if (payload?.keepTimePeriod && key === "timePeriod") {
//       continue;
//     }
//     (state as { [key: string]: any })[key] = (
//       defaultState as { [key: string]: any }
//     )[key];
//   }
//   if (!preventLocalStorageUpdate) {
//     setLocalState(key, state);
//   }
// }

// const slice = createSlice({
//   name: StoreReducerName.Filters,
//   initialState: getInitialState(key, defaultState, parser),
//   reducers: {
//     setEntryTypesInFiltersState: (
//       state,
//       action: PayloadAction<{ entryTypes: EntryTypeId[] }>
//     ) => {
//       _setEntryTypesInFiltersState(state, action.payload);
//     },
//     toggleEntryTypeInFiltersState: (
//       state,
//       action: PayloadAction<{ entryTypeId: EntryTypeId }>
//     ) => {
//       _toggleEntryTypeInFiltersState(state, action.payload);
//     },
//     setActivityContextsInFiltersState: (
//       state,
//       action: PayloadAction<{ activityContexts: ActivityContext[] }>
//     ) => {
//       _setActivityContextsInFiltersState(state, action.payload);
//     },
//     toggleActivityContextInFiltersState: (
//       state,
//       action: PayloadAction<{ activityContext: ActivityContext }>
//     ) => {
//       _toggleActivityContextInFiltersState(state, action.payload);
//     },
//     setSortOrderInFiltersState: (
//       state,
//       action: PayloadAction<{ sortOrder: SortOrderId }>
//     ) => {
//       _setSortOrderInFiltersState(state, action.payload);
//     },
//     setTimePeriodInFiltersState: (
//       state,
//       action: PayloadAction<{ timePeriod: TimePeriodId }>
//     ) => {
//       _setTimePeriodInFiltersState(state, action.payload);
//     },
//     resetFiltersInState: (
//       state,
//       action: PayloadAction<
//         | {
//             keepTimePeriod?: boolean;
//           }
//         | undefined
//       >
//     ) => {
//       _resetFiltersInState(state, action.payload);
//     },
//   },
// });

// export const {
//   setEntryTypesInFiltersState,
//   toggleEntryTypeInFiltersState,
//   setActivityContextsInFiltersState,
//   toggleActivityContextInFiltersState,
//   setSortOrderInFiltersState,
//   setTimePeriodInFiltersState,
//   resetFiltersInState,
// } = slice.actions;

// export const selectEntryTypesInFiltersState = createSelector(
//   (state: RootState) => state.filtersReducer,
//   (filters) => filters.entryTypes
// );

// export const selectActivityContextsInFiltersState = createSelector(
//   (state: RootState) => state.filtersReducer,
//   (filters) => filters.activityContexts
// );

// export const selectSortOrderInFiltersState = createSelector(
//   (state: RootState) => state.filtersReducer,
//   (filters) => filters.sortOrder
// );

// export const selectTimePeriodInFiltersState = createSelector(
//   (state: RootState) => state.filtersReducer,
//   (filters) => filters.timePeriod
// );

// export const selectFiltersCount = createSelector(
//   (state: RootState) => state.filtersReducer,
//   (filters) => {
//     return filters.entryTypes.length + filters.activityContexts.length;
//   }
// );

// export default slice.reducer;
