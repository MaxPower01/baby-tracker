import {
  addRecentEntriesInState,
  fetchRecentEntriesFromDB,
  removeRecentEntriesFromState,
  updateRecentEntriesInState,
} from "@/state/slices/entriesSlice";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { BottomBar } from "@/components/BottomBar";
import { CSSBreakpoint } from "@/enums/CSSBreakpoint";
import { Container } from "@mui/material";
import { Entry } from "@/pages/Entry/types/Entry";
import { MenuProvider } from "@/components/MenuProvider";
import { PrivateRoutes } from "@/components/PrivateRoutes";
import { PublicRoutes } from "@/components/PublicRoutes";
import { TopBar } from "@/components/TopBar";
import { db } from "@/firebase";
import { error } from "console";
import { getRangeStartTimestampForRecentEntries } from "@/utils/getRangeStartTimestampForRecentEntries";
import { isNullOrWhiteSpace } from "@/utils/utils";
import { useAppDispatch } from "@/state/hooks/useAppDispatch";
import { useAuthentication } from "@/pages/Authentication/hooks/useAuthentication";
import { useEffect } from "react";

let didInit = false;
let didInitUser = false;

export function App() {
  const { user } = useAuthentication();
  const babyId = user?.babyId ?? "";
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!didInit) {
      didInit = true;

      // Code here will run only once per app load
    }
  }, []);

  useEffect(() => {
    if (!isNullOrWhiteSpace(babyId) && !didInitUser) {
      didInitUser = true;

      // Code here will run only once per app load if the user is not null

      dispatch(fetchRecentEntriesFromDB({ babyId }));

      const rangeStartTimestamp = getRangeStartTimestampForRecentEntries();

      const q = query(
        collection(db, `babies/${babyId}/entries`),
        where("startTimestamp", ">=", rangeStartTimestamp),
        orderBy("startTimestamp", "desc")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const addedEntries: Entry[] = [];
        const modifiedEntries: Entry[] = [];
        const removedEntries: Entry[] = [];

        snapshot.docChanges().forEach((change) => {
          if (change.doc.data() != null) {
            const entry = change.doc.data() as Entry;
            entry.id = change.doc.id;
            if (change.type === "added") {
              addedEntries.push(entry);
            } else if (change.type === "modified") {
              modifiedEntries.push(entry);
            } else if (change.type === "removed") {
              removedEntries.push(entry);
            }
          }
        });

        if (removedEntries.length > 0) {
          dispatch(
            removeRecentEntriesFromState({
              ids: removedEntries.map((entry) => entry.id ?? ""),
            })
          );
        }

        if (modifiedEntries.length > 0) {
          dispatch(
            updateRecentEntriesInState({
              entries: modifiedEntries.map((entry) => JSON.stringify(entry)),
            })
          );
        }

        if (addedEntries.length > 0) {
          dispatch(
            addRecentEntriesInState({
              entries: addedEntries.map((entry) => JSON.stringify(entry)),
            })
          );
        }
      });

      return () => unsubscribe();
    }
  }, [user, babyId, dispatch]);

  return (
    <>
      {user != null && <TopBar component={"header"} />}

      <Container
        component={"main"}
        maxWidth={CSSBreakpoint.Small}
        sx={{
          paddingTop: 2,
          paddingBottom: 20,
        }}
      >
        {user == null ? <PublicRoutes /> : <PrivateRoutes />}
      </Container>

      {user != null && (
        <MenuProvider>
          <BottomBar component={"footer"} />
        </MenuProvider>
      )}
    </>
  );
}
