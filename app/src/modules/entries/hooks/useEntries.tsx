import { db } from "@/firebase";
import useAuthentication from "@/modules/authentication/hooks/useAuthentication";
import { useAppDispatch } from "@/modules/store/hooks/useAppDispatch";
import { collection, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { EntryModel } from "../models/EntryModel";
import { addEntries } from "../state/entriesSlice";

const useEntries = () => {
  const { user } = useAuthentication();
  const [isLoading, setIsLoading] = useState(true);
  const [entries, setEntries] = useState<EntryModel[]>([]);
  const dispatch = useAppDispatch();

  // const localStateEntries = useSelector(selectEntries);

  // useEffect(() => {
  //   if (localStateEntries) {
  //     setEntries(localStateEntries);
  //     setIsLoading(false);
  //   }
  // }, [localStateEntries]);

  const getEntries = () => {
    setIsLoading(true);
    return new Promise<EntryModel[]>(async (resolve, reject) => {
      if (user == null) {
        return reject("User is null");
      }
      const q = query(collection(db, `children/${user.selectedChild}/entries`));
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

  useEffect(() => {
    if (user == null) {
      return;
    }
    getEntries()
      .then((entries) => {
        setEntries(entries);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error(error);
      });
  }, [user]);

  return { entries, isLoading, getEntries };
};

export default useEntries;
