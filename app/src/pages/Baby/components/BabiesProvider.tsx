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
  saveBaby: (baby: Baby) => Promise<Baby>;
}

const Context = createContext(null) as React.Context<BabiesContext | null>;

export function useBabies() {
  const context = useContext(Context);
  if (context == null) {
    throw new Error(
      "Children context is null. Make sure to call useChidlren() inside of a <ChildrenProvider />"
    );
  }
  return context;
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

  const context = useMemo(() => {
    const result: BabiesContext = {
      saveBaby,
    };
    return result;
  }, [babies, isLoading, user, saveBaby]);

  return <Context.Provider value={context} {...props} />;
}
