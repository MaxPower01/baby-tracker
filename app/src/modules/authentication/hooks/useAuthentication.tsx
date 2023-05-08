import { auth, db } from "@/firebase";
import CustomUser from "@/modules/authentication/models/CustomUser";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

const useAuthentication = () => {
  const [customUser, setCustomUser] = useState<CustomUser | null>(null);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const userRef = doc(db, "users", user.uid);
        getDoc(userRef)
          .then((docSnap) => {
            setCustomUser(docSnap.data() as CustomUser);
          })
          .catch((error) => {
            console.error(error);
            setCustomUser(null);
          });
      } else {
        // User is signed out
        setCustomUser(null);
      }
    });
  }, []);
  return { user: customUser };
};

export default useAuthentication;
