import {
  DocumentData,
  FieldValue,
  Timestamp,
  WithFieldValue,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
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
  saveEntryTypesOrderInState,
  saveIntervalMethodByEntryTypeIdInState,
} from "@/state/slices/settingsSlice";
import { useEffect, useMemo, useState } from "react";

import { ActivityContext } from "@/pages/Activity/types/ActivityContext";
import AuthenticationContext from "@/pages/Authentication/components/AuthenticationContext";
import AuthenticationContextValue from "@/pages/Authentication/types/AuthenticationContextValue";
import { Baby } from "@/pages/Authentication/types/Baby";
import CustomUser from "@/pages/Authentication/types/CustomUser";
import { getDefaulIntervalMethodByEntryTypeId } from "@/utils/getDefaulIntervalMethodByEntryTypeId";
import { getDefaultEntryTypesOrder } from "@/pages/Entry/utils/getDefaultEntryTypesOrder";
import isDevelopment from "@/utils/isDevelopment";
import { saveActivityContextsInState } from "@/state/slices/activitiesSlice";
import { useAppDispatch } from "@/state/hooks/useAppDispatch";

export function AuthenticationProvider(props: React.PropsWithChildren<{}>) {
  const dispatch = useAppDispatch();

  const [user, setUser] = useState<CustomUser | null>(null);

  const checkIfEmailIsAuthorized = async (email: string): Promise<boolean> => {
    const authorizedUsersDoc = await getDoc(doc(db, "appSettings", "authorizedUsers"));
    if (authorizedUsersDoc.exists()) {
      const authorizedUsers = authorizedUsersDoc.data();
      if (authorizedUsers) {
        return (authorizedUsers.emails as string[]).includes(email);
      }
    }
    return false;
  };

  const dispatchUserPreferences = (newUser: CustomUser) => {
    dispatch(
      saveIntervalMethodByEntryTypeIdInState({
        intervalMethodByEntryTypeId: newUser.intervalMethodByEntryTypeId,
      })
    );
    dispatch(
      saveEntryTypesOrderInState({
        entryTypesOrder: newUser.entryTypesOrder,
      })
    );
    const baby = newUser.babies?.find((baby) => baby.id === newUser.babyId);
    if (baby) {
      dispatch(
        saveActivityContextsInState({
          activityContexts: (baby.activityContexts as ActivityContext[]).map(
            (activityContext) => JSON.stringify(activityContext)
          ),
        })
      );
    }
  };

  const fetchUserDoc = (user: User) => {
    const userDocRef = doc(db, "users", user.uid);
    getDoc(userDocRef)
      .then((docSnap) => {
        if (docSnap.data() != null) {
          const newUser = docSnap.data() as CustomUser;
          // setUser(docSnap.data() as CustomUser);
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
                  if (docSnap.id == newUser.babyId) {
                    dispatch(
                      saveActivityContextsInState({
                        activityContexts: (
                          docData.activityContexts as ActivityContext[]
                        ).map((activityContext) =>
                          JSON.stringify(activityContext)
                        ),
                      })
                    );
                  }
                } else {
                  throw new Error("Birth date is null");
                }
              }
            });
            newUser.babies = newBabies;
          }
          dispatchUserPreferences(newUser);
          setUser(newUser);
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
    const unsubscribeFromAuthChanges = onAuthStateChanged(
      auth,
      async (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          await fetchUserDoc(user);
        } else {
          // User is signed out
          setUser(null);
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
      const unsubscribeFromBabyChanges = onSnapshot(babyDocRef, (doc) => {
        try {
          if (doc.exists()) {
            const babyData = doc.data();
            if (babyData) {
              const { birthDate, ...rest } = babyData;
              const parsedBirthDate = birthDate.toDate();
              if (parsedBirthDate) {
                let newUser = null;
                setUser((prevUser) => {
                  if (prevUser) {
                    const newBabies = prevUser.babies.map((baby) => {
                      if (baby.id === babyId) {
                        return {
                          id: babyId,
                          birthDate: parsedBirthDate as Date,
                          ...(rest as any),
                        };
                      }
                      return baby;
                    });
                    newUser = {
                      ...prevUser,
                      babies: newBabies,
                    };
                    return newUser;
                  }
                  return prevUser;
                });
                if (newUser != null) {
                  dispatchUserPreferences(newUser);
                }
              } else {
                throw new Error("Birth date is null");
              }
            } else {
              throw new Error("Baby data is null");
            }
          } else {
            // TODO: Handle case where baby doc does not exist (deleted by another user?)
            throw new Error("Baby doc does not exist");
          }
        } catch (error) {
          console.error("Error updating baby data in user", error);
        }
      });
      return () => {
        unsubscribeFromBabyChanges();
      };
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

        const isAuthorized = await checkIfEmailIsAuthorized(result.user.email);

        const additionalUserInfo = getAdditionalUserInfo(result);
        isNewUser = additionalUserInfo?.isNewUser;

        if (isAuthorized || isDevelopment()) {
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

  const context: AuthenticationContextValue = useMemo(() => {
    return {
      user,
      setUser,
      googleSignInWithPopup,
      signOut,
      checkIfEmailIsAuthorized,
    };
  }, [user, setUser, googleSignInWithPopup, signOut]);

  return <AuthenticationContext.Provider value={context} {...props} />;
}
