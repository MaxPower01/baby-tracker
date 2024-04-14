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
  addEntriesInState,
  removeEntriesFromState,
  selectEntriesStatus,
  selectRecentEntries,
  updateEntriesInState,
} from "@/state/slices/entriesSlice";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";

import { BabyWidget } from "@/components/BabyWidget";
import { EmptyState } from "@/components/EmptyState";
import { EmptyStateContext } from "@/enums/EmptyStateContext";
import { EntriesList } from "@/pages/History/components/EntriesList";
import { EntriesWidget } from "@/pages/History/components/EntriesWidget";
import { Entry } from "@/pages/Entry/types/Entry";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { MenuProvider } from "@/components/MenuProvider";
import { PageId } from "@/enums/PageId";
import { Section } from "@/components/Section";
import { SectionStack } from "@/components/SectionStack";
import { SectionTitle } from "@/components/SectionTitle";
import { bottomBarNewEntryFabId } from "@/utils/constants";
import { db } from "@/firebase";
import getPath from "@/utils/getPath";
import { getRangeStartTimestampForRecentEntries } from "@/utils/getRangeStartTimestampForRecentEntries";
import { isNullOrWhiteSpace } from "@/utils/utils";
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

  // TODO: Subscribe to entries changes only if user is Premium
  useEffect(() => {
    if (user?.babyId != null) {
      const rangeStartTimestamp = getRangeStartTimestampForRecentEntries();
      const q = query(
        collection(db, `babies/${user.babyId}/entries`),
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
            removeEntriesFromState({
              ids: removedEntries.map((entry) => entry.id ?? ""),
            })
          );
        }
        if (modifiedEntries.length > 0) {
          dispatch(
            updateEntriesInState({
              entries: modifiedEntries.map((entry) => JSON.stringify(entry)),
            })
          );
        }
        if (addedEntries.length > 0) {
          dispatch(
            addEntriesInState({
              entries: addedEntries.map((entry) => JSON.stringify(entry)),
            })
          );
        }
      });

      return () => unsubscribe();
    }
  }, [user?.babyId]);

  const handleEmptyStateClick = () => {
    const targetButton = document.getElementById(bottomBarNewEntryFabId);
    if (targetButton) {
      targetButton.click();
    }
  };

  if (user?.babyId == null || isNullOrWhiteSpace(user?.babyId)) {
    return <LoadingIndicator />;
  }

  return (
    <SectionStack>
      <Section
        onClick={() =>
          navigate(
            getPath({
              page: PageId.Baby,
              id: user.babyId,
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

      <Section>
        <EntriesWidget entries={entries} />
      </Section>

      <Section>
        {entriesStatus === "busy" ? (
          <LoadingIndicator />
        ) : entries.length === 0 ? (
          <EmptyState
            context={EmptyStateContext.Entries}
            onClick={handleEmptyStateClick}
          />
        ) : (
          <EntriesList entries={entries} /*groupByDate*/ />
        )}
      </Section>
    </SectionStack>
  );
}
