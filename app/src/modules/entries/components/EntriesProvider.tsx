import { db } from "@/firebase";
import { isNullOrWhiteSpace } from "@/lib/utils";
import useAuthentication from "@/modules/authentication/hooks/useAuthentication";
import EntriesContext from "@/modules/entries/components/EntriesContext";
import EntryModel from "@/modules/entries/models/EntryModel";
import { addEntries } from "@/modules/entries/state/entriesSlice";
import EntriesContextValue from "@/modules/entries/types/EntriesContextValue";
import { useAppDispatch } from "@/modules/store/hooks/useAppDispatch";
import {
  QueryConstraint,
  Timestamp,
  collection,
  getDocs,
  limit,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function EntriesProvider(props: React.PropsWithChildren<{}>) {
  const { user, children } = useAuthentication();
  const [entries, setEntries] = useState<EntryModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const getQuery = (params: {
    selectedChild: string;
    startAt?: Date;
    endAt?: Date;
    max?: number;
  }) => {
    const { startAt, endAt, max, selectedChild } = params;
    const collectionRef = collection(db, `children/${selectedChild}/entries`);
    const constraints: QueryConstraint[] = [];
    if (endAt != null) {
      constraints.push(where("startDate", ">=", Timestamp.fromDate(endAt)));
    }
    if (startAt != null) {
      constraints.push(where("startDate", "<=", Timestamp.fromDate(startAt)));
    }
    if (max != null) {
      constraints.push(limit(max));
    } else if (startAt == null && endAt == null) {
      constraints.push(limit(10));
    }
    return query(collectionRef, ...constraints);
  };

  const getEntries = useCallback(
    async (params?: { startAt?: Date; endAt?: Date; max?: number }) => {
      setIsLoading(true);
      const selectedChild =
        children.find((child) => child.isSelected)?.id ?? "";
      if (user == null || isNullOrWhiteSpace(selectedChild)) {
        setEntries([]);
        setIsLoading(false);
        return;
      }
      const querySnapshot = await getDocs(
        getQuery({
          selectedChild,
          ...params,
        })
      );
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
    },
    [user]
  );

  useEffect(() => {
    const selectedChild = children.find((child) => child.isSelected)?.id ?? "";
    if (user == null || isNullOrWhiteSpace(selectedChild)) {
      return;
    }
    // Fetch entries of the last 24 hours by default
    const now = new Date();
    const yesterday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 1
    );
    getEntries({
      endAt: yesterday,
    });
    const q = getQuery({
      selectedChild,
      endAt: yesterday,
    });
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const addedEntries: EntryModel[] = [];
      const modifiedEntries: EntryModel[] = [];
      const removedEntries: EntryModel[] = [];
      snapshot.docChanges().forEach((change) => {
        if (change.doc.data() != null) {
          const entry = EntryModel.fromFirestore(change.doc.data());
          entry.id = change.doc.id;
          if (change.type === "added") {
            console.log("Added entry", entry);
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
            if (!newEntries.length) {
              newEntries.push(addedEntry);
            } else if (
              !newEntries.some((entry) => entry.id === addedEntry.id)
            ) {
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
  }, [getEntries, user, children]);

  const context: EntriesContextValue = useMemo(
    () => ({
      entries,
      isLoading,
      getEntries,
    }),
    [entries, isLoading, getEntries, user]
  );

  return <EntriesContext.Provider value={context} {...props} />;
}
