import { auth, db, googleAuthProvider } from "@/firebase";
import CustomUser from "@/modules/authentication/models/CustomUser";
import {
  User,
  getAdditionalUserInfo,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import {
  DocumentData,
  WithFieldValue,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import AuthenticationContext, {
  AuthenticationContextValue,
} from "./AuthenticationContext";

export default function AuthenticationProvider(
  props: React.PropsWithChildren<{}>
) {
  // Store the user in a state variable

  const [customUser, setCustomUser] = useState<CustomUser | null>(null);

  // Listen for changes in authentication state
  // and update the user state accordingly

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
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
    return () => unsubscribe();
  }, []);

  const googleSignInWithPopup = async () => {
    return new Promise<{
      user: User | undefined;
      isNewUser: boolean | undefined;
    }>(async (resolve, reject) => {
      let user: User | undefined;
      let isNewUser: boolean | undefined;
      try {
        const result = await signInWithPopup(auth, googleAuthProvider);
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential?.accessToken;
        const additionalUserInfo = getAdditionalUserInfo(result);
        isNewUser = additionalUserInfo?.isNewUser;
        user = result.user;
      } catch (error: any) {
        return reject(error);
      }
      if (!user) {
        return reject("User is null");
      }
      try {
        const userRef = doc(db, "users", user.uid);
        const data: WithFieldValue<DocumentData> = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
          phoneNumber: user.phoneNumber,
          providerId: user.providerId,
          creationTime: user.metadata.creationTime,
          lastSignInTime: user.metadata.lastSignInTime,
        };
        if (isNewUser) {
          data.selectedChild = "";
          data.children = [];
        }
        await setDoc(userRef, data, { merge: true });
      } catch (error: any) {
        return reject(error);
      }
      return resolve({ user, isNewUser });
    });
  };

  const signOut = async () => {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        await auth.signOut();
        resolve(true);
      } catch (error: any) {
        console.error(error);
        reject(false);
      }
    });
  };

  const context: AuthenticationContextValue = useMemo(() => {
    return {
      user: customUser,
      googleSignInWithPopup,
      signOut,
    };
  }, [customUser]);

  return (
    <AuthenticationContext.Provider
      value={context as AuthenticationContextValue}
    >
      {props.children}
    </AuthenticationContext.Provider>
  );
}
