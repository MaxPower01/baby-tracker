import { db } from "@/firebase";
import { isNullOrWhiteSpace } from "@/lib/utils";
import useAuthentication from "@/modules/authentication/hooks/useAuthentication";
import EntriesContext from "@/modules/entries/components/EntriesContext";
import EntryModel from "@/modules/entries/models/EntryModel";
import { addEntries } from "@/modules/entries/state/entriesSlice";
import EntriesContextValue from "@/modules/entries/types/EntriesContextValue";
import { useAppDispatch } from "@/modules/store/hooks/useAppDispatch";
import {
  Timestamp,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function EntriesProvider(props: React.PropsWithChildren<{}>) {
  const { user } = useAuthentication();
  const [entries, setEntries] = useState<EntryModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();

  const getEntries = useCallback(async () => {
    if (user == null || isNullOrWhiteSpace(user.selectedChild)) {
      setEntries([]);
      setIsLoading(false);
      return;
    }
    const endAtTimestamp = Timestamp.fromDate(
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() - 1
      )
    );
    const q = query(
      collection(db, `children/${user.selectedChild}/entries`),
      where("startDate", ">=", endAtTimestamp),
      orderBy("startDate", "desc")
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      setEntries([]);
      setIsLoading(false);
      return;
    }
    const entries: EntryModel[] = [];
    querySnapshot.forEach((doc) => {
      const entry = EntryModel.fromFirestore(doc.data());
      entry.id = doc.id;
      entries.push(entry);
    });
    // Entries are added to the store so that they can be used other pages
    // without having to fetch them again
    dispatch(
      addEntries({
        entries: entries.map((entry) => entry.serialize()),
        overwrite: true,
      })
    );
    setEntries((prevEntries) => {
      if (prevEntries.length === 0) {
        return entries;
      }
      const newEntries = [...entries];
      prevEntries.forEach((prevEntry) => {
        if (!newEntries.some((newEntry) => newEntry.id === prevEntry.id)) {
          newEntries.push(prevEntry);
        }
      });
      return newEntries;
    });
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    getEntries();
    if (user == null || isNullOrWhiteSpace(user.selectedChild)) {
      return;
    }
    const endAtTimestamp = Timestamp.fromDate(
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() - 1
      )
    );
    const q = query(
      collection(db, `children/${user.selectedChild}/entries`),
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
            addedEntries.push(entry);
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
          dispatch(
            addEntries({
              entries: newEntries.map((entry) => entry.serialize()),
              overwrite: true,
            })
          );
          return newEntries;
        });
      }
    });
    return () => unsubscribe();
  }, [getEntries, user]);

  const context: EntriesContextValue = useMemo(
    () => ({
      entries,
      isLoading,
      getEntries,
    }),
    [entries, isLoading, getEntries]
  );

  return <EntriesContext.Provider value={context} {...props} />;
}
