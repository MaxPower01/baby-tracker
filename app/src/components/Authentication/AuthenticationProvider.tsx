import {
  DocumentData,
  Timestamp,
  WithFieldValue,
  doc,
  getDoc,
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
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Baby } from "@/types/Baby";
import { CustomUser } from "@/types/CustomUser";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { emailIsAuthorized } from "@/utils/emailIsAuthorized";
import { getDefaultEntryTypesOrder } from "@/pages/Entry/utils/getDefaultEntryTypesOrder";
import { getDefaultIntervalMethodByEntryTypeId } from "@/utils/getDefaultIntervalMethodByEntryTypeId";
import isDevelopment from "@/utils/isDevelopment";
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
  saveEntryTypesOrder: (entryTypesOrder: EntryTypeId[]) => Promise<boolean>;
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

  const fetchBabyDoc = (babyId: string) => {
    return new Promise<Baby | null>((resolve, reject) => {
      const babyDocRef = doc(db, "babies", babyId);

      getDoc(babyDocRef)
        .then((docSnap) => {
          if (docSnap.exists() && docSnap.data() != null) {
            const baby = docSnap.data() as Baby;
            const { birthDate: timestampBirthDate, ...rest } = baby;
            const birthDate = (
              timestampBirthDate as unknown as Timestamp
            ).toDate();
            return resolve({
              ...rest,
              birthDate,
            });
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
              // User has a baby selected, so we need to fetch the baby doc
              if (babyId) {
                fetchBabyDoc(babyId)
                  .then((baby) => {
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
                  })
                  .catch((error) => {
                    console.error(error);
                  })
                  .finally(() => {
                    setIsLoading(false);
                  });
              } else {
                // User does not have a baby selected
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
            getDefaultIntervalMethodByEntryTypeId();
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

  const saveEntryTypesOrder = useCallback(
    async (entryTypesOrder: EntryTypeId[]) => {
      return new Promise<boolean>(async (resolve, reject) => {
        try {
          if (user == null || user.uid == null) {
            return reject(false);
          }
          const userDocRef = doc(db, "users", user.uid);
          await setDoc(userDocRef, { entryTypesOrder }, { merge: true });
          setUser((prevUser) => {
            if (prevUser) {
              return {
                ...prevUser,
                entryTypesOrder,
              };
            }
            return prevUser;
          });
          resolve(true);
        } catch (error: any) {
          console.error(error);
          reject(false);
        }
      });
    },
    [user]
  );

  const value: AuthenticationContextType = useMemo(() => {
    return {
      user,
      setUser,
      isLoading,
      googleSignInWithPopup,
      signOut,
      saveEntryTypesOrder,
    };
  }, [
    user,
    setUser,
    googleSignInWithPopup,
    signOut,
    isLoading,
    saveEntryTypesOrder,
  ]);

  return <AuthenticationContext.Provider value={value} {...props} />;
}
