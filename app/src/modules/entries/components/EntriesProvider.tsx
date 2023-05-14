import TimePeriod from "@/common/enums/TimePeriod";
import { db } from "@/firebase";
import { isNullOrWhiteSpace } from "@/lib/utils";
import useAuthentication from "@/modules/authentication/hooks/useAuthentication";
import EntriesContext from "@/modules/entries/components/EntriesContext";
import EntryModel from "@/modules/entries/models/EntryModel";
import EntriesContextValue from "@/modules/entries/types/EntriesContextValue";
import { useAppDispatch } from "@/modules/store/hooks/useAppDispatch";
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

export default function EntriesProvider(props: React.PropsWithChildren<{}>) {
  const { user, children } = useAuthentication();
  const [entries, setEntries] = useState<EntryModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();

  const getDateFor = (timePeriod: TimePeriod) => {
    const now = new Date();
    switch (timePeriod) {
      case TimePeriod.LastWeek:
        return new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 7,
          now.getHours(),
          now.getMinutes()
        );
      case TimePeriod.LastMonth:
        return new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate(),
          now.getHours(),
          now.getMinutes()
        );
      case TimePeriod.LastDay:
      default:
        return new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 1,
          now.getHours(),
          now.getMinutes()
        );
    }
  };

  const getEntries = useCallback(
    async (params: { timePeriod: TimePeriod }) => {
      const selectedChild =
        children.find((child) => child.isSelected)?.id ??
        user?.selectedChild ??
        "";
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
      return entries;
    },
    [user, children]
  );

  useEffect(() => {
    getEntries({
      timePeriod: TimePeriod.LastDay,
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
        return newEntries;
      });
    });
    const selectedChild =
      children.find((child) => child.isSelected)?.id ??
      user?.selectedChild ??
      "";
    if (user == null || isNullOrWhiteSpace(selectedChild)) {
      return;
    }
    const now = new Date();
    const endAtTimestamp = Timestamp.fromDate(getDateFor(TimePeriod.LastDay));
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
          return [...newEntries];
        });
      }
    });
    return () => unsubscribe();
  }, [getEntries, user]);

  const deleteEntry = useCallback(
    async (entryId: string) => {
      const selectedChild =
        children.find((child) => child.isSelected)?.id ??
        user?.selectedChild ??
        "";
      if (user == null || isNullOrWhiteSpace(selectedChild)) {
        return;
      }
      await deleteDoc(doc(db, `children/${selectedChild}/entries`, entryId));
    },
    [user, children]
  );

  const saveEntry = useCallback(
    async (entry: EntryModel) => {
      const selectedChild =
        children.find((child) => child.isSelected)?.id ??
        user?.selectedChild ??
        "";
      if (user == null || isNullOrWhiteSpace(selectedChild)) {
        return;
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
        entry.id = docRef.id;
      } else {
        await setDoc(doc(db, `children/${selectedChild}/entries/${id}`), {
          ...rest,
          editedDate: Timestamp.fromDate(new Date()),
          editedBy: {
            id: user.uid,
            name: user.displayName ?? "",
          },
        });
      }
    },
    [user, children]
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
