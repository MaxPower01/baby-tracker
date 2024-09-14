// import { Entry, ExistingEntry } from "@/pages/Entry/types/Entry";
// import {
//   PayloadAction,
//   createAsyncThunk,
//   createSelector,
//   createSlice,
// } from "@reduxjs/toolkit";
// import {
//   addDoc,
//   collection,
//   deleteDoc,
//   doc,
//   getDoc,
//   getDocs,
//   orderBy,
//   query,
//   setDoc,
//   where,
//   writeBatch,
// } from "firebase/firestore";
// import {
//   getInitialState,
//   isNullOrWhiteSpace,
//   setLocalState,
// } from "@/utils/utils";
// import {
//   recentAgeDataLimitInSeconds,
//   recentDataFetchCooldownInSeconds,
// } from "@/utils/constants";

// import CustomUser from "@/pages/Authentication/types/CustomUser";
// import { DailyEntries } from "@/types/DailyEntries";
// import { DailyEntriesCollection } from "@/types/DailyEntriesCollection";
// import EntriesState from "@/state/types/EntriesState";
// import { LocalStorageKey } from "@/enums/LocalStorageKey";
// import { RootState } from "@/state/store";
// import StoreReducerName from "@/enums/StoreReducerName";
// import { TimePeriodId } from "@/enums/TimePeriodId";
// import { db } from "@/firebase";
// import { getDateFromTimestamp } from "@/utils/getDateFromTimestamp";
// import { getDateKeyFromTimestamp } from "@/utils/getDateKeyFromTimestamp";
// import { getEntriesFromDailyEntriesCollection } from "@/pages/Entry/utils/getEntriesFromDailyEntriesCollection";
// import { getEntryToSave } from "@/pages/Entry/utils/getEntryToSave";
// import { getStartTimestampForTimePeriod } from "@/utils/getStartTimestampForTimePeriod";
// import { getTimestamp } from "@/utils/getTimestamp";
// import { getTimestampFromDateKey } from "@/utils/getTimestampFromDateKey";
// import { v4 as uuid } from "uuid";

// const key = LocalStorageKey.EntriesState;

// const defaultState: EntriesState = {
//   recentDailyEntries: {},
//   historyDailyEntries: {},
//   latestRecentEntriesFetchedTimestamp: null,
//   status: "idle",
// };

// const parser = (state: EntriesState) => {
//   if (
//     !state.recentDailyEntries ||
//     !state.latestRecentEntriesFetchedTimestamp ||
//     !state.status
//   ) {
//     state = defaultState;
//   }
//   return state;
// };

// export const fetchRecentEntriesFromDB = createAsyncThunk(
//   "entries/fetchRecentEntries",
//   async (
//     props: {
//       babyId: string;
//     },
//     thunkAPI
//   ) => {
//     try {
//       if (isNullOrWhiteSpace(props.babyId)) {
//         return thunkAPI.rejectWithValue("User or selected child is null");
//       }

//       const {
//         recentDailyEntries: currentDailyEntries,
//         latestRecentEntriesFetchedTimestamp: lastFetchTimestamp,
//       } = (thunkAPI.getState() as RootState).entriesReducer;

//       const now = new Date();
//       const nowTimestamp = getTimestamp(now);

//       const recentAgeDateLimitInDays = 2;
//       const startDate = new Date();
//       startDate.setDate(startDate.getDate() - recentAgeDateLimitInDays);
//       const startDateKey = getDateKeyFromTimestamp(
//         nowTimestamp - recentAgeDataLimitInSeconds
//       );
//       const startTimestamp = getTimestampFromDateKey(startDateKey);
//       const anyRecentEntries =
//         currentDailyEntries &&
//         Object.keys(currentDailyEntries).some((k) => {
//           return currentDailyEntries[k].timestamp >= startTimestamp;
//         });
//       if (
//         lastFetchTimestamp &&
//         nowTimestamp - lastFetchTimestamp < recentDataFetchCooldownInSeconds &&
//         anyRecentEntries
//       ) {
//         return thunkAPI.rejectWithValue("Cooldown not elapsed");
//       }
//       thunkAPI.dispatch(
//         setLastFetchTimestampInState({
//           timestamp: nowTimestamp,
//         })
//       );
//       const q = query(
//         collection(db, `babies/${props.babyId}/dailyEntries`),
//         where("timestamp", ">=", startTimestamp),
//         orderBy("timestamp", "desc")
//       );
//       const querySnapshot = await getDocs(q);
//       if (querySnapshot.empty) {
//         return thunkAPI.fulfillWithValue([]);
//       }
//       const dailyEntriesCollection: DailyEntriesCollection = {};
//       querySnapshot.forEach((doc) => {
//         const dailyEntries = doc.data() as DailyEntries;
//         dailyEntriesCollection[doc.id] = dailyEntries;
//       });
//       return thunkAPI.fulfillWithValue(dailyEntriesCollection);
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error);
//     }
//   }
// );

// export const fetchHistoryEntriesFromDB = createAsyncThunk(
//   "entries/fetchHistoryEntries",
//   async (
//     props: {
//       babyId: string;
//       timePeriodId: TimePeriodId;
//       startTimestamp?: number;
//       endTimestamp?: number;
//     },
//     thunkAPI
//   ) => {
//     try {
//       if (isNullOrWhiteSpace(props.babyId)) {
//         return thunkAPI.rejectWithValue("User or selected child is null");
//       }
//       const dateKey = getDateKeyFromTimestamp(
//         getStartTimestampForTimePeriod(props.timePeriodId)
//       );
//       const startTimestamp = getTimestampFromDateKey(dateKey);
//       const q = query(
//         collection(db, `babies/${props.babyId}/dailyEntries`),
//         where("timestamp", ">=", startTimestamp),
//         orderBy("timestamp", "desc")
//       );
//       const querySnapshot = await getDocs(q);
//       if (querySnapshot.empty) {
//         return thunkAPI.fulfillWithValue([]);
//       }
//       const dailyEntriesCollection: DailyEntriesCollection = {};
//       querySnapshot.forEach((doc) => {
//         const dailyEntries = doc.data() as DailyEntries;
//         dailyEntriesCollection[doc.id] = dailyEntries;
//       });
//       return thunkAPI.fulfillWithValue(dailyEntriesCollection);
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error);
//     }
//   }
// );

// export const saveEntryInDB = createAsyncThunk(
//   "entries/saveEntry",
//   async (
//     props: {
//       entry: Entry | ExistingEntry;
//       user: CustomUser;
//     },
//     thunkAPI
//   ) => {
//     const { entry, user } = props;
//     const babyId = user?.babyId ?? "";
//     if (user == null || isNullOrWhiteSpace(babyId)) {
//       return thunkAPI.rejectWithValue("User or selected baby is null");
//     }

//     const entryToSave = getEntryToSave(entry, babyId);

//     const dateKey = getDateKeyFromTimestamp(entryToSave.startTimestamp);

//     if (!dateKey || isNullOrWhiteSpace(dateKey)) {
//       return thunkAPI.rejectWithValue("Daily entries key is null or empty");
//     }

//     const collectionPath = `babies/${babyId}/dailyEntries`;
//     const docPath = `${collectionPath}/${dateKey}`;

//     let originalDateKey = dateKey;
//     let existingEntry: ExistingEntry | null = null;

//     if ((entry as ExistingEntry).originalStartTimestamp) {
//       existingEntry = entry as ExistingEntry;
//       originalDateKey = getDateKeyFromTimestamp(
//         (entry as ExistingEntry).originalStartTimestamp
//       );
//     }

//     const notSameDay = existingEntry && dateKey !== originalDateKey;

//     try {
//       const dailyEntriesDocRef = doc(db, docPath);
//       const dailyEntriesDoc = await getDoc(dailyEntriesDocRef);
//       const entries = dailyEntriesDoc.exists()
//         ? dailyEntriesDoc.data().entries
//         : ([] as Entry[]);
//       if (!entries || !Array.isArray(entries)) {
//         throw new Error("Entries is not an array");
//       }
//       const isNewEntry = !entries.some((e) => e.id === entryToSave.id);
//       if (isNewEntry) {
//         entries.push(entryToSave);
//       } else {
//         const index = entries.findIndex((e) => e.id === entryToSave.id);
//         entries[index] = entryToSave;
//       }
//       const timestamp = getTimestampFromDateKey(dateKey);
//       await setDoc(dailyEntriesDocRef, { entries, timestamp }, { merge: true });
//       if (notSameDay) {
//         const originalDateKeyDocRef = doc(
//           db,
//           `${collectionPath}/${originalDateKey}`
//         );
//         const originalDateKeyDoc = await getDoc(originalDateKeyDocRef);
//         if (originalDateKeyDoc.exists()) {
//           const originalEntries = originalDateKeyDoc.data().entries;
//           if (originalEntries && Array.isArray(originalEntries)) {
//             const index = originalEntries.findIndex(
//               (e) => e.id === entryToSave.id
//             );
//             if (index !== -1) {
//               originalEntries.splice(index, 1);
//               await setDoc(
//                 originalDateKeyDocRef,
//                 { entries: originalEntries, timestamp },
//                 { merge: true }
//               );
//             }
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Error saving entry: ", error);
//       return thunkAPI.rejectWithValue(error);
//     }

//     const savedEntry = { ...entryToSave } as Entry;
//     return thunkAPI.fulfillWithValue(savedEntry);
//   }
// );

// export const saveEntriesInDB = createAsyncThunk(
//   "entries/saveEntries",
//   async (
//     props: {
//       entries: Entry[] | ExistingEntry[];
//       user: CustomUser;
//     },
//     thunkAPI
//   ) => {
//     try {
//       const { entries, user } = props;
//       const babyId = user?.babyId ?? "";
//       if (user == null || isNullOrWhiteSpace(babyId)) {
//         return thunkAPI.rejectWithValue("User or selected baby is null");
//       }
//       const entriesByDateKey = {} as Record<
//         string,
//         {
//           entries: Entry[];
//           timestamp: number;
//         }
//       >;
//       entries.forEach((entry) => {
//         const dateKey = getDateKeyFromTimestamp(entry.startTimestamp);
//         if (!entriesByDateKey[dateKey]) {
//           entriesByDateKey[dateKey] = {
//             entries: [],
//             timestamp: getTimestampFromDateKey(dateKey),
//           };
//         }
//         const entryToSave = getEntryToSave(entry, babyId);
//         entriesByDateKey[dateKey].entries.push(entryToSave as Entry);
//       });
//       const batch = writeBatch(db);
//       Object.keys(entriesByDateKey).forEach((dateKey) => {
//         const docRef = doc(db, `babies/${babyId}/dailyEntries/${dateKey}`);
//         batch.set(docRef, { ...entriesByDateKey[dateKey] }, { merge: true });
//       });
//       await batch.commit();
//       return thunkAPI.fulfillWithValue(entries);
//     } catch (error) {
//       console.error("Error saving entries: ", error);
//       return thunkAPI.rejectWithValue(error);
//     }
//   }
// );

// export const deleteEntryInDB = createAsyncThunk(
//   "entries/deleteEntry",
//   async (
//     props: {
//       entryId: string;
//       timestamp: number;
//       babyId: string;
//     },
//     thunkAPI
//   ) => {
//     try {
//       const dailyEntriesKey = getDateKeyFromTimestamp(props.timestamp);
//       if (isNullOrWhiteSpace(dailyEntriesKey)) {
//         return thunkAPI.rejectWithValue("Daily entries key is null or empty");
//       }
//       const dailyEntriesDocRef = doc(
//         db,
//         `babies/${props.babyId}/dailyEntries/${dailyEntriesKey}`
//       );
//       const dailyEntriesDoc = await getDoc(dailyEntriesDocRef);
//       if (!dailyEntriesDoc.exists()) {
//         return thunkAPI.rejectWithValue(
//           "Daily entries document does not exist"
//         );
//       }
//       const entries = dailyEntriesDoc.data().entries as Entry[];
//       if (!entries || !Array.isArray(entries)) {
//         return thunkAPI.rejectWithValue("Entries is not an array");
//       }
//       const index = entries.findIndex((e) => e.id === props.entryId);
//       if (index === -1) {
//         return thunkAPI.rejectWithValue("Entry not found in daily entries");
//       }
//       entries.splice(index, 1);
//       await setDoc(dailyEntriesDocRef, { entries }, { merge: true });
//       return thunkAPI.fulfillWithValue(props.entryId);
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error);
//     }
//   }
// );

// function _addRecentEntryToState(
//   state: EntriesState,
//   payload: {
//     entry: string;
//   },
//   preventLocalStorageUpdate = false
// ) {
//   const entry = JSON.parse(payload.entry) as ExistingEntry;
//   const dateKey = getDateKeyFromTimestamp(entry.startTimestamp);
//   if (isNullOrWhiteSpace(dateKey)) {
//     return;
//   }
//   if (!entry.originalStartTimestamp) {
//     entry.originalStartTimestamp = entry.startTimestamp;
//   }
//   if (!state.recentDailyEntries[dateKey]) {
//     state.recentDailyEntries[dateKey] = {
//       timestamp: entry.startTimestamp,
//       entries: [entry],
//     };
//   } else {
//     const index = state.recentDailyEntries[dateKey].entries.findIndex(
//       (e) => e.id === entry.id
//     );
//     if (index === -1) {
//       state.recentDailyEntries[dateKey].entries.push(entry);
//     }
//   }
//   if (!preventLocalStorageUpdate) {
//     setLocalState(key, state);
//   }
// }

// function _addHistoryEntryToState(
//   state: EntriesState,
//   payload: {
//     entry: string;
//   },
//   preventLocalStorageUpdate = false
// ) {
//   const entry = JSON.parse(payload.entry) as ExistingEntry;
//   const dateKey = getDateKeyFromTimestamp(entry.startTimestamp);
//   if (isNullOrWhiteSpace(dateKey)) {
//     return;
//   }
//   if (!entry.originalStartTimestamp) {
//     entry.originalStartTimestamp = entry.startTimestamp;
//   }
//   if (!state.historyDailyEntries[dateKey]) {
//     state.historyDailyEntries[dateKey] = {
//       timestamp: entry.startTimestamp,
//       entries: [entry],
//     };
//   } else {
//     const index = state.historyDailyEntries[dateKey].entries.findIndex(
//       (e) => e.id === entry.id
//     );
//     if (index === -1) {
//       state.historyDailyEntries[dateKey].entries.push(entry);
//     }
//   }
//   if (!preventLocalStorageUpdate) {
//     setLocalState(key, state);
//   }
// }

// function _addRecentEntriesToState(
//   state: EntriesState,
//   payload: {
//     entries: string[];
//   },
//   preventLocalStorageUpdate = false
// ) {
//   const entries = payload.entries.map((entry) => JSON.parse(entry) as Entry);
//   entries.forEach((entry) => {
//     _addRecentEntryToState(state, { entry: JSON.stringify(entry) }, true);
//   });
//   if (!preventLocalStorageUpdate) {
//     setLocalState(key, state);
//   }
// }

// function _addHistoryEntriesToState(
//   state: EntriesState,
//   payload: {
//     entries: string[];
//   },
//   preventLocalStorageUpdate = false
// ) {
//   const entries = payload.entries.map((entry) => JSON.parse(entry) as Entry);
//   entries.forEach((entry) => {
//     _addHistoryEntryToState(state, { entry: JSON.stringify(entry) }, true);
//   });
//   if (!preventLocalStorageUpdate) {
//     setLocalState(key, state);
//   }
// }

// function _updateRecentEntryInState(
//   state: EntriesState,
//   payload: {
//     entry: string;
//   },
//   preventLocalStorageUpdate = false
// ) {
//   const entry = JSON.parse(payload.entry) as ExistingEntry;
//   const dateKey = getDateKeyFromTimestamp(entry.startTimestamp);
//   if (isNullOrWhiteSpace(dateKey)) {
//     return;
//   }
//   if (!entry.originalStartTimestamp) {
//     entry.originalStartTimestamp = entry.startTimestamp;
//   }
//   if (!state.recentDailyEntries[dateKey]) {
//     state.recentDailyEntries[dateKey] = {
//       timestamp: entry.startTimestamp,
//       entries: [entry],
//     };
//   } else {
//     const index = state.recentDailyEntries[dateKey].entries.findIndex(
//       (e) => e.id === entry.id
//     );
//     if (index !== -1) {
//       state.recentDailyEntries[dateKey].entries[index] = entry;
//     } else {
//       _addRecentEntryToState(state, payload, true);
//     }
//   }
//   if (!preventLocalStorageUpdate) {
//     setLocalState(key, state);
//   }
// }

// function _updateHistoryEntryInState(
//   state: EntriesState,
//   payload: {
//     entry: string;
//   },
//   preventLocalStorageUpdate = false
// ) {
//   const entry = JSON.parse(payload.entry) as ExistingEntry;
//   const dateKey = getDateKeyFromTimestamp(entry.startTimestamp);
//   if (isNullOrWhiteSpace(dateKey)) {
//     return;
//   }
//   if (!entry.originalStartTimestamp) {
//     entry.originalStartTimestamp = entry.startTimestamp;
//   }
//   if (!state.historyDailyEntries[dateKey]) {
//     state.historyDailyEntries[dateKey] = {
//       timestamp: entry.startTimestamp,
//       entries: [entry],
//     };
//   } else {
//     const index = state.historyDailyEntries[dateKey].entries.findIndex(
//       (e) => e.id === entry.id
//     );
//     if (index !== -1) {
//       state.historyDailyEntries[dateKey].entries[index] = entry;
//     } else {
//       _addHistoryEntryToState(state, payload, true);
//     }
//   }
//   if (!preventLocalStorageUpdate) {
//     setLocalState(key, state);
//   }
// }

// function _updateRecentEntriesInState(
//   state: EntriesState,
//   payload: {
//     entries: string[];
//   },
//   preventLocalStorageUpdate = false
// ) {
//   const entries = payload.entries.map((entry) => JSON.parse(entry) as Entry);
//   entries.forEach((entry) => {
//     _updateRecentEntryInState(state, { entry: JSON.stringify(entry) }, true);
//   });
//   if (!preventLocalStorageUpdate) {
//     setLocalState(key, state);
//   }
// }

// function _updateHistoryEntriesInState(
//   state: EntriesState,
//   payload: {
//     entries: string[];
//   },
//   preventLocalStorageUpdate = false
// ) {
//   const entries = payload.entries.map((entry) => JSON.parse(entry) as Entry);
//   entries.forEach((entry) => {
//     _updateHistoryEntryInState(state, { entry: JSON.stringify(entry) }, true);
//   });
//   if (!preventLocalStorageUpdate) {
//     setLocalState(key, state);
//   }
// }

// function _removeRecentEntryFromState(
//   state: EntriesState,
//   payload: {
//     id: string;
//   },
//   preventLocalStorageUpdate = false
// ) {
//   const dateKey = Object.keys(state.recentDailyEntries).find((k) => {
//     return state.recentDailyEntries[k].entries.some((e) => e.id === payload.id);
//   });
//   if (dateKey) {
//     const index = state.recentDailyEntries[dateKey].entries.findIndex(
//       (e) => e.id === payload.id
//     );
//     if (index !== -1) {
//       state.recentDailyEntries[dateKey].entries.splice(index, 1);
//     }
//   }
//   if (!preventLocalStorageUpdate) {
//     setLocalState(key, state);
//   }
// }

// function _removeHistoryEntryFromState(
//   state: EntriesState,
//   payload: {
//     id: string;
//   },
//   preventLocalStorageUpdate = false
// ) {
//   const dateKey = Object.keys(state.historyDailyEntries).find((k) => {
//     return state.historyDailyEntries[k].entries.some(
//       (e) => e.id === payload.id
//     );
//   });
//   if (dateKey) {
//     const index = state.historyDailyEntries[dateKey].entries.findIndex(
//       (e) => e.id === payload.id
//     );
//     if (index !== -1) {
//       state.historyDailyEntries[dateKey].entries.splice(index, 1);
//     }
//   }
//   if (!preventLocalStorageUpdate) {
//     setLocalState(key, state);
//   }
// }

// function _removeRecentEntriesFromState(
//   state: EntriesState,
//   payload: {
//     ids: string[];
//   },
//   preventLocalStorageUpdate = false
// ) {
//   payload.ids.forEach((id) => {
//     _removeRecentEntryFromState(state, { id });
//   });
//   if (!preventLocalStorageUpdate) {
//     setLocalState(key, state);
//   }
// }

// function _removeHistoryEntriesFromState(
//   state: EntriesState,
//   payload: {
//     ids: string[];
//   },
//   preventLocalStorageUpdate = false
// ) {
//   payload.ids.forEach((id) => {
//     _removeHistoryEntryFromState(state, { id });
//   });
//   if (!preventLocalStorageUpdate) {
//     setLocalState(key, state);
//   }
// }

// function _setRecentEntriesInState(
//   state: EntriesState,
//   payload: {
//     entries: string[];
//   },
//   preventLocalStorageUpdate = false
// ) {
//   const entries = payload.entries.map((entry) => {
//     const parsed = JSON.parse(entry) as ExistingEntry;
//     if (!parsed.originalStartTimestamp) {
//       parsed.originalStartTimestamp = parsed.startTimestamp;
//     }
//     return parsed;
//   });
//   const entriesByDateKey = {} as Record<string, ExistingEntry[]>;
//   entries.forEach((entry) => {
//     const dateKey = getDateKeyFromTimestamp(entry.startTimestamp);
//     if (!entriesByDateKey[dateKey]) {
//       entriesByDateKey[dateKey] = [];
//     }
//     entriesByDateKey[dateKey].push(entry);
//   });
//   state.recentDailyEntries = {};
//   Object.keys(entriesByDateKey).forEach((dateKey) => {
//     state.recentDailyEntries[dateKey] = {
//       timestamp: getTimestampFromDateKey(dateKey),
//       entries: entriesByDateKey[dateKey],
//     };
//   });
//   if (!preventLocalStorageUpdate) {
//     setLocalState(key, state);
//   }
// }

// function _setHistoryEntriesInState(
//   state: EntriesState,
//   payload: {
//     entries: string[];
//   },
//   preventLocalStorageUpdate = false
// ) {
//   const entries = payload.entries.map((entry) => {
//     const parsed = JSON.parse(entry) as ExistingEntry;
//     if (!parsed.originalStartTimestamp) {
//       parsed.originalStartTimestamp = parsed.startTimestamp;
//     }
//     return parsed;
//   });
//   const entriesByDateKey = {} as Record<string, ExistingEntry[]>;
//   entries.forEach((entry) => {
//     const dateKey = getDateKeyFromTimestamp(entry.startTimestamp);
//     if (!entriesByDateKey[dateKey]) {
//       entriesByDateKey[dateKey] = [];
//     }
//     entriesByDateKey[dateKey].push(entry);
//   });
//   state.historyDailyEntries = {};
//   Object.keys(entriesByDateKey).forEach((dateKey) => {
//     state.historyDailyEntries[dateKey] = {
//       timestamp: getTimestampFromDateKey(dateKey),
//       entries: entriesByDateKey[dateKey],
//     };
//   });
//   if (!preventLocalStorageUpdate) {
//     setLocalState(key, state);
//   }
// }

// function _resetRecentEntriesInState(
//   state: EntriesState,
//   preventLocalStorageUpdate = false
// ) {
//   state.recentDailyEntries = {};
//   if (!preventLocalStorageUpdate) {
//     setLocalState(key, state);
//   }
// }

// function _resetHistoryEntriesInState(
//   state: EntriesState,
//   preventLocalStorageUpdate = false
// ) {
//   state.historyDailyEntries = {};
//   if (!preventLocalStorageUpdate) {
//     setLocalState(key, state);
//   }
// }

// function _resetState(state: EntriesState, preventLocalStorageUpdate = false) {
//   Object.assign(state, defaultState);
//   if (!preventLocalStorageUpdate) {
//     setLocalState(key, state);
//   }
// }

// function _setLastFetchTimestampInState(
//   state: EntriesState,
//   payload: {
//     timestamp: number;
//   },
//   preventLocalStorageUpdate = false
// ) {
//   state.latestRecentEntriesFetchedTimestamp = payload.timestamp;
//   if (!preventLocalStorageUpdate) {
//     setLocalState(key, state);
//   }
// }

// function _setStatusInState(
//   state: EntriesState,
//   status: "idle" | "busy" | "busy",
//   preventLocalStorageUpdate = false
// ) {
//   state.status = status;
//   if (!preventLocalStorageUpdate) {
//     setLocalState(key, state);
//   }
// }

// const slice = createSlice({
//   name: StoreReducerName.Entries,
//   initialState: getInitialState(key, defaultState, parser),
//   reducers: {
//     addRecentEntryInState: (
//       state,
//       action: PayloadAction<{
//         entry: string;
//       }>
//     ) => {
//       _addRecentEntryToState(state, action.payload);
//     },
//     addRecentEntriesInState: (
//       state,
//       action: PayloadAction<{
//         entries: string[];
//       }>
//     ) => {
//       _addRecentEntriesToState(state, action.payload);
//     },
//     addHistoryEntryInState: (
//       state,
//       action: PayloadAction<{
//         entry: string;
//       }>
//     ) => {
//       _addHistoryEntryToState(state, action.payload);
//     },
//     addHistoryEntriesInState: (
//       state,
//       action: PayloadAction<{
//         entries: string[];
//       }>
//     ) => {
//       _addHistoryEntriesToState(state, action.payload);
//     },
//     updateRecentEntryInState: (
//       state,
//       action: PayloadAction<{
//         entry: string;
//       }>
//     ) => {
//       _updateRecentEntryInState(state, action.payload);
//     },
//     updateRecentEntriesInState: (
//       state,
//       action: PayloadAction<{
//         entries: string[];
//       }>
//     ) => {
//       _updateRecentEntriesInState(state, action.payload);
//     },
//     updateHistoryEntryInState: (
//       state,
//       action: PayloadAction<{
//         entry: string;
//       }>
//     ) => {
//       _updateHistoryEntryInState(state, action.payload);
//     },
//     updateHistoryEntriesInState: (
//       state,
//       action: PayloadAction<{
//         entries: string[];
//       }>
//     ) => {
//       _updateHistoryEntriesInState(state, action.payload);
//     },
//     removeRecentEntryFromState: (
//       state,
//       action: PayloadAction<{
//         id: string;
//       }>
//     ) => {
//       _removeRecentEntryFromState(state, action.payload);
//     },
//     removeRecentEntriesFromState: (
//       state,
//       action: PayloadAction<{
//         ids: string[];
//       }>
//     ) => {
//       _removeRecentEntriesFromState(state, action.payload);
//     },
//     removeHistoryEntryFromState: (
//       state,
//       action: PayloadAction<{
//         id: string;
//       }>
//     ) => {
//       _removeHistoryEntryFromState(state, action.payload);
//     },
//     removeHistoryEntriesFromState: (
//       state,
//       action: PayloadAction<{
//         ids: string[];
//       }>
//     ) => {
//       _removeHistoryEntriesFromState(state, action.payload);
//     },
//     setRecentEntriesInState: (
//       state,
//       action: PayloadAction<{
//         entries: string[];
//       }>
//     ) => {
//       _setRecentEntriesInState(state, action.payload);
//     },
//     setHistoryEntriesInState: (
//       state,
//       action: PayloadAction<{
//         entries: string[];
//       }>
//     ) => {
//       _setHistoryEntriesInState(state, action.payload);
//     },
//     resetState: (state) => {
//       _resetState(state);
//     },
//     setLastFetchTimestampInState: (
//       state,
//       action: PayloadAction<{
//         timestamp: number;
//       }>
//     ) => {
//       _setLastFetchTimestampInState(state, action.payload);
//     },
//     resetRecentEntriesInState: (state) => {
//       _resetRecentEntriesInState(state);
//     },
//     resetHistoryEntriesInState: (state) => {
//       _resetHistoryEntriesInState(state);
//     },
//   },
//   extraReducers: (builder) => {
//     builder.addCase(fetchRecentEntriesFromDB.pending, (state, action) => {
//       _setStatusInState(state, "busy");
//     });
//     builder.addCase(fetchRecentEntriesFromDB.fulfilled, (state, action) => {
//       try {
//         const dailyEntriesCollection = action.payload as DailyEntriesCollection;
//         if (dailyEntriesCollection) {
//           const entries = getEntriesFromDailyEntriesCollection(
//             dailyEntriesCollection
//           );
//           _setRecentEntriesInState(state, {
//             entries: entries.map((e) => JSON.stringify(e)),
//           });
//         }
//       } catch (error) {
//         console.error("Error fetching recent entries: ", error);
//       } finally {
//         _setStatusInState(state, "idle");
//       }
//     });
//     builder.addCase(fetchRecentEntriesFromDB.rejected, (state, action) => {
//       console.error("Error fetching recent entries: ", action.payload);
//       _setStatusInState(state, "idle");
//     });

//     builder.addCase(saveEntryInDB.pending, (state, action) => {
//       _setStatusInState(state, "busy");
//     });
//     builder.addCase(saveEntryInDB.fulfilled, (state, action) => {
//       try {
//         const entry = action.payload as Entry;
//         _updateRecentEntryInState(state, { entry: JSON.stringify(entry) });
//         _updateHistoryEntryInState(state, { entry: JSON.stringify(entry) });
//       } catch (error) {
//         console.error("Error saving entry: ", error);
//       } finally {
//         _setStatusInState(state, "idle");
//       }
//     });
//     builder.addCase(saveEntryInDB.rejected, (state, action) => {
//       console.error("Error saving entry: ", action.payload);
//       _setStatusInState(state, "idle");
//     });

//     builder.addCase(deleteEntryInDB.pending, (state, action) => {
//       _setStatusInState(state, "busy");
//     });
//     builder.addCase(deleteEntryInDB.fulfilled, (state, action) => {
//       try {
//         const entryId = action.payload as string;
//         _removeRecentEntryFromState(state, { id: entryId });
//         _removeHistoryEntryFromState(state, { id: entryId });
//       } catch (error) {
//         console.error("Error deleting entry: ", error);
//       } finally {
//         _setStatusInState(state, "idle");
//       }
//     });
//     builder.addCase(deleteEntryInDB.rejected, (state, action) => {
//       console.error("Error deleting entry: ", action.payload);
//       _setStatusInState(state, "idle");
//     });

//     builder.addCase(fetchHistoryEntriesFromDB.pending, (state, action) => {
//       _setStatusInState(state, "busy");
//     });
//     builder.addCase(fetchHistoryEntriesFromDB.fulfilled, (state, action) => {
//       // Result of fetching history entries might be too large to store in state

//       // const dailyEntriesCollection = action.payload as DailyEntriesCollection;
//       // if (dailyEntriesCollection) {
//       //   const entries = getEntriesFromDailyEntriesCollection(
//       //     dailyEntriesCollection
//       //   );
//       //   _setHistoryEntriesInState(state, {
//       //     entries: entries.map((e) => JSON.stringify(e)),
//       //   });
//       // }
//       _setStatusInState(state, "idle");
//     });
//     builder.addCase(fetchHistoryEntriesFromDB.rejected, (state, action) => {
//       console.error("Error fetching history entries: ", action.payload);
//       _setStatusInState(state, "idle");
//     });
//     builder.addCase(saveEntriesInDB.pending, (state, action) => {
//       _setStatusInState(state, "busy");
//     });
//     builder.addCase(saveEntriesInDB.fulfilled, (state, action) => {
//       _setStatusInState(state, "idle");
//     });
//     builder.addCase(saveEntriesInDB.rejected, (state, action) => {
//       console.error("Error saving entries: ", action.payload);
//       _setStatusInState(state, "idle");
//     });
//   },
// });

// export const {
//   updateRecentEntryInState,
//   resetState,
//   removeRecentEntryFromState,
//   addRecentEntriesInState,
//   addRecentEntryInState,
//   removeRecentEntriesFromState,
//   setRecentEntriesInState,
//   setLastFetchTimestampInState,
//   updateRecentEntriesInState,
//   resetRecentEntriesInState,
//   updateHistoryEntryInState,
//   removeHistoryEntryFromState,
//   addHistoryEntriesInState,
//   addHistoryEntryInState,
//   removeHistoryEntriesFromState,
//   setHistoryEntriesInState,
//   updateHistoryEntriesInState,
//   resetHistoryEntriesInState,
// } = slice.actions;

// export const selectRecentEntries = createSelector(
//   (state: RootState) => state.entriesReducer.recentDailyEntries,
//   (dailyEntriesCollection) => {
//     const entries: Entry[] = [];
//     Object.keys(dailyEntriesCollection).forEach((k) => {
//       const dailyEntries = dailyEntriesCollection[k];
//       if (dailyEntries && dailyEntries.entries) {
//         entries.push(...dailyEntries.entries);
//       }
//     });
//     return entries;
//   }
// );

// export const selectRecentEntry = createSelector(
//   (state: RootState, entryId: string) => entryId,
//   (state: RootState) => state.entriesReducer.recentDailyEntries,
//   (entryId, dailyEntriesCollection) => {
//     const entries: Entry[] = [];
//     Object.keys(dailyEntriesCollection).forEach((k) => {
//       const dailyEntries = dailyEntriesCollection[k];
//       if (dailyEntries && dailyEntries.entries) {
//         entries.push(...dailyEntries.entries);
//       }
//     });
//     return entries.find((e) => e.id === entryId);
//   }
// );

// export const selectHistoryEntries = createSelector(
//   (state: RootState) => state.entriesReducer.historyDailyEntries,
//   (dailyEntriesCollection) => {
//     const entries: Entry[] = [];
//     Object.keys(dailyEntriesCollection).forEach((k) => {
//       const dailyEntries = dailyEntriesCollection[k];
//       if (dailyEntries && dailyEntries.entries) {
//         entries.push(...dailyEntries.entries);
//       }
//     });
//     return entries;
//   }
// );

// export const selectEntriesStatus = (state: RootState) =>
//   state.entriesReducer.status;

// export default slice.reducer;
