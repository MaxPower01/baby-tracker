import { db } from "@/firebase";
import { isNullOrWhiteSpace } from "@/lib/utils";
import useAuthentication from "@/modules/authentication/hooks/useAuthentication";
import { EntryModel } from "@/modules/entries/models/EntryModel";
import { addEntries } from "@/modules/entries/state/entriesSlice";
import { useAppDispatch } from "@/modules/store/hooks/useAppDispatch";
import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

const useEntries = () => {
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
    const q = query(
      collection(db, `children/${user.selectedChild}/entries`),
      orderBy("startDate", "desc"),
      limit(50)
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
    const q = query(
      collection(db, `children/${user.selectedChild}/entries`),
      orderBy("startDate", "desc"),
      limit(50)
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
            console.log("modified");
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

  return { entries, isLoading, getEntries };
};

export default useEntries;
