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
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Entry } from "@/pages/Entry/types/Entry";
import { TimePeriodId } from "@/enums/TimePeriodId";
import { db } from "@/firebase";
import { isNullOrWhiteSpace } from "@/utils/utils";
import { useAppDispatch } from "@/state/hooks/useAppDispatch";
import { useAuthentication } from "@/pages/Authentication/hooks/useAuthentication";

interface EntriesContext {
  entries: Entry[];
  setEntries: React.Dispatch<React.SetStateAction<Entry[]>>;
  isLoading: boolean;
  getEntries: (params: { timePeriod: TimePeriodId }) => Promise<Entry[]>;
  deleteEntry: (entryId: string) => Promise<void>;
  saveEntry: (entry: Entry) => Promise<string | null>;
  status: "loading" | "idle";
}

const Context = createContext(null) as React.Context<EntriesContext | null>;

export function EntriesProvider(props: React.PropsWithChildren<{}>) {
  const { user } = useAuthentication();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();

  const getDateFor = (timePeriod: TimePeriodId) => {
    const now = new Date();
    switch (timePeriod) {
      case TimePeriodId.Week:
        return new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 7,
          now.getHours(),
          now.getMinutes()
        );
      case TimePeriodId.Month:
        return new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate(),
          now.getHours(),
          now.getMinutes()
        );
      case TimePeriodId.Day:
        return new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 1,
          now.getHours(),
          now.getMinutes()
        );
      case TimePeriodId.TwoDays:
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
    async (params: { timePeriod: TimePeriodId }) => {
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
      const entries: Entry[] = [];
      querySnapshot.forEach((doc) => {
        // const entry = EntryModel.fromFirestore(doc.data());
        // entry.id = doc.id;
        // entries.push(entry);
      });
      setIsLoading(false);
      entries.sort((a, b) => {
        return b.startTimestamp - a.startTimestamp;
      });
      return [...entries];
    },
    [user]
  );

  useEffect(() => {
    getEntries({
      timePeriod: TimePeriodId.TwoDays,
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
          return b.startTimestamp - a.startTimestamp;
        });
        return [...newEntries];
      });
    });
    const selectedChild = user?.selectedChild ?? "";
    if (user == null || isNullOrWhiteSpace(selectedChild)) {
      return;
    }
    const now = new Date();
    const endAtTimestamp = Timestamp.fromDate(getDateFor(TimePeriodId.TwoDays));
    const q = query(
      collection(db, `children/${selectedChild}/entries`),
      where("startDate", ">=", endAtTimestamp),
      orderBy("startDate", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const addedEntries: Entry[] = [];
      const modifiedEntries: Entry[] = [];
      const removedEntries: Entry[] = [];
      snapshot.docChanges().forEach((change) => {
        if (change.doc.data() != null) {
          // const entry = EntryModel.fromFirestore(change.doc.data());
          // entry.id = change.doc.id;
          // if (change.type === "added") {
          //   addedEntries.push(entry);
          // } else if (change.type === "modified") {
          //   modifiedEntries.push(entry);
          // } else if (change.type === "removed") {
          //   removedEntries.push(entry);
          // }
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
            return b.startTimestamp - a.startTimestamp;
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
    async (entry: Entry) => {
      const selectedChild = user?.selectedChild ?? "";
      if (user == null || isNullOrWhiteSpace(selectedChild)) {
        return null;
      }
      const { id, ...rest } = entry;
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

  const context: EntriesContext = useMemo(
    () => ({
      entries,
      setEntries,
      isLoading,
      getEntries,
      deleteEntry,
      saveEntry,
      status: isLoading ? "loading" : "idle",
    }),
    [entries, setEntries, isLoading, getEntries, deleteEntry, saveEntry]
  );

  return <Context.Provider value={context} {...props} />;
}

export function useEntries() {
  const context = useContext(Context);
  if (context == null) {
    throw new Error(
      "Entries context is null. Make sure to call useEntries() inside of a <EntriesProvider />"
    );
  }
  return context;
}
