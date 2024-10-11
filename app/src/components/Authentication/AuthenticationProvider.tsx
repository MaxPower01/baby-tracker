import {
  DocumentData,
  WithFieldValue,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
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
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  saveEntryTypesOrderInState,
  saveIntervalMethodByEntryTypeIdInState,
} from "@/state/slices/settingsSlice";

import { ActivityContext } from "@/pages/Activity/types/ActivityContext";
import { Baby } from "@/types/Baby";
import { CustomUser } from "@/types/CustomUser";
import { emailIsAuthorized } from "@/utils/emailIsAuthorized";
import { getDefaulIntervalMethodByEntryTypeId } from "@/utils/getDefaulIntervalMethodByEntryTypeId";
import { getDefaultEntryTypesOrder } from "@/pages/Entry/utils/getDefaultEntryTypesOrder";
import isDevelopment from "@/utils/isDevelopment";
import { saveActivityContextsInState } from "@/state/slices/activitiesSlice";
import { useAppDispatch } from "@/state/hooks/useAppDispatch";

interface AuthenticationContextType {
  user: CustomUser | null;
  setUser: React.Dispatch<React.SetStateAction<CustomUser | null>>;
  isLoading: boolean;
  googleSignInWithPopup: () => Promise<{
    user: User | undefined;
    isNewUser: boolean | undefined;
  }>;
  signOut: () => Promise<boolean>;
  emailIsAuthorized: (email: string) => Promise<boolean>;
}

const AuthenticationContext = createContext<
  AuthenticationContextType | undefined
>(undefined);

export function useAuthentication() {
  const authentication = useContext(AuthenticationContext);
  if (authentication == null) {
    throw new Error(
      "Authentication context is null. Make sure to call useAuthentication() inside of a <AuthenticationProvider />"
    );
  }
  return authentication;
}

export function AuthenticationProvider(props: React.PropsWithChildren<{}>) {
  const dispatch = useAppDispatch();

  const [user, setUser] = useState<CustomUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // const dispatchUserPreferences = (newUser: CustomUser) => {
  //   dispatch(
  //     saveIntervalMethodByEntryTypeIdInState({
  //       intervalMethodByEntryTypeId: newUser.intervalMethodByEntryTypeId,
  //     })
  //   );

  //   dispatch(
  //     saveEntryTypesOrderInState({
  //       entryTypesOrder: newUser.entryTypesOrder,
  //     })
  //   );

  //   const baby = newUser.babies?.find((baby) => baby.id === newUser.babyId);

  //   if (baby) {
  //     dispatch(
  //       saveActivityContextsInState({
  //         activityContexts: (baby.activityContexts as ActivityContext[]).map(
  //           (activityContext) => JSON.stringify(activityContext)
  //         ),
  //       })
  //     );
  //   }
  // };

  const fetchUserDoc = (user: User) => {
    return new Promise<CustomUser | null>((resolve, reject) => {
      const userDocRef = doc(db, "users", user.uid);

      getDoc(userDocRef)
        .then((docSnap) => {
          if (docSnap.exists() && docSnap.data() != null) {
            return resolve(docSnap.data() as CustomUser);
          } else {
            return resolve(null);
          }
        })
        .catch((error) => {
          console.error(error);
          return reject(error);
        });
    });
  };

  // Listen for changes in authentication state
  // and update the user state accordingly

  useEffect(() => {
    const unsubscribeFromAuthChanges = onAuthStateChanged(
      auth,
      async (user) => {
        if (user) {
          // User is signed in

          let babyId: string | null = null;

          fetchUserDoc(user)
            .then((newUser) => {
              if (newUser) {
                babyId = newUser.babyId;
                setUser(newUser);
              } else {
                setUser(null);
              }
            })
            .catch((error) => {
              setUser(null);
              console.error(error);
            })
            .finally(() => {
              if (babyId) {
                fetchBabyDoc(babyId).then((baby) => {
                  if (baby) {
                    setUser((prevUser) => {
                      if (prevUser) {
                        return {
                          ...prevUser,
                          baby,
                        };
                      }
                      return prevUser;
                    });
                  }
                });
              } else {
                setIsLoading(false);
              }
            });
        } else {
          // User is signed out

          setUser(null);
          setIsLoading(false);
        }
      }
    );
    return () => {
      unsubscribeFromAuthChanges();
    };
  }, []);

  useEffect(() => {
    const babyId = user?.babyId;
    if (babyId) {
      const babyDocRef = doc(db, "babies", babyId);
      // const unsubscribeFromBabyChanges = onSnapshot(babyDocRef, (doc) => {
      //   try {
      //     if (doc.exists()) {
      //       const babyData = doc.data();
      //       if (babyData) {
      //         const { birthDate, ...rest } = babyData;
      //         const parsedBirthDate = birthDate.toDate();
      //         if (parsedBirthDate) {
      //           let newUser = null;
      //           setUser((prevUser) => {
      //             if (prevUser) {
      //               const newBabies = prevUser.babies.map((baby) => {
      //                 if (baby.id === babyId) {
      //                   return {
      //                     id: babyId,
      //                     birthDate: parsedBirthDate as Date,
      //                     ...(rest as any),
      //                   };
      //                 }
      //                 return baby;
      //               });
      //               newUser = {
      //                 ...prevUser,
      //                 babies: newBabies,
      //               };
      //               return newUser;
      //             }
      //             return prevUser;
      //           });
      //           // if (newUser != null) {
      //           //   dispatchUserPreferences(newUser);
      //           // }
      //         } else {
      //           throw new Error("Birth date is null");
      //         }
      //       } else {
      //         throw new Error("Baby data is null");
      //       }
      //     } else {
      //       // TODO: Handle case where baby doc does not exist (deleted by another user?)
      //       throw new Error("Baby doc does not exist");
      //     }
      //   } catch (error) {
      //     console.error("Error updating baby data in user", error);
      //   }
      // });
      // return () => {
      //   unsubscribeFromBabyChanges();
      // };
    }
  }, [user?.babyId]);

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

        if (result.user.email == null) {
          return reject("Email is null");
        }

        const isAuthorized =
          isDevelopment() || (await emailIsAuthorized(result.user.email));

        const additionalUserInfo = getAdditionalUserInfo(result);
        isNewUser = additionalUserInfo?.isNewUser;

        if (isAuthorized) {
          user = result.user;
        } else {
          setUser(null);
          await signOut();
          await deleteUser(result.user);
          return reject("User is not authorized");
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
          (data as CustomUser).babyId = "";
          (data as CustomUser).babies = [];
          (data as CustomUser).intervalMethodByEntryTypeId =
            getDefaulIntervalMethodByEntryTypeId();
          (data as CustomUser).entryTypesOrder = getDefaultEntryTypesOrder();
          (data as CustomUser).createdAt = serverTimestamp();
        }
        await setDoc(userRef, data, { merge: true });
        if (!isNewUser) {
          await fetchUserDoc(user);
        }
        return resolve({ user, isNewUser });
      } catch (error: any) {
        return reject(error);
      }
    });
  };

  const signOut = async () => {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        await auth.signOut();
        setUser(null);
        resolve(true);
      } catch (error: any) {
        console.error(error);
        reject(false);
      }
    });
  };

  const value: AuthenticationContextType = useMemo(() => {
    return {
      user,
      setUser,
      isLoading,
      googleSignInWithPopup,
      signOut,
      emailIsAuthorized,
    };
  }, [
    user,
    setUser,
    googleSignInWithPopup,
    signOut,
    emailIsAuthorized,
    isLoading,
  ]);

  return <AuthenticationContext.Provider value={value} {...props} />;
}
