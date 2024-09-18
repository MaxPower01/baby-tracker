import { Entry, ExistingEntry } from "@/pages/Entry/types/Entry";
import {
  QueryConstraint,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import React, { useCallback, useEffect, useMemo } from "react";

import { DailyEntries } from "@/types/DailyEntries";
import { DailyEntriesCollection } from "@/types/DailyEntriesCollection";
import { TimePeriodId } from "@/enums/TimePeriodId";
import { db } from "@/firebase";
import { getDateFromTimestamp } from "@/utils/getDateFromTimestamp";
import { getDateKeyFromTimestamp } from "@/utils/getDateKeyFromTimestamp";
import { getDaysCountForTimePeriod } from "@/pages/Charts/utils/getDaysCountForTimePeriod";
import { getEntryToSave } from "@/pages/Entry/utils/getEntryToSave";
import { getRangeStartTimestampForRecentEntries } from "@/utils/getRangeStartTimestampForRecentEntries";
import { getStartTimestampForTimePeriod } from "@/utils/getStartTimestampForTimePeriod";
import { getTimePeriodForRecentEntries } from "@/utils/getTimePeriodForRecentEntries";
import { getTimestamp } from "@/utils/getTimestamp";
import { getTimestampFromDateKey } from "@/utils/getTimestampFromDateKey";
import { isNullOrWhiteSpace } from "@/utils/utils";
import { isRecentTimePeriod } from "@/utils/isRecentTimePeriod";
import { isSameDay } from "@/utils/isSameDay";
import { useAuthentication } from "@/pages/Authentication/hooks/useAuthentication";

interface EntriesContextType {
  recentEntries: Entry[];
  status: "idle" | "busy";
  saveEntry: (entry: Entry) => Promise<Entry>;
  saveEntries: (entries: Entry[]) => Promise<Entry[]>;
  getEntry: (props: {
    id: string;
    dateKey: string;
    babyId: string;
  }) => Promise<Entry | null>;
  getDailyEntries: (props: {
    /**
     * The range of time to get entries for.
     * If a time period id is provided instead of a range object,
     * the end date will be the current date and the start date will be
     * the current date minus the time period.
     */
    range: TimePeriodId | { start: Date; end: Date };
    limit?: number;
    offset?: number;
    babyId: string;
  }) => Promise<DailyEntriesCollection>;
  deleteEntry: (props: {
    id: string;
    dateKey: string;
    babyId: string;
  }) => Promise<boolean>;
  deleteDailyEntries: (props: {
    dateKeys: string[];
    babyId: string;
  }) => Promise<void>;
}

const EntriesContext = React.createContext<EntriesContextType | undefined>(
  undefined
);

export function useEntries() {
  const context = React.useContext(EntriesContext);
  if (context === undefined) {
    throw new Error("useEntries must be used within a EntriesProvider");
  }
  return context;
}

type Props = React.PropsWithChildren<{}>;

export function EntriesProvider(props: Props) {
  const { user } = useAuthentication();

  const [status, setStatus] = React.useState<"idle" | "busy">("idle");

  const [recentEntries, setRecentEntries] = React.useState<Entry[]>([]);

  // Fetch recent entries and subscribe to changes
  useEffect(() => {
    const babyId = user?.babyId ?? "";

    if (!isNullOrWhiteSpace(babyId)) {
      const rangeStartTimestamp = getRangeStartTimestampForRecentEntries();

      const q = query(
        collection(db, `babies/${babyId}/dailyEntries`),
        where("timestamp", ">=", rangeStartTimestamp),
        orderBy("timestamp", "desc")
      );

      setStatus("busy");

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const addedDailyEntries: DailyEntries[] = [];
        const modifiedDailyEntries: DailyEntries[] = [];
        const removedDailyEntries: DailyEntries[] = [];

        if (recentEntries.length === 0) {
          setStatus("idle");
        }

        snapshot.docChanges().forEach((change) => {
          if (change.doc.data() != null) {
            const dailyEntries = change.doc.data() as DailyEntries;
            if (change.type === "added") {
              addedDailyEntries.push(dailyEntries);
            } else if (change.type === "modified") {
              modifiedDailyEntries.push(dailyEntries);
            } else if (change.type === "removed") {
              removedDailyEntries.push(dailyEntries);
            }
          }
        });

        const maxDate = new Date();
        const daysCount = getDaysCountForTimePeriod(
          getTimePeriodForRecentEntries()
        );
        maxDate.setDate(maxDate.getDate() - daysCount);

        setRecentEntries((prevEntries) => {
          let entries = [...prevEntries];
          if (removedDailyEntries.length) {
            removedDailyEntries.forEach((dailyEntries) => {
              const removedEntries = dailyEntries.entries;
              if (!removedEntries || !Array.isArray(removedEntries)) {
                return;
              }
              entries = entries.filter(
                (entry) => !removedEntries.some((e) => e.id === entry.id)
              );
            });
          }
          if (modifiedDailyEntries.length) {
            modifiedDailyEntries.forEach((dailyEntries) => {
              const modifiedEntries = dailyEntries.entries;
              if (!modifiedEntries || !Array.isArray(modifiedEntries)) {
                return;
              }
              entries = entries.filter(
                (entry) =>
                  getDateKeyFromTimestamp(entry.startTimestamp) !==
                  getDateKeyFromTimestamp(dailyEntries.timestamp)
              );
              modifiedEntries.forEach((entry) => {
                const index = entries.findIndex((e) => e.id === entry.id);
                if (index !== -1) {
                  entries[index] = entry;
                } else {
                  entries.push(entry);
                }
              });
            });
          }
          if (addedDailyEntries.length) {
            addedDailyEntries.forEach((dailyEntries) => {
              const addedEntries = dailyEntries.entries;
              if (!addedEntries || !Array.isArray(addedEntries)) {
                return;
              }
              entries.push(...addedEntries);
            });
          }
          entries = entries
            .sort((a, b) => b.startTimestamp - a.startTimestamp)
            .filter((entry, index, self) => {
              return index === self.findIndex((e) => e.id === entry.id);
            })
            .filter((entry) => {
              const startDate = getDateFromTimestamp(entry.startTimestamp);
              if (startDate < maxDate) {
                return false;
              }
              if (
                isSameDay({ targetDate: startDate, comparisonDate: maxDate })
              ) {
                const startHour = startDate.getHours();
                if (startHour < maxDate.getHours()) {
                  return false;
                }
              }
              return true;
            });
          return entries;
        });
      });

      return () => {
        unsubscribe();
      };
    }
  }, [user]);

  const saveEntry = useCallback(
    (entry: Entry) => {
      return new Promise<Entry>(async (resolve, reject) => {
        try {
          if (status === "busy") {
            throw new Error("State is busy");
          }

          setStatus("busy");

          const babyId = entry.babyId;

          if (babyId !== user?.babyId) {
            setStatus("idle");
            return reject("Entry does not belong to the current user's baby");
          }

          if (isNullOrWhiteSpace(babyId)) {
            setStatus("idle");
            return reject("babyId is not set");
          }

          const entryToSave = getEntryToSave(entry, babyId);

          const dateKey = getDateKeyFromTimestamp(entryToSave.startTimestamp);
          if (isNullOrWhiteSpace(dateKey)) {
            setStatus("idle");
            return reject("dateKey is not set");
          }

          const collectionPath = `babies/${babyId}/dailyEntries`;
          const docPath = `${collectionPath}/${dateKey}`;

          let originalDateKey = dateKey;
          let existingEntry: ExistingEntry | null = null;

          if ((entry as ExistingEntry).originalStartTimestamp) {
            existingEntry = entry as ExistingEntry;
            originalDateKey = getDateKeyFromTimestamp(
              (entry as ExistingEntry).originalStartTimestamp
            );
          }

          const notSameDay = existingEntry && dateKey !== originalDateKey;

          const dailyEntriesDocRef = doc(db, docPath);
          const dailyEntriesDoc = await getDoc(dailyEntriesDocRef);

          const entries = dailyEntriesDoc.exists()
            ? dailyEntriesDoc.data().entries
            : ([] as Entry[]);

          if (!entries || !Array.isArray(entries)) {
            setStatus("idle");
            throw new Error("Entries is not an array");
          }

          const isNewEntry = !entries.some((e) => e.id === entryToSave.id);

          if (isNewEntry) {
            entries.push(entryToSave);
          } else {
            const index = entries.findIndex((e) => e.id === entryToSave.id);
            entries[index] = entryToSave;
          }

          const timestamp = getTimestampFromDateKey(dateKey);

          if (notSameDay) {
            const originalDateKeyDocRef = doc(
              db,
              `${collectionPath}/${originalDateKey}`
            );
            const originalDateKeyDoc = await getDoc(originalDateKeyDocRef);

            if (originalDateKeyDoc.exists()) {
              const originalEntries = originalDateKeyDoc.data().entries;
              if (originalEntries && Array.isArray(originalEntries)) {
                const index = originalEntries.findIndex(
                  (e) => e.id === entryToSave.id
                );

                if (index !== -1) {
                  originalEntries.splice(index, 1);
                  await setDoc(
                    originalDateKeyDocRef,
                    { entries: originalEntries, timestamp },
                    { merge: true }
                  );
                }
              }
            }
          } else {
            await setDoc(
              dailyEntriesDocRef,
              { entries, timestamp },
              { merge: true }
            );
          }

          if (
            entryToSave.startTimestamp >=
            getRangeStartTimestampForRecentEntries()
          ) {
            setRecentEntries((prevEntries) => {
              let entries = [...prevEntries];
              const index = entries.findIndex((e) => e.id === entryToSave.id);
              if (index !== -1) {
                entries[index] = entryToSave;
              } else {
                entries.push(entryToSave);
              }
              entries = entries
                .sort((a, b) => b.startTimestamp - a.startTimestamp)
                .filter((entry, index, self) => {
                  return index === self.findIndex((e) => e.id === entry.id);
                });
              return entries;
            });
          }

          setStatus("idle");
          return resolve({ ...entryToSave });
        } catch (error) {
          console.error(error);
          setStatus("idle");
          return reject(error);
        }
      });
    },
    [user]
  );

  const saveEntries = useCallback(
    (entries: Entry[]) => {
      return new Promise<Entry[]>(async (resolve, reject) => {
        try {
          if (status === "busy") {
            throw new Error("State is busy");
          }

          setStatus("busy");

          const babyId = user?.babyId ?? "";

          if (isNullOrWhiteSpace(babyId)) {
            setStatus("idle");
            return reject("babyId is not set");
          }

          const filteredEntries = entries.filter(
            (entry) => entry.babyId === user?.babyId
          );

          if (!filteredEntries.length) {
            setStatus("idle");
            return resolve([]);
          }

          const entriesByDateKey = {} as Record<
            string,
            {
              entries: Entry[];
              timestamp: number;
            }
          >;

          entries.forEach((entry) => {
            const dateKey = getDateKeyFromTimestamp(entry.startTimestamp);
            if (!entriesByDateKey[dateKey]) {
              entriesByDateKey[dateKey] = {
                entries: [],
                timestamp: getTimestampFromDateKey(dateKey),
              };
            }
            const entryToSave = getEntryToSave(entry, babyId);
            entriesByDateKey[dateKey].entries.push(entryToSave as Entry);
          });

          const batch = writeBatch(db);

          Object.keys(entriesByDateKey).forEach((dateKey) => {
            const docRef = doc(db, `babies/${babyId}/dailyEntries/${dateKey}`);
            batch.set(
              docRef,
              { ...entriesByDateKey[dateKey] },
              { merge: true }
            );
          });

          await batch.commit();

          const rangeStartTimestampForRecentEntries =
            getRangeStartTimestampForRecentEntries();

          const newRecentEntries = entries.filter(
            (entry) =>
              entry.startTimestamp >= rangeStartTimestampForRecentEntries
          );

          if (newRecentEntries.length) {
            setRecentEntries((prevEntries) => {
              let entries = [...prevEntries];
              newRecentEntries.forEach((entry) => {
                const index = entries.findIndex((e) => e.id === entry.id);
                if (index !== -1) {
                  entries[index] = entry;
                } else {
                  entries.push(entry);
                }
              });
              entries = entries
                .sort((a, b) => b.startTimestamp - a.startTimestamp)
                .filter((entry, index, self) => {
                  return index === self.findIndex((e) => e.id === entry.id);
                });
              return entries;
            });
          }
          setStatus("idle");
          return resolve(entries.map((entry) => ({ ...entry })));
        } catch (error) {
          console.error("Error saving entries: ", error);
          setStatus("idle");
          return reject(error);
        }
      });
    },
    [user]
  );

  const getEntry = useCallback(
    (props: { id: string; dateKey: string; babyId: string }) => {
      return new Promise<Entry | null>(async (resolve, reject) => {
        try {
          if (status === "busy") {
            throw new Error("Already fetching entries");
          }

          if (props.babyId !== user?.babyId) {
            throw new Error("Entry does not belong to the current user's baby");
          }
          if (isNullOrWhiteSpace(props.babyId)) {
            throw new Error("babyId is not set");
          }

          if (isNullOrWhiteSpace(props.dateKey)) {
            throw new Error("dateKey is not set");
          }

          setStatus("busy");

          const dailyEntriesDoc = await getDoc(
            doc(db, `babies/${props.babyId}/dailyEntries/${props.dateKey}`)
          );
          if (!dailyEntriesDoc.exists()) {
            setStatus("idle");
            return resolve(null);
          }

          const entries = dailyEntriesDoc.data().entries;
          if (!entries || !Array.isArray(entries)) {
            throw new Error("Entries is not an array");
          }

          const entry = entries.find((e) => e.id == props.id);
          if (!entry) {
            setStatus("idle");
            return resolve(null);
          }

          setStatus("idle");
          return resolve({ ...entry });
        } catch (error) {
          console.error("Error getting entry: ", error);
          setStatus("idle");
          return reject(error);
        }
      });
    },
    [user, status]
  );

  const getDailyEntries = useCallback(
    (props: {
      range: TimePeriodId | { start: Date; end: Date };
      limit?: number;
      offset?: number;
      babyId: string;
    }) => {
      return new Promise<DailyEntriesCollection>(async (resolve, reject) => {
        try {
          if (status === "busy") {
            throw new Error("State is busy");
          }

          if (props.babyId !== user?.babyId) {
            throw new Error("Entries do not belong to the current user's baby");
          }
          if (isNullOrWhiteSpace(props.babyId)) {
            throw new Error("babyId is not set");
          }

          setStatus("busy");

          let rangeStartTimestamp: number;
          let rangeEndTimestamp: number;

          if (
            typeof props.range === "string" ||
            typeof props.range === "number"
          ) {
            const _rangeStartTimestamp = getStartTimestampForTimePeriod(
              props.range
            );
            const rangeStartDate = getDateFromTimestamp(_rangeStartTimestamp);
            rangeStartDate.setDate(rangeStartDate.getDate() - 1);
            rangeStartTimestamp = getTimestamp(rangeStartDate);
            const rangeEndDate = new Date();
            rangeEndDate.setDate(rangeEndDate.getDate() + 1);
            rangeEndTimestamp = getTimestamp(rangeEndDate);
          } else {
            rangeStartTimestamp = getTimestamp(props.range.start);
            rangeEndTimestamp = getTimestamp(props.range.end);
          }

          if (isNaN(rangeStartTimestamp) || isNaN(rangeEndTimestamp)) {
            throw new Error("Invalid range");
          }

          const queryConstraints: QueryConstraint[] = [
            where("timestamp", ">=", rangeStartTimestamp),
            where("timestamp", "<=", rangeEndTimestamp),
            orderBy("timestamp", "desc"),
          ];

          if (props.offset) {
            queryConstraints.push(limit(props.offset));
          }

          if (props.limit) {
            queryConstraints.push(limit(props.limit));
          }

          const q = query(
            collection(db, `babies/${props.babyId}/dailyEntries`),
            ...queryConstraints
          );

          const snapshot = await getDocs(q);
          if (snapshot.empty) {
            setStatus("idle");
            return resolve({});
          }

          const dailyEntriesCollection: DailyEntriesCollection = {};

          const maxDate = new Date();
          let daysCount = 0;
          if (
            typeof props.range === "string" ||
            typeof props.range === "number"
          ) {
            daysCount = getDaysCountForTimePeriod(props.range);
            maxDate.setDate(maxDate.getDate() - daysCount);
          }

          snapshot.forEach((doc) => {
            const { entries, timestamp } = doc.data() as DailyEntries;
            let filteredEntries = entries;
            if (
              typeof props.range === "string" ||
              (typeof props.range === "number" && daysCount > 0)
            ) {
              maxDate.setDate(maxDate.getDate() - daysCount);
              if (isRecentTimePeriod(props.range)) {
                filteredEntries = entries.filter((entry) => {
                  const startDate = getDateFromTimestamp(entry.startTimestamp);
                  if (startDate < maxDate) {
                    return false;
                  }
                  const startHour = startDate.getHours();
                  if (startHour < maxDate.getHours()) {
                    return false;
                  }
                  return true;
                });
              } else {
                filteredEntries = entries.filter((entry) => {
                  const startDate = getDateFromTimestamp(entry.startTimestamp);
                  if (startDate < maxDate) {
                    return false;
                  }
                  return true;
                });
              }
            }
            dailyEntriesCollection[getDateKeyFromTimestamp(timestamp)] = {
              entries: filteredEntries,
              timestamp,
            };
          });

          setStatus("idle");
          return resolve(dailyEntriesCollection);
        } catch (error) {
          console.error("Error getting entries: ", error);
          setStatus("idle");
          return reject(error);
        }
      });
    },
    [user, status]
  );

  const deleteEntry = useCallback(
    (props: { id: string; dateKey: string; babyId: string }) => {
      return new Promise<boolean>(async (resolve, reject) => {
        try {
          if (status === "busy") {
            throw new Error("State is busy");
          }

          if (props.babyId !== user?.babyId) {
            throw new Error("Entry does not belong to the current user's baby");
          }

          if (isNullOrWhiteSpace(props.babyId)) {
            throw new Error("babyId is not set");
          }

          if (isNullOrWhiteSpace(props.dateKey)) {
            throw new Error("dateKey is not set");
          }

          setStatus("busy");

          const dailyEntriesDocRef = doc(
            db,
            `babies/${props.babyId}/dailyEntries/${props.dateKey}`
          );

          const dailyEntriesDoc = await getDoc(dailyEntriesDocRef);
          if (!dailyEntriesDoc.exists()) {
            setStatus("idle");
            return resolve(false);
          }

          const entries = dailyEntriesDoc.data().entries;
          if (!entries || !Array.isArray(entries)) {
            throw new Error("Entries is not an array");
          }

          const index = entries.findIndex((e) => e.id === props.id);
          if (index === -1) {
            setStatus("idle");
            return resolve(false);
          }

          entries.splice(index, 1);

          await setDoc(dailyEntriesDocRef, { entries }, { merge: true });

          setStatus("idle");
          return resolve(true);
        } catch (error) {
          console.error("Error deleting entry: ", error);
          setStatus("idle");
          return reject(error);
        }
      });
    },
    [user]
  );

  const deleteDailyEntries = useCallback(
    (props: { dateKeys: string[]; babyId: string }) => {
      return new Promise<void>(async (resolve, reject) => {
        try {
          if (status === "busy") {
            throw new Error("State is busy");
          }

          if (props.babyId !== user?.babyId) {
            throw new Error("Entries do not belong to the current user's baby");
          }

          if (isNullOrWhiteSpace(props.babyId)) {
            throw new Error("babyId is not set");
          }

          setStatus("busy");

          if (!props.dateKeys.length) {
            setStatus("idle");
            return resolve();
          }

          const batch = writeBatch(db);

          props.dateKeys.forEach((dateKey) => {
            const docRef = doc(
              db,
              `babies/${props.babyId}/dailyEntries/${dateKey}`
            );
            batch.delete(docRef);
          });

          await batch.commit();

          setStatus("idle");
          return resolve();
        } catch (error) {
          console.error("Error deleting entries: ", error);
        }
      });
    },
    [user]
  );

  const value: EntriesContextType = useMemo(() => {
    return {
      status,
      recentEntries,
      saveEntry,
      saveEntries,
      getEntry,
      getDailyEntries,
      deleteEntry,
      deleteDailyEntries,
    };
  }, [
    status,
    recentEntries,
    saveEntry,
    saveEntries,
    getEntry,
    getDailyEntries,
    deleteEntry,
    deleteDailyEntries,
  ]);

  return (
    <EntriesContext.Provider value={value}>
      {props.children}
    </EntriesContext.Provider>
  );
}
