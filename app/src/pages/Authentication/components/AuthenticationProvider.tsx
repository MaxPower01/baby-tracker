import {
  DocumentData,
  WithFieldValue,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import {
  User,
  deleteUser,
  getAdditionalUserInfo,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import { auth, db, googleAuthProvider } from "@/firebase";
import { useEffect, useMemo, useState } from "react";

import AuthenticationContext from "@/pages/Authentication/components/AuthenticationContext";
import AuthenticationContextValue from "@/pages/Authentication/types/AuthenticationContextValue";
import Baby from "@/pages/Authentication/types/Baby";
import CustomUser from "@/pages/Authentication/types/CustomUser";
import isDevelopment from "@/utils/isDevelopment";

export function AuthenticationProvider(props: React.PropsWithChildren<{}>) {
  // Store the user in a state variable

  const [user, setUser] = useState<CustomUser | null>(null);
  const [babies, setBabies] = useState<Baby[]>([]);

  const fetchUserDoc = (user: User) => {
    const userRef = doc(db, "users", user.uid);
    getDoc(userRef)
      .then((docSnap) => {
        if (docSnap.data() != null) {
          setUser(docSnap.data() as CustomUser);
          if (docSnap.data()?.babies) {
            const newBabies: Baby[] = [];
            docSnap.data()?.babies.forEach(async (babyId: string) => {
              const docRef = doc(db, "babies", babyId);
              const docSnap = await getDoc(docRef);
              const docData = docSnap.data();
              if (docData) {
                const { birthDate, ...rest } = docData;
                const parsedBirthDate = birthDate.toDate();
                if (parsedBirthDate) {
                  newBabies.push({
                    id: babyId,
                    birthDate: parsedBirthDate as Date,
                    ...(rest as any),
                  });
                } else {
                  throw new Error("Birth date is null");
                }
              }
            });
            setBabies(newBabies);
          }
        } else {
          setUser(null);
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
      let user: User | undefined;
      let isNewUser: boolean | undefined;
      try {
        const result = await signInWithPopup(auth, googleAuthProvider);
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential?.accessToken;
        const authorizedEmails = [
          "max.manseau01@gmail.com",
          "audrey_ann.piscine@hotmail.com",
          "cadieuxsimon91@gmail.com",
          "sophie.manseau@gmail.com",
          "thalyvon@cablevision.qc.ca",
          "fcote112@gmail.com",
          "paulette.manseau@gmail.com",
          "alessard18@hotmail.com",
        ];
        const additionalUserInfo = getAdditionalUserInfo(result);
        isNewUser = additionalUserInfo?.isNewUser;
        const isAuthorizedUser = authorizedEmails.includes(
          result.user.email ?? ""
        );
        if (isAuthorizedUser || isDevelopment()) {
          user = result.user;
        } else {
          await deleteUser(result.user);
          return reject("New users are not allowed to sign up right now");
        }
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
          data.babyId = "";
          data.babies = [];
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
      setUser,
      googleSignInWithPopup,
      signOut,
    };
  }, [user, babies]);

  return (
    <AuthenticationContext.Provider
      value={context as AuthenticationContextValue}
      {...props}
    />
  );
}
