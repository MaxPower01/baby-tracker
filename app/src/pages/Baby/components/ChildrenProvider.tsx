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

import Child from "@/pages/Authentication/types/Child";
import { db } from "@/firebase";
import { useAuthentication } from "@/pages/Authentication/hooks/useAuthentication";

interface ChildrenContext {
  children: Child[] | null;
  isLoading: boolean;
  saveChild: (child: Child) => Promise<Child>;
}

const Context = createContext(null) as React.Context<ChildrenContext | null>;

export function useChildren() {
  const entries = useContext(Context);
  if (entries == null) {
    throw new Error(
      "Children context is null. Make sure to call useChidlren() inside of a <ChildrenProvider />"
    );
  }
  return entries;
}

export function ChildrenProvider(props: React.PropsWithChildren<{}>) {
  const { user } = useAuthentication();
  const [children, setChildren] = useState<Child[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const saveChild = useCallback(
    (child: Child) => {
      return new Promise<Child>((resolve, reject) => {
        if (!user) {
          reject("User not logged in");
          return;
        }
        if (!child) {
          reject("Child not provided");
          return;
        }
        const { id, birthDate, ...childData } = child;
        if (!id) {
          reject("Child id not provided");
          return;
        }
        setDoc(doc(db, "children", id), {
          ...childData,
          birthDate: Timestamp.fromDate(birthDate),
        })
          .then(() => {
            resolve(child);
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
    const collectionRef = collection(db, `children`); // TODO: Use query to filter by user instead of watching all children
    const newChildren: Child[] = [];
    getDocs(collectionRef)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.data().parents?.includes(user.uid)) {
            const child: Child = {
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
            newChildren.push(child);
          }
        });
        setChildren(newChildren);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      })
      .finally(() => {
        setIsLoading(false);
      });

    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      const addedChildren: Child[] = [];
      const modifiedChildren: Child[] = [];
      const removedChildren: Child[] = [];
      snapshot.docChanges().forEach((change) => {
        if (change.doc.data() != null) {
          const child: Child = {
            id: change.doc.id,
            name: change.doc.data().name,
            parents: change.doc.data().parents,
            birthDate: change.doc.data().birthDate.toDate(),
            sex: change.doc.data().sex,
            birthHeadCircumference: change.doc.data().birthHeadCircumference,
            birthSize: change.doc.data().birthSize,
            birthWeight: change.doc.data().birthWeight,
            avatar: change.doc.data().avatar,
          };
          if (child.parents?.includes(user.uid)) {
            if (change.type === "added") {
              addedChildren.push(child);
            } else if (change.type === "modified") {
              modifiedChildren.push(child);
            } else if (change.type === "removed") {
              removedChildren.push(child);
            }
          }
        }
      });
      if (
        addedChildren.length > 0 ||
        modifiedChildren.length > 0 ||
        removedChildren.length > 0
      ) {
        setChildren((prevChildren) => {
          let newChildren = prevChildren == null ? [] : [...prevChildren];
          removedChildren.forEach((removedEntry) => {
            newChildren = newChildren.filter(
              (entry) => entry.id !== removedEntry.id
            );
          });
          addedChildren.forEach((addedEntry) => {
            if (!newChildren.some((entry) => entry.id === addedEntry.id)) {
              newChildren.push(addedEntry);
            }
          });
          modifiedChildren.forEach((modifiedEntry) => {
            newChildren = newChildren.map((entry) => {
              if (entry.id == modifiedEntry.id) {
                return modifiedEntry;
              }
              return entry;
            });
          });
          // newChildren.sort((a, b) => {
          //   return b.startDate.getTime() - a.startDate.getTime();
          // });
          return [...newChildren];
        });
      }
    });
  }, [user]);

  const context: ChildrenContext = useMemo(
    () => ({
      children,
      isLoading,
      saveChild,
    }),
    [children, isLoading, user, saveChild]
  );

  return <Context.Provider value={context} {...props} />;
}
