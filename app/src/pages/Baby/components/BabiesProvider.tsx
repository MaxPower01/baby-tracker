import {
  Timestamp,
  collection,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import Baby from "@/pages/Authentication/types/Baby";
import { db } from "@/firebase";
import { useAuthentication } from "@/pages/Authentication/hooks/useAuthentication";

interface BabiesContext {
  babies: Baby[] | null;
  isLoading: boolean;
  saveBaby: (baby: Baby) => Promise<Baby>;
}

const Context = createContext(null) as React.Context<BabiesContext | null>;

export function useBabies() {
  const entries = useContext(Context);
  if (entries == null) {
    throw new Error(
      "Children context is null. Make sure to call useChidlren() inside of a <ChildrenProvider />"
    );
  }
  return entries;
}

export function BabiesProvider(props: React.PropsWithChildren<{}>) {
  const { user } = useAuthentication();
  const [babies, setBabies] = useState<Baby[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const saveBaby = useCallback(
    (baby: Baby) => {
      return new Promise<Baby>((resolve, reject) => {
        if (!user) {
          reject("User not logged in");
          return;
        }
        if (!baby) {
          reject("Baby not provided");
          return;
        }
        const { id, birthDate, ...rest } = baby;
        if (!id) {
          reject("Baby id not provided");
          return;
        }
        setDoc(doc(db, "babies", id), {
          ...rest,
          birthDate: Timestamp.fromDate(birthDate),
        })
          .then(() => {
            resolve(baby);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    [user]
  );

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    const collectionRef = collection(db, `babies`); // TODO: Use query to filter by user instead of watching all babies
    const newBabies: Baby[] = [];
    getDocs(collectionRef)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.data().parents?.includes(user.uid)) {
            const baby: Baby = {
              id: doc.id,
              name: doc.data().name,
              parents: doc.data().parents,
              birthDate: doc.data().birthDate.toDate(),
              sex: doc.data().sex,
              birthHeadCircumference: doc.data().birthHeadCircumference,
              birthSize: doc.data().birthSize,
              birthWeight: doc.data().birthWeight,
              avatar: doc.data().avatar,
            };
            newBabies.push(baby);
          }
        });
        setBabies(newBabies);
      })
      .catch((error) => {
        console.error("Error getting documents: ", error);
      })
      .finally(() => {
        setIsLoading(false);
      });

    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      const addedBabies: Baby[] = [];
      const modifiedBabies: Baby[] = [];
      const removedBabies: Baby[] = [];
      snapshot.docChanges().forEach((change) => {
        if (change.doc.data() != null) {
          const baby: Baby = {
            id: change.doc.id,
            name: change.doc.data().name,
            parents: change.doc.data().parents,
            birthDate: change.doc.data().birthDate.toDate(),
            sex: change.doc.data().sex,
            birthHeadCircumference: change.doc.data().birthHeadCircumference,
            birthSize: change.doc.data().birthSize,
            birthWeight: change.doc.data().birthWeight,
            avatar: change.doc.data().avatar,
            activityContexts: change.doc.data().activityContexts,
          };
          if (baby.parents?.includes(user.uid)) {
            if (change.type === "added") {
              addedBabies.push(baby);
            } else if (change.type === "modified") {
              modifiedBabies.push(baby);
            } else if (change.type === "removed") {
              removedBabies.push(baby);
            }
          }
        }
      });
      if (
        addedBabies.length > 0 ||
        modifiedBabies.length > 0 ||
        removedBabies.length > 0
      ) {
        setBabies((prevBaby) => {
          let newBaby = prevBaby == null ? [] : [...prevBaby];
          removedBabies.forEach((removedEntry) => {
            newBaby = newBaby.filter((entry) => entry.id !== removedEntry.id);
          });
          addedBabies.forEach((addedEntry) => {
            if (!newBaby.some((entry) => entry.id === addedEntry.id)) {
              newBaby.push(addedEntry);
            }
          });
          modifiedBabies.forEach((modifiedEntry) => {
            newBaby = newBaby.map((entry) => {
              if (entry.id == modifiedEntry.id) {
                return modifiedEntry;
              }
              return entry;
            });
          });
          // newChildren.sort((a, b) => {
          //   return b.startDate.getTime() - a.startDate.getTime();
          // });
          return [...newBaby];
        });
      }
    });
  }, [user]);

  const context: BabiesContext = useMemo(
    () => ({
      babies,
      isLoading,
      saveBaby,
    }),
    [babies, isLoading, user, saveBaby]
  );

  return <Context.Provider value={context} {...props} />;
}
