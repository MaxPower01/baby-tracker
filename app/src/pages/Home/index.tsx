import {
  Box,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import {
  addEntries,
  removeEntries,
  selectEntriesStatus,
  selectRecentEntries,
  updateEntries,
} from "@/state/entriesSlice";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";

import ActivitiesWidget from "@/pages/Activities/components/ActivitiesWidget";
import { BabyWidget } from "@/components/BabyWidget";
import Entries from "@/pages/Entries/components/Entries";
import EntriesList from "@/pages/Entries/components/EntriesList";
import { Entry } from "@/pages/Entry/types/Entry";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { MenuProvider } from "@/components/MenuProvider";
import { PageId } from "@/enums/PageId";
import { Section } from "@/components/Section";
import { SectionStack } from "@/components/SectionStack";
import { SectionTitle } from "@/components/SectionTitle";
import { db } from "@/firebase";
import getPath from "@/utils/getPath";
import { getRangeStartTimestampForRecentEntries } from "@/utils/getRangeStartTimestampForRecentEntries";
import { useAppDispatch } from "@/state/hooks/useAppDispatch";
import { useAuthentication } from "@/pages/Authentication/hooks/useAuthentication";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export function HomePage() {
  const { user } = useAuthentication();
  const navigate = useNavigate();
  const entries = useSelector(selectRecentEntries);
  const entriesStatus = useSelector(selectEntriesStatus);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user?.selectedChild != null) {
      const rangeStartTimestamp = getRangeStartTimestampForRecentEntries();
      const q = query(
        collection(db, `children/${user.selectedChild}/entries`),
        where("startDate", ">=", rangeStartTimestamp),
        orderBy("startDate", "desc")
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
            removeEntries({
              ids: removedEntries.map((entry) => entry.id ?? ""),
            })
          );
        }
        if (modifiedEntries.length > 0) {
          dispatch(
            updateEntries({
              entries: modifiedEntries.map((entry) => JSON.stringify(entry)),
            })
          );
        }
        if (addedEntries.length > 0) {
          dispatch(
            addEntries({
              entries: addedEntries.map((entry) => JSON.stringify(entry)),
            })
          );
        }
      });

      return () => unsubscribe();
    }
  }, [user?.selectedChild]);

  if (user?.selectedChild == null) {
    return <LoadingIndicator />;
  }

  return (
    <SectionStack>
      <Section
        onClick={() =>
          navigate(
            getPath({
              page: PageId.Child,
              id: user.selectedChild,
            })
          )
        }
        sx={{
          position: "relative",
        }}
      >
        <BabyWidget
          sx={{
            zIndex: 1,
          }}
        />
      </Section>

      {entriesStatus === "loading" && entries.length === 0 ? (
        <LoadingIndicator />
      ) : (
        <>
          <Section>
            <ActivitiesWidget entries={entries} />
          </Section>
          <Section>
            <EntriesList entries={entries} groupByDate />
          </Section>
        </>
      )}
    </SectionStack>
  );
}
