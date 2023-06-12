import { collection, getDocs } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";

import Child from "@/modules/authentication/types/Child";
import ChildrenContext from "@/modules/children/components/ChildrenContext";
import ChildrenContextValue from "@/modules/children/types/ChildrenContextValue";
import { db } from "@/firebase";
import useAuthentication from "@/modules/authentication/hooks/useAuthentication";

export default function ChildrenProvider(props: React.PropsWithChildren<{}>) {
  const { user } = useAuthentication();
  const [children, setChildren] = useState<Child[] | null>(null);

  useEffect(() => {
    if (!user) return;
    const collectionRef = collection(db, "children");
    const newChildren: Child[] = [];
    getDocs(collectionRef).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.data().parents.includes(user.uid)) {
          const child: Child = {
            id: doc.id,
            name: doc.data().name,
            birthDate: doc.data().birthDate.toDate(),
            sex: doc.data().sex,
          };
          newChildren.push(child);
        }
      });
      setChildren(newChildren);
    });
  }, [user]);

  const context: ChildrenContextValue = useMemo(
    () => ({
      children,
    }),
    [children]
  );

  return <ChildrenContext.Provider value={context} {...props} />;
}
