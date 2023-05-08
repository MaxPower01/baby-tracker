import { db } from "@/firebase";
import CustomUser from "@/modules/authentication/models/CustomUser";
import { useAppDispatch } from "@/modules/store/hooks/useAppDispatch";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { EntryModel } from "../models/EntryModel";
import { addEntries, selectEntries } from "../state/entriesSlice";

const useEntries = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [entries, setEntries] = useState<EntryModel[]>([]);
  const dispatch = useAppDispatch();

  const localStateEntries = useSelector(selectEntries);

  useEffect(() => {
    if (localStateEntries) {
      setEntries(localStateEntries);
      setIsLoading(false);
    }
  }, [localStateEntries]);

  const getEntries = (user: CustomUser) => {
    setIsLoading(true);
    return new Promise<EntryModel[]>(async (resolve, reject) => {
      if (user == null) {
        return reject("User is null");
      }
      const q = query(
        collection(db, `children/${user.selectedChild}/entries`),
        orderBy("startDate", "desc"),
        limit(100)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return reject("No entries found");
      }
      const entries: EntryModel[] = [];
      querySnapshot.forEach((doc) => {
        const entry = EntryModel.fromJSON(doc.data());
        entry.id = doc.id;
        entries.push(entry);
      });
      dispatch(
        addEntries({
          entries: entries.map((entry) => entry.serialize()),
          overwrite: true,
        })
      );
      resolve(entries);
    });
  };

  return { entries, isLoading, getEntries };
};

export default useEntries;
