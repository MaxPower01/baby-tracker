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

  const [user, setUser] = useState<CustomUser | null>(null);
  const [children, setChildren] = useState<
    {
      id: string;
      name: string;
      isSelected: boolean;
    }[]
  >([]);

  const fetchUserDoc = (user: User) => {
    console.log("Fetching user doc...");
    const userRef = doc(db, "users", user.uid);
    getDoc(userRef)
      .then((docSnap) => {
        setUser(docSnap.data() as CustomUser);
        if (docSnap.data()?.children) {
          const newChildren: {
            id: string;
            name: string;
            isSelected: boolean;
          }[] = [];
          console.log("Fetching children docs...");
          console.log(docSnap.data()?.children);
          docSnap.data()?.children.forEach(async (childId: string) => {
            const childRef = doc(db, "children", childId);
            const childDocSnap = await getDoc(childRef);
            newChildren.push({
              id: childDocSnap.id,
              name: childDocSnap.data()?.name ?? "",
              isSelected: childDocSnap.id === docSnap.data()?.selectedChild,
            });
          });
          setChildren(newChildren);
        }
      })
      .catch((error) => {
        console.error(error);
        setUser(null);
      });
  };

  // Listen for changes in authentication state
  // and update the user state accordingly

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        await fetchUserDoc(user);
      } else {
        // User is signed out
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const googleSignInWithPopup = async () => {
    return new Promise<{
      user: User | undefined;
      isNewUser: boolean | undefined;
    }>(async (resolve, reject) => {
      console.log("Signing in with Google...");
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
        if (!isNewUser) {
          await fetchUserDoc(user);
        }
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
      user,
      children,
      setChildren,
      googleSignInWithPopup,
      signOut,
    };
  }, [user, children]);

  return (
    <AuthenticationContext.Provider
      value={context as AuthenticationContextValue}
    >
      {props.children}
    </AuthenticationContext.Provider>
  );
}
