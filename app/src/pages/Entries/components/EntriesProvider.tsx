import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useCallback, useEffect, useMemo, useState } from "react";

import EntriesContext from "@/pages/Entries/components/EntriesContext";
import EntriesContextValue from "@/pages/Entries/types/EntriesContextValue";
import EntryModel from "@/pages/Entries/models/EntryModel";
import { TimePeriod } from "@/enums/TimePeriod";
import { db } from "@/firebase";
import { isNullOrWhiteSpace } from "@/utils/utils";
import { useAppDispatch } from "@/store/hooks/useAppDispatch";
import { useAuthentication } from "@/pages/Authentication/hooks/useAuthentication";

export function EntriesProvider(props: React.PropsWithChildren<{}>) {
  const { user } = useAuthentication();
  const [entries, setEntries] = useState<EntryModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();

  const getDateFor = (timePeriod: TimePeriod) => {
    const now = new Date();
    switch (timePeriod) {
      case TimePeriod.Week:
        return new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 7,
          now.getHours(),
          now.getMinutes()
        );
      case TimePeriod.Month:
        return new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate(),
          now.getHours(),
          now.getMinutes()
        );
      case TimePeriod.Day:
        return new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 1,
          now.getHours(),
          now.getMinutes()
        );
      case TimePeriod.TwoDays:
      default:
        return new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 2,
          now.getHours(),
          now.getMinutes()
        );
    }
  };

  const getEntries = useCallback(
    async (params: { timePeriod: TimePeriod }) => {
      const selectedChild = user?.selectedChild ?? "";
      if (user == null || isNullOrWhiteSpace(selectedChild)) {
        setEntries([]);
        setIsLoading(false);
        return [];
      }
      const endAtTimestamp = Timestamp.fromDate(getDateFor(params.timePeriod));
      const q = query(
        collection(db, `children/${selectedChild}/entries`),
        where("startDate", ">=", endAtTimestamp),
        orderBy("startDate", "desc")
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setEntries([]);
        setIsLoading(false);
        return [];
      }
      const entries: EntryModel[] = [];
      querySnapshot.forEach((doc) => {
        const entry = EntryModel.fromFirestore(doc.data());
        entry.id = doc.id;
        entries.push(entry);
      });
      setIsLoading(false);
      entries.sort((a, b) => {
        return b.startDate.getTime() - a.startDate.getTime();
      });
      return [...entries];
    },
    [user]
  );

  useEffect(() => {
    getEntries({
      timePeriod: TimePeriod.TwoDays,
    }).then((fetchedEntries) => {
      setEntries((prevEntries) => {
        if (prevEntries.length === 0) {
          return fetchedEntries;
        }
        const newEntries = [...prevEntries];
        prevEntries.forEach((prevEntry) => {
          if (!newEntries.some((newEntry) => newEntry.id === prevEntry.id)) {
            newEntries.push(prevEntry);
          }
        });
        newEntries.sort((a, b) => {
          return b.startDate.getTime() - a.startDate.getTime();
        });
        return [...newEntries];
      });
    });
    const selectedChild = user?.selectedChild ?? "";
    if (user == null || isNullOrWhiteSpace(selectedChild)) {
      return;
    }
    const now = new Date();
    const endAtTimestamp = Timestamp.fromDate(getDateFor(TimePeriod.TwoDays));
    const q = query(
      collection(db, `children/${selectedChild}/entries`),
      where("startDate", ">=", endAtTimestamp),
      orderBy("startDate", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const addedEntries: EntryModel[] = [];
      const modifiedEntries: EntryModel[] = [];
      const removedEntries: EntryModel[] = [];
      snapshot.docChanges().forEach((change) => {
        if (change.doc.data() != null) {
          const entry = EntryModel.fromFirestore(change.doc.data());
          entry.id = change.doc.id;
          if (change.type === "added") {
            addedEntries.push(entry);
          } else if (change.type === "modified") {
            modifiedEntries.push(entry);
          } else if (change.type === "removed") {
            removedEntries.push(entry);
          }
        }
      });
      if (
        addedEntries.length > 0 ||
        modifiedEntries.length > 0 ||
        removedEntries.length > 0
      ) {
        setEntries((prevEntries) => {
          let newEntries = [...prevEntries];
          removedEntries.forEach((removedEntry) => {
            newEntries = newEntries.filter(
              (entry) => entry.id !== removedEntry.id
            );
          });
          addedEntries.forEach((addedEntry) => {
            if (!newEntries.some((entry) => entry.id === addedEntry.id)) {
              newEntries.push(addedEntry);
            }
          });
          modifiedEntries.forEach((modifiedEntry) => {
            newEntries = newEntries.map((entry) => {
              if (entry.id == modifiedEntry.id) {
                return modifiedEntry;
              }
              return entry;
            });
          });
          newEntries.sort((a, b) => {
            return b.startDate.getTime() - a.startDate.getTime();
          });
          return [...newEntries];
        });
      }
    });
    return () => unsubscribe();
  }, [getEntries, user]);

  const deleteEntry = useCallback(
    async (entryId: string) => {
      const selectedChild = user?.selectedChild ?? "";
      if (user == null || isNullOrWhiteSpace(selectedChild)) {
        return;
      }
      await deleteDoc(doc(db, `children/${selectedChild}/entries`, entryId));
    },
    [user]
  );

  const saveEntry = useCallback(
    async (entry: EntryModel) => {
      const selectedChild = user?.selectedChild ?? "";
      if (user == null || isNullOrWhiteSpace(selectedChild)) {
        return null;
      }
      const { id, ...rest } = entry.toJSON({ keepDates: true });
      if (id == null) {
        const docRef = await addDoc(
          collection(db, `children/${selectedChild}/entries`),
          {
            ...rest,
            createdDate: Timestamp.fromDate(new Date()),
            createdBy: {
              id: user.uid,
              name: user.displayName ?? "",
            },
          }
        );
        return docRef.id;
      } else {
        await setDoc(doc(db, `children/${selectedChild}/entries/${id}`), {
          ...rest,
          editedDate: Timestamp.fromDate(new Date()),
          editedBy: {
            id: user.uid,
            name: user.displayName ?? "",
          },
        });
        return id;
      }
    },
    [user]
  );

  const context: EntriesContextValue = useMemo(
    () => ({
      entries,
      setEntries,
      isLoading,
      getEntries,
      deleteEntry,
      saveEntry,
    }),
    [entries, setEntries, isLoading, getEntries, deleteEntry, saveEntry]
  );

  return <EntriesContext.Provider value={context} {...props} />;
}