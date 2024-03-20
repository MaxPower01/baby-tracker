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
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import {
  selectEntriesStatus,
  selectRecentEntries,
} from "@/state/slices/entriesSlice";
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
import { useAuthentication } from "@/pages/Authentication/hooks/useAuthentication";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export function HomePage() {
  const { user } = useAuthentication();
  const navigate = useNavigate();
  const entries = useSelector(selectRecentEntries);
  const entriesStatus = useSelector(selectEntriesStatus);

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
            // const entry = EntryModel.fromFirestore(change.doc.data());
            // entry.id = change.doc.id;
            // if (change.type === "added") {
            //   addedEntries.push(entry);
            // } else if (change.type === "modified") {
            //   modifiedEntries.push(entry);
            // } else if (change.type === "removed") {
            //   removedEntries.push(entry);
            // }
          }
        });
        if (
          addedEntries.length > 0 ||
          modifiedEntries.length > 0 ||
          removedEntries.length > 0
        ) {
          // setEntries((prevEntries) => {
          //   let newEntries = [...prevEntries];
          //   removedEntries.forEach((removedEntry) => {
          //     newEntries = newEntries.filter(
          //       (entry) => entry.id !== removedEntry.id
          //     );
          //   });
          //   addedEntries.forEach((addedEntry) => {
          //     if (!newEntries.some((entry) => entry.id === addedEntry.id)) {
          //       newEntries.push(addedEntry);
          //     }
          //   });
          //   modifiedEntries.forEach((modifiedEntry) => {
          //     newEntries = newEntries.map((entry) => {
          //       if (entry.id == modifiedEntry.id) {
          //         return modifiedEntry;
          //       }
          //       return entry;
          //     });
          //   });
          //   newEntries.sort((a, b) => {
          //     return (
          //       b.startTimestamp.toDate().getTime() -
          //       a.startTimestamp.toDate().getTime()
          //     );
          //   });
          //   return [...newEntries];
          // });
        }
      });

      return () => unsubscribe();
    }
  }, [user?.selectedChild]);

  if (user?.selectedChild == null) {
    return <LoadingIndicator />;
  }

  if (entriesStatus === "loading" && entries.length === 0) {
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
            <EntriesList entries={entries} dateHeaders />
          </Section>
        </>
      )}
    </SectionStack>
  );
}
