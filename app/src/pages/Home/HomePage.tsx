import {
  Box,
  Button,
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
import { useEffect, useState } from "react";

import { BabyWidget } from "@/components/BabyWidget";
import { EmptyState } from "@/components/EmptyState";
import { EmptyStateContext } from "@/enums/EmptyStateContext";
import { EntriesList } from "@/components/Entries/EntriesList/EntriesList";
import { EntriesWidget } from "@/pages/Home/components/EntriesWidget";
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
import { isNullOrWhiteSpace } from "@/utils/utils";
import { useAppDispatch } from "@/state/hooks/useAppDispatch";
import { useAuthentication } from "@/pages/Authentication/hooks/useAuthentication";
import { useEntries } from "@/components/Entries/EntriesProvider";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export function HomePage() {
  const { user } = useAuthentication();
  const navigate = useNavigate();
  const { recentEntries, isFetching } = useEntries();
  const dispatch = useAppDispatch();

  // TODO: Subscribe to entries changes only if user is Premium
  useEffect(() => {}, [user?.babyId]);

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
              paths: [user.babyId],
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
        <EntriesWidget entries={recentEntries} />
      </Section>

      <Section>
        {isFetching && recentEntries.length == 0 ? (
          <LoadingIndicator />
        ) : recentEntries.length == 0 ? (
          <EmptyState
            context={EmptyStateContext.Entries}
            onClick={handleEmptyStateClick}
          />
        ) : (
          <EntriesList entries={recentEntries} format="cards" />
        )}
      </Section>
    </SectionStack>
  );
}
