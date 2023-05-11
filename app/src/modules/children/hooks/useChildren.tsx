import { db } from "@/firebase";
import useAuthentication from "@/modules/authentication/hooks/useAuthentication";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

const useChildren = () => {
  const { user } = useAuthentication();
  const [selectedChild, setSelectedChild] = useState<{
    id: string;
    name: string;
    parents: string[];
  } | null>(null);
  useEffect(() => {
    if (!user) return;
    const collectionRef = collection(db, "children");
    getDocs(collectionRef).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.data().parents.includes(user.uid)) {
          setSelectedChild({
            id: doc.id,
            name: doc.data().name,
            parents: doc.data().parents,
          });
        }
      });
    });
  }, [user]);
  return { selectedChild };
};
export default useChildren;
